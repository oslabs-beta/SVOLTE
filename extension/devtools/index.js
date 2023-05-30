/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

chrome.devtools.panels.create('SVOLTE', null, './devtools/panel/panel.html', (panel) =>{
    panel.onShown.addListener(()=> {
      chrome.devtools.inspectedWindow.reload();
    })

  });


