<script lang="ts">
  import CompTree from './components/CompTree.svelte'
  import Time from './components/Time.svelte'
  import { TabGroup, Tab } from '@skeletonlabs/skeleton'
  import { AppShell, AppBar } from '@skeletonlabs/skeleton'
  //use the store subscription prefix '$' in order to access the value from a store element
  //this must be done any time you have a reference to the store

  // Your selected Skeleton theme:
  // import '@skeletonlabs/skeleton/themes/theme-skeleton.css'
  import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';

  // This contains the bulk of Skeletons required styles:
  // NOTE: this will be renamed skeleton.css in the v2.x release.
  import '@skeletonlabs/skeleton/styles/skeleton.css'

  // Finally, your application's global stylesheet (sometimes labeled 'app.css')
  import './app.postcss'

  let tabSet = 0
</script>

<AppShell class="h-full overflow-hidden">
  <svelte:fragment slot="pageHeader">
    <AppBar>
      <img src="/icons/svolte_logo_smaller.png" alt="svolte header"/>
    </AppBar>
  </svelte:fragment>

  <TabGroup class="h-full overflow-hidden">
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
</AppShell>

<style>
  /* main {
    background-color: gray;
  } */
  :global(html, body) {
    @apply h-screen overflow-hidden;
  }
</style>
