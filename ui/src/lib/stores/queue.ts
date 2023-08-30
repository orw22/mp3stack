import { writable } from "svelte/store";
import type { TrackWithUrl } from "../types";
import history from "./history";

function createQueue() {
  const { subscribe, set, update } = writable<TrackWithUrl[]>([]);
  let historyValue: TrackWithUrl[];

  /**
   * Subscribes to changes in history and updates reference value
   */
  const unsubscribefromHistory = history.subscribe((value) => {
    historyValue = value;
  });

  let restartCallback: () => void = () => null;

  return {
    subscribe,
    /**
     * Play a track
     * Overwrites all items in the queue and resets history
     * If same as current track (v[0]), restart the track
     * @param {TrackWithUrl} track - The track to be played.
     * @function
     */
    play: (track: TrackWithUrl) => {
      update((v) => {
        if (v.at(0) && v.at(0)?._id === track._id) {
          // same track
          restartCallback();
        }
        return [track];
      });
      history.reset();
    },
    /**
     * Adds a track to the queue
     * @param {TrackWithUrl} track - The track to be added.
     * @function
     */
    add: (track: TrackWithUrl) =>
      update((v) => {
        v.push(track);
        return v;
      }),
    /**
     * Skips to next track in the queue (also called when a track finishes playing)
     * If next (v[1]) is the same as current (v[0]), restart the track
     * Pushes current track to history and removes from top of queue
     * @function
     */
    next: () =>
      update((v) => {
        if (v.at(0) && v.at(1) && v.at(0)?._id === v.at(1)?._id) {
          // same track
          restartCallback();
        }
        const track = v.shift();
        if (track) history.push(track);
        return v;
      }),
    /**
     * Skips to previous track
     * Pops last track from history and inserts at front of queue
     * @function
     */
    prev: () => {
      const previousTrack = historyValue.at(-1);
      if (previousTrack)
        update((v) => {
          if (v.at(0) && previousTrack._id === v.at(0)?._id) {
            // same track
            restartCallback();
          }
          v.unshift(previousTrack);
          history.pop();
          return v;
        });
    },
    /**
     * Removes a track from the queue
     * @param {string} id - The ID of the track to be removed.
     * @function
     */
    remove: (id: string) =>
      update((v) => {
        v = v.filter((t) => t._id !== id);
        return v;
      }),
    /**
     * Reset the queue
     * @function
     */
    reset: () => set([]),
    /**
     * Set restartCallback  (see {@link Playbar.svelte})
     * @function
     */
    setRestartCallback: (callback: () => void) => {
      restartCallback = callback;
    },
    unsubscribefromHistory,
  };
}

/**
 * Queue store
 * Used for managing what tracks will play next
 * FIFO
 * @name queue
 * @type {Writable<TrackWithUrl[]>}
 */
const queue = createQueue();
export default queue;
