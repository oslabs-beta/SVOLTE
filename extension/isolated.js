//ISOLATED WORLD

window.addEventListener('message', (msg) => {
  if (
    typeof msg !== "object" ||
    msg === null ||
    msg.data?.source !== "content.js"
  ) {
    return;
  } else {
    console.log('entering isolated addEventListener for message');
    chrome.runtime.sendMessage(msg.data, (res) => {
      return
    });
  }
});

window.addEventListener('unload', () => chrome.runtime.sendMessage({ type: 'clear' }));

chrome.runtime.onMessage.addListener()