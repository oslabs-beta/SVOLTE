import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Message, Node, SnapShot, Difference } from './types';
const { devtools, runtime } = chrome;

const nodeMap = new Map();
export const rootNodes: Writable<Node[]> = writable([]);
export const snapShotHistory: Writable<SnapShot[]> = writable([]);
export const selected: Writable<SnapShot> = writable(null);
export const skipArr: Writable<number[]> = writable([]);
export const currentSnapShot: Writable<number> = writable(0);
let shaveCounter: number = 0;

//we want to dynamically add to treeData
export const treeData = writable({});

// switch between tree and time travel panels
export const pathStore = writable({
  path: 'tree',
  setPath: () => {
    pathStore.update((state) => {
      if (state.path === 'tree') {
        return { ...state, path: 'time' };
      } else {
        return { ...state, path: 'tree' };
      }
    });
  },
});

export function reload() {
  backgroundPageConnection.postMessage({
    type: 'RELOAD',
    tabId: devtools.inspectedWindow.tabId,
  });
}
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
    case 'clear': {
      rootNodes.set([]);
      break;
    }

    // add nodes to the nodeMap
    case 'addNode': {
      const node: Node = message.node;
      node.children = [];
      // node.collapsed = true;
      node.invalidate = noop;

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
        else {
          node.tagName = 'Root';
          rootNodes.set([node]);
        }
      }, 100);

      break;
    }

    // update nodes within the nodeMap
    case 'updateNode': {
      const node = nodeMap.get(message.node.id);

      addSnapShot(node, message);

      Object.assign(node, message.node);

      node.invalidate();

      break;
    }

    // remove nodes from the nodeMap
    case 'removeNode': {
      const node = nodeMap.get(message.node.id);
      nodeMap.delete(node.id);

      if (!node.parent) break;

      const index = node.parent.children.findIndex((obj) => obj.id == node.id);
      node.parent.children.splice(index, 1);

      node.parent.invalidate();

      break;
    }
  }
});

// ================================================================================
//
// ================================================================================

function insertNode(node: Node, target: Node, anchorId: number): void {
  node.parent = target;

  let index = -1;
  if (anchorId) index = target.children.findIndex((obj) => obj.id == anchorId);

  if (index != -1) {
    target.children.splice(index, 0, node);
  } else {
    target.children.push(node);
  }

  target.invalidate();
}

function noop() {}

// adds a snapshot of the components state and difference to an array of all our state changes (history)
function addSnapShot(prevNode, message) {
  const { node } = message;
  if (
    node.type === 'component' &&
    node.tagName !== 'Root' &&
    node.tagName !== 'Unknown'
  ) {
    const differences: Array<Difference> = [];
    compareObjects(prevNode.detail.ctx, node.detail.ctx, differences);
    if (differences.length && !shaveCounter) {
      node.diff = differences;
      node._id = get(snapShotHistory).length;
      snapShotHistory.update((prev) => [...prev, node]);
      currentSnapShot.set(get(snapShotHistory).length - 1);
    }
    if (shaveCounter) --shaveCounter;
  }
}

function compareObjects(
  node1: Node,
  node2: Node,
  differences: any[] = [],
  path: string[] = []
) {
  for (const key in node1) {
    if (typeof node1[key] === 'function') {
      continue; // Ignore functions
    }

    if (typeof node1[key] === 'object' && typeof node2[key] === 'object') {
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
export function process_ctx(ctx_array: any[]): any[] {
  // helper function that returns boolean based on if the element contains a function
  function hasFunction(obj) {
    if (typeof obj !== 'object' || obj === null) {
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
// iterate through the history array from the current snapshot backwards to the desired snapshot
// as we iterate through, undo the state changes from slice to slice
export function jump(snapshotID) {
  // counter that indicates how many elements to shave off the history array as we are adding unnecessary events by jumping
  shaveCounter = 0;

  // going backwards in time
  if (get(currentSnapShot) > snapshotID) {
    for (let i = get(currentSnapShot) - 1; i >= snapshotID; i--) {
      if (get(skipArr).includes(i)) {
        continue;
      }
      ++shaveCounter;
      const component_id = get(snapShotHistory)[i].id;
      const targetState = get(snapShotHistory)[i].detail.ctx;
      const JSONd_state = JSON.stringify(targetState).replaceAll('\\', '\\\\');
      devtools.inspectedWindow.eval(
        `window.SVOLTE_INJECT_STATE(${component_id}, '${JSONd_state}')`,
        (result, error) => console.log('result is ', result, 'error is ', error)
      );
    }
  }

  // going forwards in time
  else if (get(currentSnapShot) < snapshotID) {
    for (let i = get(currentSnapShot) + 1; i <= snapshotID; i++) {
      if (get(skipArr).includes(i)) {
        continue;
      }
      ++shaveCounter;
      const component_id = get(snapShotHistory)[i].id;
      const targetState = get(snapShotHistory)[i].detail.ctx;
      const JSONd_state = JSON.stringify(targetState).replaceAll('\\', '\\\\');
      devtools.inspectedWindow.eval(
        `window.SVOLTE_INJECT_STATE(${component_id}, '${JSONd_state}')`,
        (result, error) => console.log('result is ', result, 'error is ', error)
      );
    }
  }

  //set our current place in time to where we just traveled to
  currentSnapShot.set(snapshotID);
}
