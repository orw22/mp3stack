<script context="module" lang="ts">
  import toasts from "../../toasts";
  import { API_URL } from "../constants";
  import authToken from "../stores/authToken";

  export let es: EventSource | null = null;

  export function initialiseEs() {
    es = new EventSource(`${API_URL}/sse`, {
      withCredentials: true,
    });
    es.onerror = () => {
      toasts.error("SSE connection error");
    };
  }

  export function closeEs() {
    es?.close();
    es = null;
  }

  export const esUnsubscribeFromAuthToken = authToken.subscribe((token) => {
    if (!token) {
      closeEs();
    }
  });
</script>
