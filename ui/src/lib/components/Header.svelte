<!--
  @component
  Header
  
  - Contains links to home page and log in/log out functionality

  Props: 
    - {boolean} loggedIn
-->

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
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100vw;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background-color: #f9f9f9;
    height: 5em;
    left: 0;
    top: 0;
    z-index: 10;
  }

  .header nav {
    display: flex;
    justify-content: space-between;
    width: 80vw;
    padding: 0 2em;
  }
</style>
