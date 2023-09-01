<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-navigator";
  import toasts from "../../toasts";
  import Icon from "../components/Icon.svelte";
  import IconButton from "../components/IconButton.svelte";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";
  import TrackRow from "../components/TrackRow.svelte";
  import blobUrls from "../stores/blobUrls";
  import queue from "../stores/queue";
  import type { Track } from "../types";
  import { TrackAction } from "../types/enums";

  export let id: string;

  let isPrivate: boolean;
  let following: boolean;

  let adding = false;
  let renaming = false;

  let newTrackName: string;
  let newTrackFiles: FileList;

  let newPlaylistName: string;

  const canEdit = history.state.canEdit;

  let playlist = getPlaylist();

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
    return axios.get(`/playlists/${id}`);
  }

  function refreshPlaylist() {
    playlist = getPlaylist();
  }

  async function fetchTrack(track: Track, action: TrackAction) {
    const existingUrl = $blobUrls.get(track._id);
    let func = action === TrackAction.Play ? queue.play : queue.add;

    if (existingUrl) func({ ...track, url: existingUrl });
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
    await axios.delete(`/playlists/${id}/tracks/${trackId}`).then(() => {
      toasts.success("Track removed");
      refreshPlaylist();
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

    await axios
      .post(`/playlists/${id}/tracks`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        adding = false;
        newTrackName = "";
        refreshPlaylist();
      });
  }

  async function onRenamePlaylist(event: Event) {
    event.preventDefault();

    await axios.put(`/playlists/${id}`, { name: newPlaylistName }).then(() => {
      toasts.success("Playlist updated");
      newPlaylistName = "";
      renaming = false;
      refreshPlaylist();
    });
  }

  async function onChangeVisibility() {
    await axios.put(`/playlists/${id}`, { private: !isPrivate }).then(() => {
      toasts.success("Playlist updated");
      refreshPlaylist();
    });
  }

  async function onDeletePlaylist() {
    await axios.delete(`/playlists/${id}`).then(() => {
      toasts.success("Playlist deleted");
      navigate("/");
    });
  }

  async function onChangeFollow() {
    await axios.put(`/playlists/${id}/follow`).then(() => refreshPlaylist());
  }
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

  <hr />

  {#if adding}
    <form on:submit={onAddTrack}>
      <input type="file" bind:files={newTrackFiles} />
      <input type="text" placeholder="Track name" bind:value={newTrackName} />
      <IconButton type="submit"
        >Upload <Icon name="upload" size={20} /></IconButton
      >
      <button
        on:click={() => {
          adding = false;
        }}
      >
        Cancel
      </button>
    </form>
  {/if}

  {#if renaming}
    <form on:submit={onRenamePlaylist}>
      <input
        type="text"
        placeholder="Playlist name"
        bind:value={newPlaylistName}
      />
      <button type="submit">Confirm</button>
      <button
        on:click={() => {
          renaming = false;
        }}
      >
        Cancel
      </button>
    </form>
  {/if}

  {#if canEdit}
    <button
      on:click={() => {
        adding = true;
        renaming = false;
      }}
    >
      Add track
    </button>
    <button
      on:click={() => {
        renaming = true;
        adding = false;
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
</Layout>

<style>
  .tracklist {
    display: flex;
    flex-direction: column;
  }
</style>
