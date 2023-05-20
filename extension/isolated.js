//ISOLATED WORLD

window.addEventListener("message", (msg) => {
  if (
    typeof msg !== "object" ||
    msg === null ||
    msg.data?.source !== "content.js"
  ) {
    return;
  } else {
    console.log("Source: isolated.js - message received: ", msg.data);
    chrome.runtime.sendMessage(msg.data, (res) => {
      console.log(res);
    });
  }
});
