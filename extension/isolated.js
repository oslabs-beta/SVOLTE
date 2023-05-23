//ISOLATED WORLD

window.addEventListener("message", (msg) => {
  if (
    typeof msg !== "object" ||
    msg === null ||
    msg.data?.source !== "content.js"
  ) {
    return;
  } else {
    chrome.runtime.sendMessage(msg.data, (res) => {
      return
    });
  }
});
