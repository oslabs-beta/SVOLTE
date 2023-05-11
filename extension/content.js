// const componentsObj = new Proxy(
//   {},
//   {
//     set: function (target, key, val) {
//       target[key] = val;

//     },
//   }
// );

window.document.addEventListener("SvelteRegisterComponent", (e) => {
  console.log(e.detail.component);
  console.log(e.detail.component.toString());
  const msg = e.detail.component.toString();
  window.postMessage({
    msg: msg,
    source: "content.js",
  });
});
