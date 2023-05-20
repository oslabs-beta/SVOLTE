import { c as create_ssr_component, v as validate_component } from "../../chunks/index2.js";
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<header><nav><ul><li><a href="/tree">Tree</a></li>
      <li><a href="/time">Time-Travel</a></li></ul></nav></header>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="app">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

  <main>${slots.default ? slots.default({}) : ``}</main></div>`;
});
export {
  Layout as default
};
