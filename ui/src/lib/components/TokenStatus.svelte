<script lang="ts">
  import { navigate } from "svelte-routing";
  import blobUrls from "../stores/blobUrls";
  import history from "../stores/history";
  import queue from "../stores/queue";
  import token from "../stores/token";

  $: if (!$token) {
    console.warn("Not logged in. Redirecting to /login");
    queue.reset();
    history.reset();
    blobUrls.reset();
    navigate("/login", { replace: true });
  }
</script>

<slot />
