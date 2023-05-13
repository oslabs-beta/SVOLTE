<script lang="ts">
  export let url;

  console.log(url);

</script>


<section>
  <h1> currently at tree </h1>
  {#if url === 'tree'}
    <h1> currently at tree </h1>
    {:else if url === 'time'}
    <h1> currently at time travel</h1>
  {/if}
</section>

