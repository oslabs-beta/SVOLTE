//MAIN WORLD
const arr = [];
const compObj = {};
const mutationObservers = {};
console.log(document);
console.log(window);
window.document.addEventListener("SvelteRegisterComponent", (e) => {
  // const compName = e.detail.tagName;
  const detail = e.detail;
  const component = e.detail.component;
  const state = e.detail.component.$capture_state();
  // const node = document.getElementsByClassName(compName.toLowerCase());
  // arr.push(component);
  console.log("detail from content.js is ", detail);
  console.log("component from content.js is ", component);
  console.log("state from content.js is ", state);
  // console.log("node is:", node);

  // if (node.length) {
  //   const observer = new MutationObserver((mutation) => {
  //     console.log(mutation);
  //   });
  //   mutationObservers[compName] = observer;
  //   observer.observe(node[0], {
  //     attributes: true,
  //     childList: true,
  //     subtree: true,
  //   });
  // }
  // compObj[compName] = e.detail.component;
  // window.postMessage({
  //   msg: msg,
  //   source: "content.js",
  // });
});
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutation) => {
    console.log(mutation);
  });
  const node = document.body;
  console.log("document is:", node);
  observer.observe(node, {
    attributes: true,
    childList: true,
    subtree: true,
  });
});

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
