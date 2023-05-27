<script lang="ts">
  import { snapShotHistory, selected } from "../store";
  import type { SnapShot } from "../types";
  import TimeSlice from "./TimeSlice.svelte";
  let snap:SnapShot
  function setSelected (id:number):void {
    selected.set($snapShotHistory[id]);
  }

</script>

<div class="column">
  {#each $snapShotHistory as snap (snap._id)}
    <TimeSlice {setSelected} {...snap}/>
  {/each}
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
    width: 10em;
    gap: 1em;
  }

</style>