<script>
  import { reload } from './store'

</script>

<div>
  <h1>Welcome to Svolte!</h1>
  <p>To begin, click connect to refresh the page.</p>
  <button on:click={reload}>CONNECT</button>
</div>