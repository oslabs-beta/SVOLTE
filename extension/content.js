//MAIN WORLD

// ========================================================================================
//          DATA STORAGE & VARIABLES
// ========================================================================================

// map that will store all nodes
const nodeMap = new Map();

//unique id attached to each node
let _id = 0;

// ========================================================================================
//          MESSAGE FUNCTIONS
// ========================================================================================

// sends message which triggers adding of node
function addViaMessage(node) {
  window.postMessage({
    target: node.parent ? node.parent.id : null,
    type: 'addNode',
    node: processNode(node),
    source: 'content.js',
  });
}

// sends message which triggers updating of node
function updateViaMessage(node) {
  window.postMessage({
    type: 'updateNode',
    node: processNode(node),
    source: 'content.js',
  });
}

// sends message which triggers removal of node
function removeViaMessage(node) {
  window.postMessage({
    type: 'removeNode',
    node: processNode(node),
    source: 'content.js',
  });
}

// ========================================================================================
//          NODE PROCESSING
// ========================================================================================

// receives node and processes it for relevant information
function processNode(node) {
  // cleaned-up node template
  const processedNode = {
    id: node.id,
    type: node.type,
    tagName: node.tagName,
  };

  //check for component type node or text type node
  switch (node.type) {
    case 'component': {
      if (!node.detail.$$) {
        processedNode.detail = {};
        break;
      }
      const internal = node.detail.$$;
      // Older versions of Svelte stored props in an array
      const props = Array.isArray(internal.props)
        ? internal.props 
        : Object.keys(internal.props);
      let ctx = deepClone(node.detail.$capture_state());
      if (ctx === undefined) ctx = {};

      processedNode.detail = {
        attributes: props.flatMap((key) => {
          const value = ctx[key];
          delete ctx[key];
          return value === undefined
            ? []
            : { key, value, isBound: key in internal.bound };
        }),
        listeners: Object.entries(internal.callbacks).flatMap(
          ([event, value]) =>
            value.map((obj) => ({ event, handler: obj.toString() }))
        ),
        ctx: Object.entries(ctx).map(([key, value]) => ({ key, value })),
      };
      break;
    }

    case 'element': {
      const element = node.detail;
      processedNode.detail = {
        attributes: Array.from(element.attributes).map((attr) => ({
          key: attr.name,
          value: attr.value,
        })),
        listeners: element.__listeners
          ? element.__listeners.map((obj) => ({
              ...obj,
              handler: obj.handler.toString(),
            }))
          : [],
      };
      break;
    }
  }
  return processedNode;
}

function deepClone(value, seen = new Map()) {
  switch (typeof value) {
    case 'function':
      return { __isFunction: true, source: value.toString(), name: value.name };
    case 'symbol':
      return { __isSymbol: true, name: value.toString() };
    case 'object':
      if (value === window || value === null) return null;
      if (Array.isArray(value)) return value.map((obj) => deepClone(obj, seen));
      if (seen.has(value)) return {};

      const obj = {};
      seen.set(value, obj);

      for (const [key, val] of Object.entries(value)) {
        obj[key] = deepClone(val, seen);
      }

      return obj;
    default:
      return value;
  }
}

// array to hold root node
const rootNodes = [];

// ========================================================================================
//          DOM NODE FUNCTIONS
// ========================================================================================

// called by the SvelteDOMInsert callback
function insert(element, target, anchor) {
  const node = {
    id: _id++,
    type:
      element.nodeType == 1
        ? 'element'
        : element.nodeValue && element.nodeValue != ' '
        ? 'text'
        : 'anchor',
    detail: element,
    tagName: element.nodeName.toLowerCase(),
    parentBlock: currentBlock,
    children: [],
  };
  addNode(node, target, anchor);

  for (const child of element.childNodes) {
    if (!nodeMap.has(child)) insert(child, element);
  }
}

// called by insert()
function addNode(node, target, anchor) {
  nodeMap.set(node.id, node);
  nodeMap.set(node.detail, node);

  let targetNode = nodeMap.get(target);

  if (!targetNode || targetNode.parentBlock != node.parentBlock) {
    targetNode = node.parentBlock;
  }

  node.parent = targetNode;

  const anchorNode = nodeMap.get(anchor);

  if (targetNode) {
    let index = -1;
    if (anchorNode) index = targetNode.children.indexOf(anchorNode);

    if (index != -1) {
      targetNode.children.splice(index, 0, node);
    } else {
      targetNode.children.push(node);
    }
  } else {
    rootNodes.push(node);
  }
  addViaMessage(node, anchorNode);
}

function removeNode(node) {
  if (!node) return;

  nodeMap.delete(node.id);
  nodeMap.delete(node.detail);

  const index = node.parent.children.indexOf(node);
  node.parent.children.splice(index, 1);
  node.parent = null;

  removeViaMessage(node);
}

// ========================================================================================
//          EVENT CALLBACK FUNCTIONS
// ========================================================================================

let currentBlock;

