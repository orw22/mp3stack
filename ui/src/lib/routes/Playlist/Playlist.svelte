<script lang="ts">
  import { onDestroy } from "svelte";
  import { navigate } from "svelte-navigator";
  import api from "../../../api";
  import toasts from "../../../toasts";
  import ActionBar from "../../components/ActionBar.svelte";
  import Layout from "../../components/Layout.svelte";
  import Loader from "../../components/Loader.svelte";
  import NameForm from "../../components/NameForm.svelte";
  import TrackRow from "../../components/TrackRow.svelte";
  import blobUrls from "../../stores/blobUrls";
  import eventSource from "../../stores/eventSource";
  import queue from "../../stores/queue";
  import type { Track } from "../../types";
  import { TrackAction } from "../../types/enums";
  import AddTrackForm from "./AddTrackForm.svelte";

  export let id: string;

  let isPrivate: boolean;
  let following: boolean;

  let updated = false;

  let adding = false;
  let renaming = false;

  let newTrackName: string;
  let newTrackFiles: FileList;

  let newPlaylistName: string;

  const canEdit = history.state.canEdit;

  let playlist: Promise<any> = getPlaylist();

  function setUpdated(value: boolean) {
    updated = value;
  }

  function setAdding(value: boolean) {
    adding = value;
  }

  function setRenaming(value: boolean) {
    renaming = value;
  }

  $: playlist,
    (async () => {
      try {
        const response = await playlist;
        isPrivate = response.data.private;
        following = response.data.following;
      } catch (error) {
        return;
      }
    })();

  function updateNewTrackNameFromFilename() {
    try {
      newTrackName = newTrackFiles[0]?.name.replace(".mp3", "");
    } catch (error) {
      newTrackName = "";
    }
  }

  $: newTrackFiles, updateNewTrackNameFromFilename();

  function getPlaylist() {
    return api.get(`/playlists/${id}`);
  }

  async function fetchTrack(track: Track, action: TrackAction) {
    const existingUrl = $blobUrls.get(track._id);
    let func = action === TrackAction.Play ? queue.play : queue.add;

    if (existingUrl) func({ ...track, url: existingUrl });
    else
      await api
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
          func({ ...track, url });
        });
  }

  async function onClickTrack(track: Track) {
    await fetchTrack(track, TrackAction.Play);
  }

  async function onAddToQueue(track: Track) {
    await fetchTrack(track, TrackAction.Queue);
  }

  async function onRemoveTrack(trackId: string) {
    await api.delete(`/playlists/${id}/tracks/${trackId}`).then(() => {
      toasts.success("Track removed");
    });
  }

  async function onAddTrack(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", newTrackName);
    try {
      formData.append("track", newTrackFiles[0]);
    } catch (error) {
      toasts.error("No file selected");
      return;
    }

    await api
      .post(`/playlists/${id}/tracks`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setAdding(false);
        newTrackName = "";
      });
  }

  async function onRenamePlaylist(event: Event) {
    event.preventDefault();

    await api.put(`/playlists/${id}`, { name: newPlaylistName }).then(() => {
      toasts.success("Playlist updated");
      newPlaylistName = "";
      setRenaming(false);
    });
  }

  async function onChangeVisibility() {
    await api.put(`/playlists/${id}`, { private: !isPrivate }).then(() => {
      toasts.success("Playlist updated");
    });
  }

  async function onDeletePlaylist() {
    await api.delete(`/playlists/${id}`).then(() => {
      toasts.success("Playlist deleted");
      navigate("/");
    });
  }

  async function onChangeFollow() {
    await api.put(`/playlists/${id}/follow`).then(() => {
      toasts.success("Follow status updated");
    });
  }

  function onPlaylistUpdate(event: MessageEvent) {
    playlist = Promise.resolve({ data: JSON.parse(event.data) });
    setUpdated(true);
  }

  eventSource?.addEventListener("playlistUpdate", onPlaylistUpdate);
  onDestroy(() => {
    if (updated) api.noCacheGet(`/playlists/${id}`); // update HTTP cache in background
    eventSource?.removeEventListener("playlistUpdate", onPlaylistUpdate);
  });
</script>

<Layout>
  {#await playlist}
    <Loader />
  {:then { data }}
    <h4>{data.name}</h4>
    {#if !data.private}
      <p>Followers: {data.followers?.length ?? 0}</p>
    {/if}
    <div class="tracklist">
      {#each data.tracks as track, index}
        <TrackRow
          {track}
          {index}
          onClick={() => onClickTrack(track)}
          onAddToQueue={() => onAddToQueue(track)}
          onRemove={() => onRemoveTrack(track._id)}
          {canEdit}
        />
      {/each}
    </div>
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}

  <ActionBar>
    {#if canEdit}
      <button
        on:click={() => {
          setAdding(true);
          setRenaming(false);
        }}
      >
        Add track
      </button>
      <button
        on:click={() => {
          setRenaming(true);
          setAdding(false);
        }}
      >
        Rename playlist
      </button>
      <button on:click={onChangeVisibility}>
        Make {isPrivate ? "public" : "private"}
      </button>
      <button on:click={onDeletePlaylist}>Delete playlist</button>
    {:else}
      <button on:click={() => onChangeFollow()}>
        {following ? "Unfollow" : "Follow"}
      </button>
    {/if}
  </ActionBar>

  {#if adding}
    <AddTrackForm
      onSubmit={onAddTrack}
      bind:files={newTrackFiles}
      bind:nameValue={newTrackName}
      onCancel={() => setAdding(false)}
    />
  {/if}

  {#if renaming}
    <NameForm
      onSubmit={onRenamePlaylist}
      bind:value={newPlaylistName}
      submitButtonLabel="Confirm"
      onCancel={() => setRenaming(false)}
    />
  {/if}
</Layout>

<style>
  /* form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 1em;
  } */

  .tracklist {
    display: flex;
    flex-direction: column;
  }
</style>
