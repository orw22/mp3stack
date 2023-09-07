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
  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
  authToken.set(undefined);
  queue.reset();
  history.reset();
  blobUrls.reset();
}
