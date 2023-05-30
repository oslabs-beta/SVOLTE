<script lang="ts">
  import { selected, process_ctx } from '../store'

  let state = []
  $: {
    if ($selected) {
      state = process_ctx($selected.detail.ctx)
    }
  }
</script>

<div class="h-full grow items-center content-center flex-col flex">
  {#if state.length}
    {#each state as pair}
      <div>{pair.key}: {pair.value}</div>
    {/each}
  {/if}
</div>

<style>
</style>
