<script lang="ts">
  export let diff;
  export let tagName;
  export let detail;
  
</script>
<div>
  <h1>{tagName}</h1>
  {#each diff as change (change.id)}
    <h2>Key is {detail.ctx[change.path[0]].key}</h2>
    <h3>{change.value1} changed to {change.value2} </h3>
  {/each}
</div>

<style>

</style>