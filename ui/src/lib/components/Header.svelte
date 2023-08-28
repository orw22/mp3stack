<script lang="ts">
  import { Link } from "svelte-routing";
  import { resetStores } from "../utils/store";

  export let loggedIn: boolean;
</script>

<header class="header">
  <nav>
    <Link to="/">mp3stack</Link>
    {#if loggedIn}
      <Link to="/login" on:click={resetStores}>Log out</Link>
    {:else}
      <Link to="/login">Log in</Link>
    {/if}
  </nav>
</header>

<style>
  .header {
    position: fixed;
    width: 100%;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background-color: #f9f9f9;
    padding: 1.5em 0;
    left: 0;
    top: 0;
  }

  .header nav {
    display: flex;
    justify-content: space-between;
    padding: 0 4em;
  }
</style>
