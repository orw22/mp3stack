import { writable } from "svelte/store";
import type { TrackWithUrl } from "../types";

function createHistory() {
  const { subscribe, set, update } = writable<TrackWithUrl[]>([]);

  return {
    subscribe,
    /**
     * Pushes a track to history.
     * @param {TrackWithUrl} track - The track to be added.
     * @function
     */
    push: (track: TrackWithUrl) =>
      update((v) => {
        v.push(track);
        return v;
      }),
    /**
     * Removes the last track from history.
     * @function
     */
    pop: () =>
      update((v) => {
        v.pop();
        return v;
      }),
    /**
     * Reset history
     * @function
     */
    reset: () => set([]),
  };
}

/**
 * History store
 * Holds array of previousy played tracks
 * LIFO
 * @name history
 * @type {Writable<TrackWithUrl[]>}
 */
const history = createHistory();

export default history;
