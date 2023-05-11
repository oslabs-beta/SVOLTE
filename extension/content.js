chrome.runtime.connect('kddekcfhbcgaobhfpgfidbjgdjkaobkn');

let counter = 0;
const id = chrome.runtime.id; 
console.log('chrome.runtime is ', chrome.runtime);

console.log('id is ', id);


// kddekcfhbcgaobhfpgfidbjgdjkaobkn

const componentsObj = new Proxy({}, {
  set : function (target, key, val) {
    target[key] = val;
    console.log(componentsObj);
    chrome.runtime.sendMessage('kddekcfhbcgaobhfpgfidbjgdjkaobkn',{ message : 'proxy obj is being changed' });
  }
})

window.document.addEventListener('SvelteRegisterComponent', (e) => {
  chrome.runtime.sendMessage('kddekcfhbcgaobhfpgfidbjgdjkaobkn',{ message : 'sending from event listener' });
  componentsObj[counter] = e.detail;
  counter++
});

// caught TypeError: Error in invocation of runtime.sendMessage(optional string extensionId, any message, optional object options, optional function callback): chrome.runtime.sendMessage() called from a webpage must specify an Extension ID (string) for its first argument.
 

// chrome.runtime.sendMessage({greeting: "HELLO"}, function(response) {
//   console.log(response.farewell);
// });
