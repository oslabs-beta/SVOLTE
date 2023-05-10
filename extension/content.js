let code = `
  window.document.addEventListener('SvelteRegisterComponent', (e) => {
    console.log(e.detail);
  })`
  

  chrome.runtime.sendMessage({payload: 'Hello' },(res)=>{
    console.log(res);
  });
// chrome.devtools.inspectedWindow.eval('console.log("yoo!")')
document.documentElement.setAttribute('onreset', code);
document.documentElement.dispatchEvent(new CustomEvent('reset')); 