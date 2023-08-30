<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-routing";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";
  import type { User } from "../types";

  let creating = false;
  let newPlaylistName: string;
  let searchQuery: string;
  let searchResult: User[] = [];

  let playlists = getPlaylists();

  function getPlaylists() {
    return axios.get("/users/me/playlists");
  }

  function refreshPlaylists() {
    playlists = getPlaylists();
  }

  function onPlaylistClick(id: string) {
    navigate(`/playlist/${id}`, { state: { canEdit: true } });
  }

  function onProfileClick() {
    navigate("/profile");
  }

  function onOtherUserClick(id: string) {
    navigate(`/user/${id}`);
  }

  async function onCreatePlaylist(event: Event) {
    event.preventDefault();

    await axios.post("/playlists", { name: newPlaylistName }).then(() => {
      newPlaylistName = "";
      creating = false;
      refreshPlaylists();
    });
  }

  async function onSearchUsers(event: Event) {
    event.preventDefault();

    await axios
      .get("/users", { params: { name: searchQuery } })
      .then((response) => {
        searchResult = response.data as User[];
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

  <div>
    <form on:submit={onSearchUsers}>
      <input type="text" bind:value={searchQuery} placeholder="Search users" />
      <button type="submit">Search</button>
    </form>
  </div>

  <div>
    {#each searchResult as user}
      <button on:click={() => onOtherUserClick(user._id)}>{user.name}</button>
    {/each}
  </div>
</Layout>
