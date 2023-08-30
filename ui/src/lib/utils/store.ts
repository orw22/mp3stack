import authToken from "../stores/authToken";
import blobUrls from "../stores/blobUrls";
import history from "../stores/history";
import queue from "../stores/queue";

export function resetStores() {
  authToken.set(undefined);
  queue.reset();
  history.reset();
  blobUrls.reset();
}
