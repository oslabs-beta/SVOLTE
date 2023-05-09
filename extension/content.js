let code = `
  window.document.addEventListener('SvelteRegisterComponent', (e) => {
    console.log(e.detail);
  })
`
let test = `
  window.document.addEventListener('click', (e) => {
    console.log('click ', e.target);
  })
`

document.documentElement.setAttribute('onreset', code);
document.documentElement.dispatchEvent(new CustomEvent('reset'));