<script lang="ts">
  import { selected } from '../store'

  let newArray
  $: {
    if ($selected) {
      newArray = []
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
    }
  }
</script>

<div class="h-full grow items-center justify-center flex">
  <h1>{JSON.stringify(newArray)}</h1>
</div>

<style>
</style>
