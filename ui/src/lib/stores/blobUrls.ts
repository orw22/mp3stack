import { writable } from "svelte/store";

function createBlobUrls() {
  const { subscribe, set, update } = writable<Map<string, string>>(new Map());

  return {
    subscribe,
    setUrl: (id: string, url: string) =>
      update((v) => {
        v.set(id, url);
        return v;
      }),
    reset: () => set(new Map()),
  };
}

const blobUrls = createBlobUrls();
export default blobUrls;
