<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-routing";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";

  let creating = false;
  let newPlaylistName: string;

  let playlists = getPlaylists();

  function getPlaylists() {
    return axios.get("/users/me/playlists");
  }

  function refreshPlaylists() {
    playlists = getPlaylists();
  }

  function onPlaylistClick(id: string) {
    navigate(`/playlist/${id}`);
  }

  function onProfileClick() {
    navigate("/profile");
  }

  function onOtherUserClick() {
    navigate("/user/64ea025fa813cf9b075c7db8");
  }

  async function onCreatePlaylist(event: Event) {
    event.preventDefault();

    await axios.post("/playlists", { name: newPlaylistName }).then(() => {
      newPlaylistName = "";
      creating = false;
      refreshPlaylists();
    });
  }
</script>

<Layout>
  {#await playlists}
    <Loader />
  {:then { data }}
    <h3>My Playlists</h3>
    {#each data as playlist}
      <button on:click={() => onPlaylistClick(playlist._id)}>
        {playlist.name}
      </button>
    {/each}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}

  <hr />

  {#if creating}
    <form on:submit={onCreatePlaylist}>
      <input
        type="text"
        placeholder="Playlist name"
        bind:value={newPlaylistName}
      />
      <button type="submit">Create</button>
    </form>
    <button
      on:click={() => {
        creating = false;
      }}
    >
      Cancel
    </button>
  {:else}
    <button
      on:click={() => {
        creating = true;
      }}
    >
      Create new playlist
    </button>
  {/if}

  <button on:click={onProfileClick}>My profile</button>

  <!-- temp -->
  <button on:click={onOtherUserClick}>Other user</button>
</Layout>
