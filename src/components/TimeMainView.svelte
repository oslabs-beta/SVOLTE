<script lang="ts">
  import { selected, process_ctx } from '../store'

  let state = []
  $: {
    if ($selected) {
      state = process_ctx($selected.detail.ctx)
    }
  }
</script>

{#if state.length}
  <div class="h-full grow flex flex-col">
    {#each state as pair}
      <div class="w-fit text-left self-center">
        {pair.key}: {#if !Array.isArray(pair.value) && typeof pair.value === 'object'}
          <span>
            {`{`}
            {#each Object.keys(pair.value) as key}
              <div class="w-fit text-left">
                {key}:{JSON.stringify(pair.value[key])},
              </div>
            {/each}
            {`}`}
          </span>
        {:else}
          {JSON.stringify(pair.value)}
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
</style>
