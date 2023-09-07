import { AUTH_COOKIE_KEY } from "../constants";
import authToken from "../stores/authToken";
import blobUrls from "../stores/blobUrls";
import history from "../stores/history";
import queue from "../stores/queue";

/**
 * Resets all stores to their initial values (used when user is logging out)
 * @function
 */
export function resetStores() {
  document.cookie = `${AUTH_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  authToken.set(undefined);
  queue.reset();
  history.reset();
  blobUrls.reset();
}
