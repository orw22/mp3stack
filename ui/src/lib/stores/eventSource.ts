import { writable } from "svelte/store";
import { API_URL } from "../constants";
import authToken from "./authToken";

/**
 * Creates a writable store for managing an EventSource instance
 *
 * @returns {{
 *   subscribe: Function,
 *   set: Function,
 *   initialise: Function,
 *   setOnError: Function,
 *   addEventListener: Function,
 *   removeEventListener: Function,
 *   close: Function
 * }}
 */
function createEventSourceStore() {
  const { subscribe, set, update } = writable<EventSource | null>(null);

  return {
    /**
     * Subscribe to changes in the EventSource instance.
     * @function
     */
    subscribe,
    /**
     * Set the EventSource instance to a new value.
     * @param {EventSource | null} value
     */
    set,
    /**
     * Initialize the EventSource
     */
    initialise: () =>
      set(
        new EventSource(`${API_URL}/sse`, {
          withCredentials: true,
        })
      ),
    /**
     * Set onerror callback function.
     * @param callback - The error callback function
     */
    setOnError: (callback: (event: Event) => void) =>
      update((v) => {
        if (v) {
          v.onerror = callback;
        }
        return v;
      }),
    /**
     * Add an event listener to the EventSource.
     * @param eventName - The name of the event to listen for
     * @param callback - The event callback function
     */
    addEventListener: (
      eventName: string,
      callback: (event: MessageEvent) => void
    ) =>
      update((v) => {
        v?.addEventListener(eventName, callback);
        return v;
      }),
    /**
     * Remove an event listener from the EventSource.
     * @param eventName - The name of the event to remove the listener from.
     * @param callback - The event callback function to remove.
     */
    removeEventListener: (
      eventName: string,
      callback: (event: MessageEvent) => void
    ) =>
      update((v) => {
        v?.removeEventListener(eventName, callback);
        return v;
      }),
    /**
     * Close the EventSource connection and set it to null.
     */
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