function EVENT_CALLBACK_SvelteRegisterBlock(e) {
  const { type, id, block, ...detail } = e.detail;
  const tagName = type == 'pending' ? 'await' : type;
  const nodeId = _id++;

  function updateProfile(node, type, fn, ...args) {
    fn(...args);
  }

  if (block.m) {
    const mountFn = block.m;
    block.m = (target, anchor) => {
      const parentBlock = currentBlock;
      let node = {
        id: nodeId,
        type: 'block',
        detail,
        tagName,
        parentBlock,
        children: [],
      };

      switch (type) {
        case 'then':
        case 'catch':
          if (!node.parentBlock) node.parentBlock = lastPromiseParent;
          break;

        case 'slot':
          node.type = 'slot';
          break;

        case 'component':
          const componentNode = nodeMap.get(block);
          if (componentNode) {
            nodeMap.delete(block);
            Object.assign(node, componentNode);
          } else {
            Object.assign(node, {
              type: 'component',
              tagName: 'Unknown',
              detail: {},
            });
            nodeMap.set(block, node);
          }

          Promise.resolve().then(
            () =>
              node.detail.$$ &&
              Object.keys(node.detail.$$.bound).length &&
              updateViaMessage(node)
          );
          break;
      }

      if (type == 'each') {
        let group = nodeMap.get(parentBlock.id + id);
        if (!group) {
          group = {
            id: _id++,
            type: 'block',
            detail: {
              ctx: {},
              source: detail.source,
            },
            tagName: 'each',
            parentBlock,
            children: [],
          };
          nodeMap.set(parentBlock.id + id, group);
          addNode(group, target, anchor);
        }
        node.parentBlock = group;
        node.type = 'iteration';
        addNode(node, group, anchor);
      } else {
        addNode(node, target, anchor);
      }

      currentBlock = node;
      updateProfile(node, 'mount', mountFn, target, anchor);
      currentBlock = parentBlock;
    };
  }

  if (block.p) {
    const patchFn = block.p;
    block.p = (changed, ctx) => {
      const parentBlock = currentBlock;
      currentBlock = nodeMap.get(nodeId);
      updateViaMessage(currentBlock);
      updateProfile(currentBlock, 'patch', patchFn, changed, ctx);
      currentBlock = parentBlock;
    };
  }

  if (block.d) {
    const detachFn = block.d;
    block.d = (detach) => {
      const node = nodeMap.get(nodeId);

      if (node) {
        if (node.tagName == 'await') lastPromiseParent = node.parentBlock;
        removeNode(node);
      }
      updateProfile(node, 'detach', detachFn, detach);
    };
  }
}

//function is called when the 'SvelteRegisterComponent' event is dispatched
function EVENT_CALLBACK_SvelteRegisterComponent(event) {
  const { component, tagName } = event.detail;

  //grab the content element associated with the node
  const node = nodeMap.get(component.$$.fragment);

  //if it exists, update the nodeMap. else add it to the nodeMap.
  if (node) {
    nodeMap.delete(component.$$.fragment);

    node.detail = component;
    node.tagName = tagName;

    updateViaMessage(node);
  } else {
    nodeMap.set(component.$$.fragment, {
      type: 'component',
      detail: component,
      tagName,
    });
  }
}

//function is called when the 'SvelteDOMInsert' event is dispatched
function EVENT_CALLBACK_SvelteDOMInsert(event) {
  const { node: element, target, anchor } = event.detail;

  insert(element, target, anchor);
}

function EVENT_CALLBACK_SvelteDOMSetData(event) {
  const node = nodeMap.get(event.detail.node);
  if (!node) return;

  if (node.type == 'anchor') node.type = 'text';

  updateViaMessage(node);
}

function EVENT_CALLBACK_SvelteDOMRemove(event) {
  const node = nodeMap.get(event.detail.node);

  if (!node) return;
  removeNode(node);
}

// ========================================================================================
//          TIME-TRAVEL FUNCTIONS
// ========================================================================================

window.SVOLTE_INJECT_STATE = function (component_id, state) {
  const updated_ctx = JSON.parse(state);
  const targetComponentDetail = nodeMap.get(component_id).detail;
  const componentState = targetComponentDetail.$capture_state();
  const newState = processState(componentState, updated_ctx);
  targetComponentDetail.$inject_state(newState);
};

function processState(state, ctx) {
  // flatten ctx to be key : value
  const flattened_ctx = {};
  for (const obj of ctx) flattened_ctx[obj.key] = obj.value;

  // create new array to hold all keys of state where the key begins with $
  const blingArray = Object.keys(state).filter((el) => el[0] === '$');

  // new array that holds previous array keys without $
  const shavedBlingArray = blingArray.map((el) => el.slice(1));

  // iterate through the array and invoke the set function within the state argument
  for (const index in shavedBlingArray) {
    if (blingArray[index] in flattened_ctx)
      state[shavedBlingArray[index]].set(flattened_ctx[blingArray[index]]);
  }

  const resultState = { ...state, ...flattened_ctx };

  return resultState;
}


// ========================================================================================
//          SETUP
// ========================================================================================

function SVOLTE_SETUP(root) {
  root.addEventListener('SvelteRegisterBlock',EVENT_CALLBACK_SvelteRegisterBlock);
  root.addEventListener('SvelteRegisterComponent',EVENT_CALLBACK_SvelteRegisterComponent);
  root.addEventListener('SvelteDOMInsert', EVENT_CALLBACK_SvelteDOMInsert);
  root.addEventListener('SvelteDOMSetData', EVENT_CALLBACK_SvelteDOMSetData);
  root.addEventListener('SvelteDOMRemove', EVENT_CALLBACK_SvelteDOMRemove);
}

SVOLTE_SETUP(window.document);