<script lang="ts">
  import { snapShotHistory } from "../store";
  import TimeSlice from "./TimeSlice.svelte";

</script>

<div class="column">
  <h1>{JSON.stringify($snapShotHistory.length)}</h1>
  {#each $snapShotHistory as snap (snap._id)}
    <TimeSlice {...snap}/>
  {/each}
</div>