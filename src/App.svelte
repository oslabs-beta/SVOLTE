<script lang="ts">
  import CompTree from './components/CompTree.svelte'
  import Time from './components/Time.svelte'
  import Counter from './components/Counter.svelte'
  import Header from './components/Header.svelte'
  import Body from './components/Body.svelte'
  import { pathStore } from './store'
//use the store subscription prefix '$' in order to access the value from a store element
//this must be done any time you have a reference to the store


  // sveltekit routing
  // let url = window.location.pathname;
  // const setUrl = () =>{
  //   url = window.location.pathname;
  // }

  // let path = 'tree';
  // const setPath = () => {
  //   if (path === 'tree') path = 'time';
  //   else path = 'tree';
  // }
//   function setPath() {
//     if ($atTree){
//         console.log('procced')
//         atTree.update(string => false);
//     }
//     else{
//         atTree.set(true);
//     };
// }
</script>

<main>
  <!-- <Header setUrl={setUrl}/> -->
  <div class="card">
    <!-- <Counter /> -->
  </div>
  <!-- <Body url={url}/> -->
  <button on:click={$pathStore.setPath}>switch view</button>
  {#if $pathStore.path === 'tree'}
    <h1> Component Tree </h1>
    <CompTree />
    {:else if $pathStore.path === 'time'}
    <h1> States </h1>
  {/if}
</main>

<style>
  /* main {
    background-color: gray;
  } */
</style>
