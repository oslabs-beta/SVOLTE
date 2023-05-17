//SERVICE WORKER

console.log(chrome.runtime.id);
let ext;
let tabid;

chrome.runtime.onMessage.addListener((message, sender, res) => {
  console.log(
    sender.tab
      ? "from a content script: " + sender.tab.url
      : "from the extension"
  );
  console.log(connections);
  
  res({ crikey: "m8" });
});

const connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  console.log("On connect add listener");
  const extensionListener = function (message, sender, sendResponse) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.name == "init") {
      console.log("something came from main.ts", message);
      port.postMessage({ dingo: "ate my baby" });
      connections[message.tabId] = port;
      tabid = message.tabId;
      ext = sender.id;
      return;
    }
    // other message handling
  };
  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);
  // handle disconnect
  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener);
    for (const tab in connections) {
      if (connections[tab] == port) {
        delete connections[tab];
        break;
      }
    }
  });
});
