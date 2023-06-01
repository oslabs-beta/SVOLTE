<script lang="ts">
  import { ListBoxItem, SlideToggle } from '@skeletonlabs/skeleton';
  import { jump, skipArr, currentSnapShot } from '../store';
  export let diff, tagName, detail, _id;
  export let setSelected;
  export let singleValue;
  let value: boolean = false;
  $: {
    if (value) {
      skipArr.update((prev) => [...prev, _id]);
    } else {
      skipArr.update((prev) => prev.filter((id) => id !== _id));
    }
  }
</script>

<ListBoxItem
  on:click={() => {
    setSelected(_id);
  }}
  bind:group={singleValue}
  name="medium"
  value={_id}
  class="group flex border-solid divide-white gap-1 bg-white/5 slice"
  aria-current={$currentSnapShot === _id}
>
  {tagName}
  {#each diff as change (change.id)}
    <p>
      {detail.ctx[change.path[0]].key}
      {change.value1} => {change.value2}
    </p>
  {/each}
  <span
    class="hidden-child invisible group-hover:visible flex items-center justify-center gap-1"
    ><button
      type="button"
      class="btn-sm variant-filled-primary"
      on:click={() => jump(_id)}>JUMP</button
    >
    <SlideToggle
      class="transition duration-0"
      name="slider-label"
      size="sm"
      bind:checked={value}>SKIP</SlideToggle
    >
  </span>
</ListBoxItem>

<style>
  .slice {
    border: 4px;
    border-color: aliceblue;
  }
</style>
