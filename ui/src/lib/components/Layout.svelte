<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import token from "../stores/token";
  import { resetStores } from "../utils/store";

  // if no token, reset stores and redirect to login page
  onMount(() => {
    if (!$token) {
      resetStores();
      navigate("/login", { replace: true });
    }
  });
</script>

<slot />
