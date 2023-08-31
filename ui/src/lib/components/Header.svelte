<!--
  @component
  Header
  
  - Contains links to home page and log in/log out functionality

  Props: 
    - {boolean} loggedIn
-->

<script lang="ts">
  import { link } from "svelte-routing";
  import { resetStores } from "../utils/store";

  export let loggedIn: boolean;
</script>

<header>
  <nav>
    <a href="/" use:link>mp3stack</a>
    {#if loggedIn}
      <a href="/login" on:click={() => resetStores()} use:link>Log out</a>
    {:else}
      <a href="/login" use:link>Log in</a>
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

  a {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--color-white);
    text-decoration: none;
  }
  a:hover {
    color: var(--color-white);
  }
</style>
