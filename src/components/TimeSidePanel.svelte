<script lang="ts">
  import { snapShotHistory, selected } from '../store';
  import type { SnapShot } from '../types';
  import { ListBox } from '@skeletonlabs/skeleton';
  import TimeSlice from './TimeSlice.svelte';

  let singleValue: number;
  $: {
    if ($selected) {
      singleValue = $selected._id;
    }
  }
  let snap: SnapShot;
  function setSelected(id: number): void {
    selected.set($snapShotHistory[id]);
  }
</script>

<div class="flex-col overflow-y-auto pl-4">
  <ListBox>
    {#each $snapShotHistory as snap (snap._id)}
      <TimeSlice {singleValue} {setSelected} {...snap} />
    {/each}
  </ListBox>
</div>

<style>
</style>
