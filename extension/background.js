chrome.runtime.onInstalled.addListener(()=>{
  console.log('hello');
})

chrome.runtime.onMessage.addListener((req,sender,res)=>{
  console.log(req,sender,res)

})