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
    node: processNode(node)
  });
}

// sends message which triggers updating of node
function updateViaMessage(node) {
  window.postMessage({
    type: 'updateNode',
    node: processNode(node)
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
    tagName: node.tagName
  }

  //check for component type node or text type node
  switch (node.type) {
    case 'component': {
      if (!node.detail.$$) {
        processedNode.detail = {};
        break;
      }

      const internal = node.detail.$$;
      const props = Array.isArray(internal.props)
        ? internal.props // Svelte < 3.13.0 stored props names as an array
        : Object.keys(internal.props);
      let ctx = clone(
        shouldUseCapture() ? node.detail.$capture_state() : internal.ctx
      );
      if (ctx === undefined) ctx = {};

      processedNode.detail = {
        attributes: props.flatMap(key => {
          const value = ctx[key]
          delete ctx[key]
          return value === undefined
            ? []
            : { key, value, isBound: key in internal.bound }
        }),
        listeners: Object.entries(internal.callbacks).flatMap(
          ([event, value]) => value.map(o => ({ event, handler: o.toString() }))
        ),
        ctx: Object.entries(ctx).map(([key, value]) => ({ key, value }))
      }
      break;
    }

    case 'element': {
      const element = node.detail
      processedNode.detail = {
        attributes: Array.from(element.attributes).map(attr => ({
          key: attr.name,
          value: attr.value
        })),
        listeners: element.__listeners
          ? element.__listeners.map(o => ({
              ...o,
              handler: o.handler.toString()
            }))
          : []
      }
      break;
    }
  }
  return processedNode;
}

// array to hold root nodes (not useful yet)
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
    // parentBlock: currentBlock,
    children: []
  }
  console.log('node is ', node);
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

// ========================================================================================
//          EVENT CALLBACK FUNCTIONS
// ========================================================================================

//function is called when the 'SvelteRegisterComponent' event is dispatched
function EVENT_CALLBACK_SvelteRegisterComponent (event) {
  const { component, tagName } = event.detail

  //grab the content element associated with the node
  const node = nodeMap.get(component.$$.fragment)

  //if it exists, update the nodeMap. else add it to the nodeMap.
  if (node) {
    nodeMap.delete(component.$$.fragment)

    node.detail = component
    node.tagName = tagName

    updateViaMessage(node)
  } else {
    console.log('component is ', component);
    nodeMap.set(component.$$.fragment, {
      type: 'component',
      detail: component,
      tagName
    })
  }
  console.log('nodeMap is ', nodeMap);
}

//function is called when the 'SvelteDOMInsert' event is dispatched
function EVENT_CALLBACK_SvelteDOMInsert (event) {
  const { node: element, target, anchor } = event.detail;

  insert(element, target, anchor);
}

//function is called when the 'SvelteDOMSetData' event is dispatched
// function EVENT_CALLBACK_SvelteDOMSetData (event) {
//   console.log('EVENT_CALLBACK_SvelteDOMSetData: event is ', event);
//   const node = nodeMap.get(event)
//   console.log('EVENT_CALLBACK_SvelteDOMSetData: node is ', node);
//   if (!node) return

//   if (node.type == 'anchor') node.type = 'text'

//   updateViaMessage(node);
// }

// function svelteUpdateNode (e) {
//   console.log('svelteUpdateNode: e is ', e);
//   updateElement(e.detail.node);
// }

function EVENT_CALLBACK_SvelteDOMSetData(event) {
  const node = nodeMap.get(event.detail.node)
  if (!node) return;

  if (node.type == 'anchor') node.type = 'text';

  console.log('EVENT_CALLBACK_SvelteDOMSetData: node is ', node);
  updateViaMessage(node);
}

// ========================================================================================
//          SETUP
// ========================================================================================

//run at launch of debugger tool
function SVOLTE_SETUP (root) {
  console.log('dummy');

  root.addEventListener('SvelteRegisterComponent', EVENT_CALLBACK_SvelteRegisterComponent);
  root.addEventListener('SvelteDOMInsert', EVENT_CALLBACK_SvelteDOMInsert);
  root.addEventListener('SvelteDOMSetData', EVENT_CALLBACK_SvelteDOMSetData);
}

SVOLTE_SETUP(window.document)