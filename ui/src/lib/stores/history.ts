import { writable } from "svelte/store";
import type { TrackWithUrl } from "../types";

function createHistory() {
  const { subscribe, set, update } = writable<TrackWithUrl[]>([]);

  return {
    subscribe,
    push: (track: TrackWithUrl) =>
      update((v) => {
        if (v.some((t) => t._id === track._id)) return v;
        v.push(track);
        return v;
      }),
    pop: () =>
      update((v) => {
        v.pop();
        return v;
      }),
    reset: () => set([]),
  };
}

const history = createHistory();

export default history;
