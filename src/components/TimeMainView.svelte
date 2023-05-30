<script lang="ts">
  import { loop_guard } from 'svelte/internal';
  import { selected } from '../store'

  let newArray = [];
  $: {
    if ($selected) {
      newArray = [];
      const originalArray = $selected.detail.ctx
      // Recursive function to check if an object or its nested properties have _isFunction
      function hasFunction(obj) {
        if (typeof obj !== 'object' || obj === null) {
          return false
        }

        if (obj.__isFunction) {
          return true
        }

        for (const key in obj) {
          if (hasFunction(obj[key])) {
            return true
          }
        }

        return false
      }

      // Iterate over the original array
      for (const obj of originalArray) {
        if (hasFunction(obj.value)) {
          // Ignore the object if it or its nested properties have _isFunction
          continue
        }

        // Add the object to the new array
        newArray.push(obj)
        newArray = newArray
      }

      console.log('newArray is ', newArray);
      // const flattened_info = {};
      // for (const obj of newArray) {
      //   flattened_info[obj.key] = obj.value;
      // }
      // console.log('flattened_info is ', flattened_info);
    }
  }
</script>

<div class="h-full grow items-center content-center flex-col flex">
  {#if newArray.length}
    {#each newArray as pair}
      <div>{pair.key}: {pair.value}</div>
    {/each}
  {/if}
</div>

<style>
</style>
