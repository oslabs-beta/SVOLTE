<script lang="ts">
  import { ListBoxItem } from '@skeletonlabs/skeleton'
  import { jump } from "../store";
  export let diff
  export let tagName
  export let detail
  export let _id
  export let setSelected
  export let singleValue
</script>

<ListBoxItem
  
  on:click={() => {
    setSelected(_id);
    jump(_id)}}
  bind:group={singleValue}
  name="medium"
  value={_id}
  class="bg-white/5"
>
  {tagName}
  {#each diff as change (change.id)}
    <p>
      {detail.ctx[change.path[0]].key}
      {change.value1} => {change.value2}
    </p>
  {/each}
</ListBoxItem>

