import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";


// initialize states

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

export const treeData = writable({});
//we want to dynamically add to treeData
export const rootNodes:Writable<[]> = writable([])

const backgroundPageConnection = chrome.runtime.connect();

// report back with tabId to identify devtools location in chrome
backgroundPageConnection.postMessage({
  name: "INIT",
  tabId: chrome.devtools.inspectedWindow.tabId,
});

// background.js -> here

backgroundPageConnection.onMessage.addListener((message: Object) => {
  if (message.type === 'addNode') {
    console.log('store has message received: ', message);
  }
});

const nodeMap = new Map();

backgroundPageConnection.onMessage.addListener((message: Object) => {
  switch (message.type) {

    case 'addNode': {
      const node = message.node
      node.children = []
      // node.collapsed = true
      node.invalidate = noop
      // resolveEventBubble(node)

      const targetNode = nodeMap.get(message.target)
      nodeMap.set(node.id, node)

      if (targetNode) {
        insertNode(node, targetNode, message.anchor)
        return
      }

      if (node._timeout) return

      node._timeout = setTimeout(() => {
        delete node._timeout
        const targetNode = nodeMap.get(message.target)
        if (targetNode) insertNode(node, targetNode, message.anchor)
        else rootNodes.update(o => (o.push(node), o))
      }, 100)

      break
    }

    case 'updateNode': {
      const node = nodeMap.get(message.node.id)
      Object.assign(node, message.node)
      // resolveEventBubble(node)

      // const selected = get(selectedNode)
      // if (selected && selected.id == message.node.id) selectedNode.update(o => o)

      node.invalidate()

      break
    }
  }
  console.log('rootNodes is', get(rootNodes));
})

function insertNode(node, target, anchorId) {
  node.parent = target

  let index = -1
  if (anchorId) index = target.children.findIndex(o => o.id == anchorId)

  if (index != -1) {
    target.children.splice(index, 0, node)
  } else {
    target.children.push(node)
  }

  target.invalidate()
}

function noop() {};

// listen for inc messages from background.js, update state