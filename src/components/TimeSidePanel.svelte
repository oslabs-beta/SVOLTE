<script lang="ts">
  import { snapShotHistory } from "../store";
  import type { SnapShot } from "../types";
  import TimeSlice from "./TimeSlice.svelte";
  let snap:SnapShot

</script>

<div class="column">
  {#each $snapShotHistory as snap (snap._id)}
    <TimeSlice {...snap}/>
  {/each}
</div>

<style>
  .column {
    width: 10em;
  }

</style>