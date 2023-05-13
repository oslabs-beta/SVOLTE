window.document.addEventListener("SvelteRegisterComponent", (e) => {
  const msg = customStringify(e.detail.component);
  window.postMessage({
    msg: msg,
    source: "content.js",
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
