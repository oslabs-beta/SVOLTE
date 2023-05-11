console.log(chrome.runtime.id);
// chrome.runtime.onInstalled.addListener(()=>{
//   console.log('hello');
// })

chrome.runtime.onMessage.addListener((message, sender, res) => {
  console.log(
    sender.tab
      ? "from a content script: " + sender.tab.url
      : "from the extension"
  );
  res({ crikey: "m8" });
});

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//       "from a content script: " + sender.tab.url :
//       "from the extension");
//     if (request.greeting === "HELLO") sendResponse({ farewell: "GOODBYE" });
//   }
// );

// chrome.runtime.onConnect.addListener(function (port) {
//   console.log("On connect add listener");
//   const extensionListener = function (message, sender, sendResponse) {
//     // The original connection event doesn't include the tab ID of the
//     // DevTools page, so we need to send it explicitly.
//     if (message.name == "init") {
//       connection = port;
//       return;
//     }
//     // other message handling
//   };
//   // Listen to messages sent from the DevTools page
//   port.onMessage.addListener(extensionListener);
//   // handle disconnect
//   port.onDisconnect.addListener(function (port) {
//     port.onMessage.removeListener(extensionListener);
//     connection = null;
//   });
// });
