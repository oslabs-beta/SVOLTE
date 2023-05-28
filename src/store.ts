import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";
import type { Message, Node, SnapShot } from "./types";
const { devtools, runtime, scripting } = chrome;

const nodeMap = new Map();
export const rootNodes:Writable<[]> = writable([]);
export let snapShotHistory: Writable<SnapShot[]> = writable([]);
let currentSnapShot: number = 0;

//we want to dynamically add to treeData
export const treeData = writable({});

// switch between tree and time travel panels
export const pathStore = writable({
  path: "tree",
  setPath: () => {
    pathStore.update((state) => {
      if (state.path === "tree") {
        console.log("proceed");
        return { ...state, path: "time" };
      } else {
        return { ...state, path: "tree" };
      }
    });
  },
});


// ================================================================================
//              MESSAGING
// ================================================================================

// establish connection
const backgroundPageConnection = runtime.connect();

// message background with tabID 
backgroundPageConnection.postMessage({
  type: 'INIT',
  tabId: devtools.inspectedWindow.tabId,
});

// listen for messages from background
backgroundPageConnection.onMessage.addListener((message: Message) => {

  switch (message.type) {
    
    // used when refreshing page or disconnecting
    case "clear": {
      rootNodes.set([]);
      break;
    }

    // add nodes to the nodeMap
    case "addNode": {
      const node: Node = message.node;
      node.children = [];
      // node.collapsed = true;
      node.invalidate = noop;
      // resolveEventBubble(node);

      const targetNode = nodeMap.get(message.target);
      nodeMap.set(node.id, node);

      if (targetNode) {
        insertNode(node, targetNode, message.anchor);
        return;
      }

      if (node._timeout) return;

      node._timeout = setTimeout(() => {
        delete node._timeout;
        const targetNode = nodeMap.get(message.target);
        if (targetNode) insertNode(node, targetNode, message.anchor);
        else rootNodes.update(o => ((node.tagName = "Root"), o.push(node), o));
      }, 100)


      break;
    }

    // update nodes within the nodeMap
    case "updateNode": {
      const node = nodeMap.get(message.node.id);

      // const parentComponent = eventBubble(node);

      addState(node, message);

      Object.assign(node, message.node);
      // const selected = get(selectedNode);
      // if (selected && selected.id == message.node.id) selectedNode.update(o => o);

      node.invalidate();

      break;
    }

    // remove nodes from the nodeMap
    case "removeNode": {
      const node = nodeMap.get(message.node.id);
      nodeMap.delete(node.id);

      if (!node.parent) break;

      const index = node.parent.children.findIndex((o) => o.id == node.id);
      node.parent.children.splice(index, 1);

      node.parent.invalidate();

      break;
    }
  }
});

// ================================================================================
//              
// ================================================================================

function insertNode(node, target, anchorId) {
  node.parent = target;

  let index = -1;
  if (anchorId) index = target.children.findIndex((o) => o.id == anchorId);

  if (index != -1) {
    target.children.splice(index, 0, node);
  } else {
    target.children.push(node);
  }

  target.invalidate();
}

function noop() {}

function eventBubble(node) {
  //return nearest component parent
  if (node.type === "component") {
    return node;
  }
  while (node) {
    if (node.parent?.type === "component") {
      break;
    }
    node = node.parent;
  }
  return node.parent;
}

function addState(prevNode, message) {
  const { node } = message;
  if (
    node.type === "component" &&
    node.tagName !== "Root" &&
    node.tagName !== "Unknown"
  ) {
    const differences = [];
    compareObjects(prevNode.detail.ctx, node.detail.ctx, differences);
    if (differences.length) {
      node.diff = differences;
      node._id = get(snapShotHistory).length;
      snapShotHistory.update((prev) => [...prev, node]);
      console.log("snap shot history is:", get(snapShotHistory));
      currentSnapShot = get(snapShotHistory).length - 1;
    }
  }
}

function compareObjects(
  node1: Node,
  node2: Node,
  differences: any[] = [],
  path: string[] = []
) {
  for (const key in node1) {
    if (typeof node1[key] === "function") {
      continue; // Ignore functions
    }

    if (typeof node1[key] === "object" && typeof node2[key] === "object") {
      const newPath = [...path, key];
      compareObjects(node1[key], node2[key], differences, newPath); // Recursively compare nested objects
    } else {
      if (node1[key] !== node2[key]) {
        differences.push({
          id: differences.length,
          path: [...path, key],
          value1: node1[key],
          value2: node2[key],
        }); // Add the difference to the array
      }
    }
  }
}

// function takes as input a ctx array and returns a processed ctx without functions
function process_ctx(ctx_array) {

  // helper function that returns boolean based on if the element contains a function
  function hasFunction(obj) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
  
    if (obj.__isFunction) {
      return true;
    }
  
    for (const key in obj) {
      if (typeof obj[key] === 'function' || hasFunction(obj[key])) {
        return true;
      }
    }
    return false;
  }

  // new array to hold processed ctx elements
  const processed_ctx = [];

  // iterate through the given ctx array and check for functions
  for (let i = 0; i < ctx_array.length; i++) {
    if (!hasFunction(ctx_array[i])) processed_ctx.push(ctx_array[i]);
  }
  return processed_ctx;
}


// this function is used to jump to the user selected slice of time in state history
export function jump(snapshotID) {
  // iterate through the history array from the current snapshot backwards to the desired snapshot
  // as we iterate through, undo the state changes from slice to slice
  for (let i = currentSnapShot; i > snapshotID; i--) {
  const component_id = get(snapShotHistory)[currentSnapShot].id;
  const targetState = get(snapShotHistory)[currentSnapShot].detail;

  const processed_state = process_ctx(targetState.ctx);
  const json_processed = JSON.stringify(processed_state);
  console.log('process_ctx(targetState.ctx) is ', process_ctx(targetState.ctx));
  console.log('JSON.stringify(processed_state) is ', JSON.stringify(processed_state));

  devtools.inspectedWindow.eval(`window.SVOLTE_INJECT_STATE(${component_id}, '${json_processed}')`, (result, error) => console.log('result is ', result, 'error is ', error));
  }
  // devtools.inspectedWindow.eval(`funcname()`,  

}


function sendJumpMessage(componentID, newState) {
  backgroundPageConnection.postMessage({
    type: 'INJECT',
    componentID: componentID,
    newState: newState
  })
}

