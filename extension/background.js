//SERVICE WORKER

let ext;
let tabid;
let key;

chrome.runtime.onMessage.addListener((message, sender, res) => {
  connections[key].postMessage(message);
  res('success');
});

const connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  const extensionListener = function (message, sender, sendResponse) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.type === 'INIT') {
      console.log('message type INIT received in background.js');
      port.postMessage({
        source: 'background.js',
        type: 'postMessage - INIT',
      });
      key = message.tabId;
      connections[key] = port;
      tabid = message.tabId;
      ext = sender.id;
      return;
    }
    if (message.type === 'INJECT') {
      console.log('message type INJECT received in background.js');
      port.postMessage({
        source: 'background.js',
        type: 'postMessage - INJECT',
        message: message,
      });
      return;
    }
    // other message handling
    if (message.type === 'RELOAD') {
      console.log('RELOADING webpage');
      chrome.tabs.reload(message.tabId, { bypassCache: true });
    }
    return;
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
