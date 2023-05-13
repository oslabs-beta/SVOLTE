<script lang="ts">
  export let setUrl;
</script>

<header>
  <nav>
    <ul>
      <li><a href='/time' on:click={setUrl}>Time</a></li>
      <li><a href='/tree' on:click={setUrl}>Tree</a></li>
    </ul>
  </nav>
</header>