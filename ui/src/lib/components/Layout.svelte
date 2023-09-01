<!--
  @component
  Layout
  
  - Defines main layout div and CSS
  - When mounted (new page mounted), If no auth token present, resets stores and navigates back to login page
  - Used on all routes that require user to be logged in

-->

<script lang="ts">
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import authToken from "../stores/authToken";
  import { resetStores } from "../utils/store";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";

  const location = useLocation();

  // if no token, reset stores and redirect to login page
  onMount(() => {
    if (!$authToken) {
      resetStores();
      navigate("/login", { replace: true });
    }
  });

  $: onHomepage = $location.pathname === "/";
</script>

<div class="layout">
  {#if !onHomepage}
    <div class="layout-top">
      <IconButton onClick={() => navigate(-1)} blank>
        <Icon name="arrowLeft" size={36} />
      </IconButton>
    </div>
  {/if}
  <slot />
</div>

<style>
  .layout {
    width: min(1280px, 80vw);
  }

  .layout-top {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
</style>
