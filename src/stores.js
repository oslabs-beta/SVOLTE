import { writable } from "svelte/store";

export const path = writable('tree');
export function setPath() {
    if (path === 'tree'){
        path.update(string => 'time');
    }
    else{
        path.update(string => 'tree');
    };
}
// initialize states
// export const __ = writable();

// listen for inc messages from background.js, update state