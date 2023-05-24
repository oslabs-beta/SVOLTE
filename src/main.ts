import "./app.postcss";
import App from "./App.svelte";
import { writable, get } from "svelte/store";

const targetNode = writable({});

const app = new App({
  target: document.getElementById("app"),
});

const backgroundPageConnection = chrome.runtime.connect();

// report back with tabId to identify devtools location in chrome
backgroundPageConnection.postMessage({
  name: "INIT",
  tabId: chrome.devtools.inspectedWindow.tabId,
});

// background.js -> here

backgroundPageConnection.onMessage.addListener((message: Object) => {
  if (message.type === "addNode") {
    console.log("message received: ", message);
  }
});

export default app;
