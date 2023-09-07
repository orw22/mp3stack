import { API_URL } from "./lib/constants";
import authToken from "./lib/stores/authToken";
import toasts from "./toasts";

// event source (SSE)
let es: EventSource | null = null;

function onError(error: Event) {
  toasts.error("SSE Error");
  console.error(error);
}

export const esUnsubscribeFromAuthToken = authToken.subscribe((token) => {
  if (token) {
    es = new EventSource(`${API_URL}/sse`, {
      withCredentials: true,
    });

    es.onerror = onError;
  } else if (es) es.close(); // if no token, close connection
});

export default es;
