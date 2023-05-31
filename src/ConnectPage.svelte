<script>
  import { reload } from './store'
</script>

<div class="h-screen w-full center pb-96 bg-gradient-to-t from-gray-800 to-slate-800 ...">
  <img src="/images/connectpage.png" alt="svolte connect page"/>
  <p class="text-xl">To begin, click connect to refresh the page.</p>
  <button type="button" class="btn variant-filled sm" on:click={reload}>Connect</button>
</div>

<style>
  .center {
		text-align: center;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 100%;
	}
  img {
    max-width: 50%;
    width: 60%;
    height: auto;
  }
</style>