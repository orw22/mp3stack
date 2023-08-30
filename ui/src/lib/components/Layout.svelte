<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import authToken from "../stores/authToken";
  import { resetStores } from "../utils/store";

  // if no token, reset stores and redirect to login page
  onMount(() => {
    if (!$authToken) {
      resetStores();
      navigate("/login", { replace: true });
    }
  });
</script>

<div class="layout">
  <slot />
</div>

<style>
  .layout {
    width: min(1280px, 80vw);
  }
</style>
