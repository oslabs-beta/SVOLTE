<script lang="ts">
  import { jump } from "../store";
  // export let diff;
  // export let tagName;
  // export let detail;
  // export let _id;
  export let snap;
</script>

<div>
  <h1>{snap.tagName}</h1>
  {#each snap.diff as change (change.id)}
    <h1>Key is {snap.detail.ctx[Number(change.path[0])].key}</h1>
    <h2>{change.value1} changed to {change.value2} </h2>
    <button on:click={() => jump(snap._id)}>Jump</button>
  {/each}
</div>