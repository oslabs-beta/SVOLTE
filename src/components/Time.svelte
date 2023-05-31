<script lang="ts">
  import TimeSidePanel from './TimeSidePanel.svelte';
  import TimeMainView from './TimeMainView.svelte';
</script>

<div class="flex max-h-full w-full">
  <TimeSidePanel />
  <TimeMainView />
</div>

<style>
  div {
    max-height: calc(100vh - 145px);
    height: calc(100vh - 145px);
  }
</style>
