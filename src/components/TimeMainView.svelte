<script lang="ts">
import { selected } from "../store";

const arr = [];

if($selected){
  for(const obj of $selected.detail.ctx){
    if(typeof obj.value !== "function"){
      if(typeof obj.value === "object"){
        const newObj = {}
        for (const key in obj.value){
          if(!obj.value[key]._isFunction){
            newObj[key] 
          }
        }
      }
      arr.push(obj);
    }
  }

}

</script>


<div>
  <h1>{JSON.stringify(arr)}</h1>
</div>


<style>
  div{
    flex-grow: 1;
    background-color: blue;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>