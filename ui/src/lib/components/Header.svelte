<!--
  @component
  Header
  
  - Contains links to home page and log in/log out functionality

  Props: 
    - {boolean} loggedIn
-->

<script lang="ts">
  import { Link } from "svelte-navigator";
  import { resetStores } from "../utils/store";

  export let loggedIn: boolean;
</script>

<header>
  <nav>
    <Link to="/">mp3stack</Link>
    {#if loggedIn}
      <Link to="/login" on:click={() => resetStores()}>Log out</Link>
    {:else}
      <Link to="/login">Log in</Link>
    {/if}
  </nav>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100vw;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background-color: var(--color-primary);
    height: 5em;
    left: 0;
    top: 0;
    z-index: 10;
  }

  nav {
    display: flex;
    justify-content: space-between;
    width: 80vw;
    padding: 0 2em;
  }

  :global(header nav a) {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--color-white);
    text-decoration: none;
  }
  :global(header nav a:hover) {
    color: var(--color-white);
  }
</style>
