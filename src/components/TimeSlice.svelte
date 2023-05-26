<script lang="ts">
  import type {SnapShot} from '../types'
  export let snap:SnapShot;

  

  
</script>
<div>
  <h1>{snap.tagName}</h1>
  {#each snap.diff as diff (diff.id)}
    <h1>Key is {snap.detail.ctx[Number(diff.path[0])].key}</h1>
    <h2>{diff.value1} changed to {diff.value2} </h2>
  {/each}
</div>