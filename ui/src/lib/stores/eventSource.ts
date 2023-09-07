import { writable } from "svelte/store";
import { API_URL } from "../constants";
import authToken from "./authToken";

function createEventSourceStore() {
  const { subscribe, set, update } = writable<EventSource | null>(null);

  return {
    subscribe,
    set,
    initialise: () =>
      set(
        new EventSource(`${API_URL}/sse`, {
          withCredentials: true,
        })
      ),
    setOnError: (callback: (event: Event) => void) =>
      update((v) => {
        if (v) {
          v.onerror = callback;
        }
        return v;
      }),
    addEventListener: (
      eventName: string,
      callback: (event: MessageEvent) => void
    ) =>
      update((v) => {
        v?.addEventListener(eventName, callback);
        return v;
      }),
    removeEventListener: (
      eventName: string,
      callback: (event: MessageEvent) => void
    ) =>
      update((v) => {
        v?.removeEventListener(eventName, callback);
        return v;
      }),
    close: () =>
      update((v) => {
        v?.close();
        v = null;
        return v;
      }),
  };
}

const eventSource = createEventSourceStore();
export default eventSource;

export const esUnsubscribeFromAuthToken = authToken.subscribe((token) => {
  if (!token) {
    eventSource.close();
  } // if no token, close connection and set es to null
});
