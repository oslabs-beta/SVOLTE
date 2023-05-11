console.log(chrome.runtime.id);
// chrome.runtime.onInstalled.addListener(()=>{
//   console.log('hello');
// })

chrome.runtime.onMessage.addListener((message,sender,res)=>{
  console.log(sender.tab ?
      "from a content script: " + sender.tab.url :
      "from the extension");
  console.log(message, sender);
  res({farewell:'bye - from background'});
})

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//       "from a content script: " + sender.tab.url :
//       "from the extension");
//     if (request.greeting === "HELLO") sendResponse({ farewell: "GOODBYE" });
//   }
// );