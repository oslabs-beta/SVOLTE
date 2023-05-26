<script lang="ts">
  export let diff;
  export let tagName;
  export let detail;
  
</script>
<div>
  <h1>{tagName}</h1>
  {#each diff as change (change.id)}
    <h1>Key is {detail.ctx[Number(change.path[0])].key}</h1>
    <h2>{change.value1} changed to {change.value2} </h2>
  {/each}
</div>
