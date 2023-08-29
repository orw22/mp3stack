import { writable } from "svelte/store";
import type { TrackWithUrl } from "../types";
import history from "./history";

function createQueue() {
  const { subscribe, set, update } = writable<TrackWithUrl[]>([]);
  let historyValue: TrackWithUrl[];
  const unsubscribefromHistory = history.subscribe((value) => {
    historyValue = value;
  });

  let restartCallback: () => void = () => null;

  return {
    subscribe,
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
    add: (track: TrackWithUrl) =>
      update((v) => {
        v.push(track);
        return v;
      }),
    next: () =>
      update((v) => {
        console.log(v);
        if (v.at(0) && v.at(1) && v.at(0)?._id === v.at(1)?._id) {
          // same track
          restartCallback();
        }
        const track = v.shift();
        if (track) history.push(track);
        return v;
      }),
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
    remove: (id: string) =>
      update((v) => {
        v = v.filter((t) => t._id !== id);
        return v;
      }),
    reset: () => set([]),
    setRestartCallback: (callback: () => void) => {
      restartCallback = callback;
    },
    unsubscribefromHistory,
  };
}

const queue = createQueue();
export default queue;
