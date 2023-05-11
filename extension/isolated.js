window.addEventListener("message", (msg) => {
  if (
    typeof message !== "object" ||
    message === null ||
    message.data?.source !== "content.js"
  ) {
    return;
  } else {
    console.log("message came in:", msg.data);
    chrome.runtime.sendMessage(msg.data, (res) => {
      console.log(res);
    });
  }
});
