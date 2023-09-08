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
  import toasts from "../../toasts";
  import authToken from "../stores/authToken";
  import eventSource from "../stores/eventSource";
  import { resetStores } from "../utils/store";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";

  const location = useLocation();

  onMount(() => {
    if (!$authToken) {
      // if no token, reset stores and go to login page
      resetStores();
      navigate("/login", { replace: true });
    } else if (!$eventSource) {
      // if token present and eventSource not initialised
      eventSource.initialise();
      eventSource.setOnError(() => {
        toasts.error("SSE connection error");
      });
    }
  });

  $: onHomepage = $location.pathname === "/";
  $: onProfile = $location.pathname === "/profile";
</script>

<div class="layout">
  <div
    class="layout-top"
    style="justify-content: {onHomepage ? 'flex-end' : 'space-between'}"
  >
    {#if !onHomepage}
      <IconButton onClick={() => navigate(-1)} blank>
        <Icon name="arrowLeft" size={36} />
      </IconButton>
    {/if}
    <div class="layout-top-right">
      <IconButton onClick={() => navigate("/search")} blank>
        <Icon name="search" size={32} />
      </IconButton>
      {#if !onProfile}
        <IconButton onClick={() => navigate("/profile")} blank>
          <Icon name="user" size={36} />
        </IconButton>
      {/if}
    </div>
  </div>
  <slot />
</div>

<style>
  .layout {
    width: min(1280px, 80vw);
  }

  .layout-top {
    display: flex;
    width: 100%;
  }

  .layout-top-right {
    display: inherit;
    flex-direction: row;
  }
</style>
