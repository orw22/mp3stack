import { API_URL } from "./lib/constants";
import authToken from "./lib/stores/authToken";
import toasts from "./toasts";

// event source for server-sent events
let es: EventSource;

function onPlaylistUpdate(event: MessageEvent) {
  console.log(JSON.parse(event.data));
}

function onUserUpdate(event: MessageEvent) {
  console.log(JSON.parse(event.data));
}

function onError(error: Event) {
  toasts.error("SSE Error");
  console.error(error);
}

export const esUnsubscribeFromAuthToken = authToken.subscribe((token) => {
  if (token) {
    es = new EventSource(`${API_URL}/sse`, {
      withCredentials: true,
    });

    es.addEventListener("playlistUpdate", onPlaylistUpdate);
    es.addEventListener("userUpdate", onUserUpdate);
    es.onerror = onError;
  } else if (es) es.close();
});
