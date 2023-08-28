import { writable } from "svelte/store";
import type { TrackWithUrl } from "../types";

function createHistory() {
  const { subscribe, set, update } = writable<TrackWithUrl[]>([]);

  return {
    subscribe,
    push: (track: TrackWithUrl) =>
      update((v) => {
        v = v.filter((t) => t._id !== track._id);
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
