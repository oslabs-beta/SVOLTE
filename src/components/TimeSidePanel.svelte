<script lang="ts">
  import { snapShotHistory } from "../store";
  import TimeSlice from "./TimeSlice.svelte";

  let snapArr
  snapShotHistory.subscribe(value => {
		snapArr = value;
	});
</script>

<div class="column">
  {#each snapArr as snap (snap.id)}
    <TimeSlice {snap}/>
  {/each}
</div>