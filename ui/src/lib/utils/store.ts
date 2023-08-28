import blobUrls from "../stores/blobUrls";
import history from "../stores/history";
import queue from "../stores/queue";
import token from "../stores/token";

export function resetStores() {
  token.set(undefined);
  queue.reset();
  history.reset();
  blobUrls.reset();
}
