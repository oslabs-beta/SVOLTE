<script lang="ts">
  import Counter from './components/Counter.svelte'
  import Header from './components/Header.svelte'
  import Body from './components/Body.svelte'
  let url = window.location.pathname;
  const setUrl = () =>{
    url = window.location.pathname;
  }
</script>

<main>
  <Header setUrl={setUrl}/>
  <div class="card">
    <Counter />
  </div>
  <Body url={url}/>
</main>

<style>
</style>
