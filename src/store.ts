import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

const nodeMap = new Map();
export const rootNodes:Writable<[]> = writable([]);

//we want to dynamically add to treeData
export const treeData = writable({});

// switch between tree and time travel panels
export const pathStore = writable({
  path: 'tree', 
  setPath: () => {
    pathStore.update((state) => {
      if (state.path === 'tree') {
        console.log('proceed');
        return { ...state, path: 'time' };
      } else {
        return { ...state, path: 'tree' };
      }
    });
  }
});

const backgroundPageConnection = chrome.runtime.connect();

// report back with tabId to identify devtools location in chrome
backgroundPageConnection.postMessage({
  name: "INIT",
  tabId: chrome.devtools.inspectedWindow.tabId,
});

// background.js -> here

backgroundPageConnection.onMessage.addListener((message: object) => {
  switch (message.type) {
    
    case 'clear': {
      console.log('entering clear');
      rootNodes.set([]);
    }

    case 'addNode': {
      const node = message.node;
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

      break
    }

    case 'updateNode': {
      const node = nodeMap.get(message.node.id);
      const parentComponent = eventBubble(node);

      // console.log('before is ', parentComponent);
      Object.assign(node, message.node);

      const test = eventBubble(node);
      // console.log('after is ', test);
      

      // const selected = get(selectedNode);
      // if (selected && selected.id == message.node.id) selectedNode.update(o => o);

      node.invalidate();

      break;
    }

    case 'removeNode': {
      const node = nodeMap.get(message.node.id);
      nodeMap.delete(node.id);

      if (!node.parent) break;

      const index = node.parent.children.findIndex(o => o.id == node.id);
      node.parent.children.splice(index, 1);

      node.parent.invalidate();

      break;
    }
  }
  console.log('rootNodes is', get(rootNodes));
})

function insertNode(node, target, anchorId) {
  node.parent = target;

  let index = -1;
  if (anchorId) index = target.children.findIndex(o => o.id == anchorId);

  if (index != -1) {
    target.children.splice(index, 0, node);
  } else {
    target.children.push(node);
  }

  target.invalidate();
}

function noop() {};

function eventBubble(node) {
  //return nearest component parent
  while (node) {
    if (node.parent.type === 'component') return node.parent;
    node = node.parent;
  }
  return;
}

// listen for inc messages from background.js, update state