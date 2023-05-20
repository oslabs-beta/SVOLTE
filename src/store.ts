import { writable } from "svelte/store";


// initialize states

// switch between tree and time travel panels
export const pathStore = writable({
  path: 'tree', 
  setPath: () => {
    pathStore.update((state) => {
      if (state.path === 'tree') {
        console.log('proceed');
        return { ...state, path: 'time' };
      } else {
        return { ...state, path: 'tree' };
      }
    });
   }
  });

export const treeData = writable({});
//we want to dynamically add to treeData


// listen for inc messages from background.js, update state