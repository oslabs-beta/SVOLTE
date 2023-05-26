<script lang="ts">
    import { get } from "svelte/store";
  import { snapShotHistory } from "../store";
  import TimeSlice from "./TimeSlice.svelte";

  // let snapArr;

  // snapShotHistory.subscribe(snap => {
  //   snapArr = snap;
  // });
</script>

<div class="column">
  {#each $snapShotHistory as snap (snap.id)}
    <TimeSlice {snap}/>
  {/each}
</div>