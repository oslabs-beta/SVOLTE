<script lang="ts">
  import Counter from './components/Counter.svelte'
  import Header from './components/Header.svelte'
  import Body from './components/Body.svelte'
  import { path, setPath } from './stores.js'

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

</script>

<main>
  <!-- <Header setUrl={setUrl}/> -->
  <div class="card">
    <Counter />
  </div>
  <!-- <Body url={url}/> -->
  <button on:click={setPath}>switch view</button>
  {#if path === 'tree'}
    <h1> currently at tree </h1>
    {:else if path === 'time'}
    <h1> currently at time travel</h1>
  {/if}
</main>

<style>
</style>
