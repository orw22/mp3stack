<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-routing";
  import toasts from "../../toasts";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";
  import TrackRow from "../components/TrackRow.svelte";
  import blobUrls from "../stores/blobUrls";
  import queue from "../stores/queue";
  import type { Track } from "../types";
  import { FetchMode } from "../types/enums";

  export let id: string;

  let adding = false;

  let newTrackName: string;
  let newTrackFiles: FileList;

  let playlist = getPlaylist();

  function getPlaylist() {
    return axios.get(`/playlists/${id}`);
  }

  function refreshPlaylist() {
    playlist = getPlaylist();
  }

  async function fetchTrack(track: Track, mode: FetchMode) {
    const existingUrl = $blobUrls.get(track._id);
    let action = mode === FetchMode.Play ? queue.play : queue.add;

    if (existingUrl) action({ ...track, url: existingUrl });
    else
      await axios
        .get(`/tracks/${track._id}`, {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "audio/mpeg",
          },
        })
        .then(function (response) {
          const url = URL.createObjectURL(
            new Blob([response.data], {
              type: "audio/mpeg",
            })
          );
          blobUrls.setUrl(track._id, url);
          action({ ...track, url });
        });
  }

  async function onClickTrack(track: Track) {
    await fetchTrack(track, FetchMode.Play);
  }

  async function onAddToQueue(track: Track) {
    await fetchTrack(track, FetchMode.Queue);
  }

  async function onRemoveTrack(trackId: string) {
    await axios.put(`/playlists/${id}/${trackId}`).then(() => {
      toasts.success("Track removed");
      refreshPlaylist();
    });
  }

  async function onAddTrack(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", newTrackName);
    formData.append("track", newTrackFiles[0]);

    await axios
      .put(`/playlists/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        adding = false;
        newTrackName = "";
        refreshPlaylist();
      });
  }

  async function onDeletePlaylist() {
    await axios.delete(`/playlists/${id}`).then(() => {
      toasts.success("Playlist deleted");
      navigate("/");
    });
  }
</script>

<Layout>
  {#await playlist}
    <Loader />
  {:then { data }}
    <h3>{data.name}</h3>
    <div class="tracklist">
      {#each data.tracks as track, index}
        <TrackRow
          {track}
          {index}
          onClick={() => onClickTrack(track)}
          onAddToQueue={() => onAddToQueue(track)}
          onRemove={() => onRemoveTrack(track._id)}
        />
      {/each}
    </div>
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}

  {#if $queue.length > 1}
    <hr />
    <h4>Queue</h4>
    <div class="queue">
      {#each $queue.slice(1) as track}
        <div>
          <button on:click={() => onClickTrack(track)}>
            {track.name}
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <hr />

  {#if adding}
    <form on:submit={onAddTrack}>
      <input type="file" bind:files={newTrackFiles} />
      <input type="text" placeholder="Track name" bind:value={newTrackName} />
      <button type="submit">Upload</button>
    </form>
    <button
      on:click={() => {
        adding = false;
      }}
    >
      Cancel
    </button>
  {:else}
    <button
      on:click={() => {
        adding = true;
      }}
    >
      Add track
    </button>
  {/if}

  <button on:click={onDeletePlaylist}>Delete playlist</button>
  <button on:click={() => navigate("/")}>Back</button>
</Layout>

<style>
  .tracklist {
    display: flex;
    flex-direction: column;
  }
</style>
