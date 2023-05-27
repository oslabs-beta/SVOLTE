<script lang="ts">
  import { selected } from "../store";
  export let diff;
  export let tagName;
  export let detail;
  export let _id;
  export let setSelected;
  
</script>
<div on:click={()=>setSelected(_id)} aria-current={!$selected ? false : $selected._id === _id}>
  <h1>{tagName}</h1>
  {#each diff as change (change.id)}
    <h2>Key is {detail.ctx[change.path[0]].key}</h2>
    <h3>{change.value1} changed to {change.value2} </h3>
  {/each}
</div>

<style>
  div:hover{
    cursor: pointer;
  }
  div[aria-current='true'] {
		box-shadow: inset 3px 3px 4px rgba(0,0,0,0.2);
	}
</style>