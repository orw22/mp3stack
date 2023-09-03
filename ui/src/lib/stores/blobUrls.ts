import { writable } from "svelte/store";

function createBlobUrls() {
  const { subscribe, set, update } = writable<Map<string, string>>(new Map());

  return {
    subscribe,
    /**
     * Sets a blob URL
     * @param id - The track ID
     * @param url - The URL for the track's blob
     * @function
     */
    setUrl: (id: string, url: string) =>
      update((v) => {
        v.set(id, url);
        return v;
      }),
    /**
     * Reset blobUrls store
     * @function
     */
    reset: () => set(new Map()),
  };
}

/**
 * Blob URL store
 * Maintains references to tracks fetched from API and stored in memory
 * Maps track IDs to corresponding blob URLs
 * @name blobUrls
 * @type {Writable<Map<string, string>>}
 */
const blobUrls = createBlobUrls();
export default blobUrls;
