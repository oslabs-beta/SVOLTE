<script lang="ts">
  import CompTree from './components/CompTree.svelte'
  import Time from './components/Time.svelte'
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';
  import { pathStore } from './store.js'
//use the store subscription prefix '$' in order to access the value from a store element
//this must be done any time you have a reference to the store


// Your selected Skeleton theme:
import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

// This contains the bulk of Skeletons required styles:
// NOTE: this will be renamed skeleton.css in the v2.x release.
import '@skeletonlabs/skeleton/styles/skeleton.css';

// Finally, your application's global stylesheet (sometimes labeled 'app.css')
import './app.postcss';


let tabSet = 0;

</script>

<main>
 <h1>SVOLTE</h1>
  <!-- <button on:click={$pathStore.setPath}>switch view</button>
  {#if $pathStore.path === 'tree'}
    <h1> Component Tree </h1>
    <CompTree />
    {:else if $pathStore.path === 'time'}
    <h1> States </h1>
  {/if} -->


<TabGroup>
	<Tab bind:group={tabSet} name="tab1" value={0}>Component Tree</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>Time Travel</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
      <CompTree />
		{:else if tabSet === 1}
			<Time />
		{/if}
	</svelte:fragment>
</TabGroup>
			
  
</main>

<style>
  /* main {
    background-color: gray;
  } */
</style>
