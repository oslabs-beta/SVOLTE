//MAIN WORLD

// window.__SVOLTE_select_element = function(element) {

// }

window.document.addEventListener("SvelteRegisterComponent", (e) => {
  const { component, tagName } = e.detail;
  const detail = e.detail;
  const state = e.detail.component.$capture_state();
  console.log('root is ', e.detail)

  // arr.push(component);
  // console.log('e from registerComponent is ', e);
  // console.log("detail from content.js is ", detail);
  // console.log("component from content.js is ", component);
  // console.log("state from content.js is ", state);

  // window.postMessage({
  //   msg: msg,
  //   source: "content.js",
  // });
});

// window.document.addEventListener("SvelteRegisterBlock", (e) => {
//   console.log('block is ', e);
// })


window.document.addEventListener("SvelteDOMSetData", (e) => {
  const { node, data } = e.detail;
  walkTree(node);
  // console.log('counter state is ', svelteComponents.Counter.$capture_state());

  // check for navbar because we will exclude pushing navbar component state changes
  // let navBarExist = false;
  // if (document.getElementById("svelte-announcer")) navBarExist = true;
  // console.log('navBarExist: ', navBarExist);

  //component that holds the state
  const affectedComponent = e.detail.node.parentElement;

  console.log('e.detail is ', e.detail);
});


//custom stringify function because we have circular references within our JSON object
function customStringify(obj) {
  const visited = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        // Handle circular reference
        return "[Circular]";
      }
      visited.add(value);
    }
    return value;
  });
}


//===========================================================
const nodeCache = {};
function walkTree (node){
  console.log(node.parentNode.outerHTML);
  console.log('nodeParent of node is ', node.parentNode);
  const nodeKey = JSON.stringify(node.parentNode.outerHTML)
  const tree = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ALL,
    null,
    false
  );
  const arr = [];
  let componentComment;
  let found = false;
  console.log('node stringify is:',nodeKey);
  if(nodeCache[nodeKey]){
    console.log('from cache:', nodeCache[nodeKey])
    return
  }else{
    while (tree.nextNode()) {
      if (tree.currentNode === node) {
        found = true;
      }
      if (found && tree.currentNode.nodeType === 8) {
        componentComment = tree.currentNode;
        break;
      }
    }
    nodeCache[nodeKey] = componentComment.nodeValue.slice(1, -1)
    console.log('from tree walker:', nodeCache[nodeKey]);
  }
}
