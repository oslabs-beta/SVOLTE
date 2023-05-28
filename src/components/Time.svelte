<script lang="ts">
  import TimeSidePanel from './TimeSidePanel.svelte'
  import TimeMainView from './TimeMainView.svelte'
</script>

<div class="flex h-full w-full">
  <TimeSidePanel />
  <TimeMainView />
</div>

<style>
  div {
    display: flex;
  }
</style>
