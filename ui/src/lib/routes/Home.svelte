<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-routing";
  import Card from "../components/Card.svelte";
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

  function onPlaylistClick(id: string, canEdit: boolean) {
    navigate(`/playlist/${id}`, { state: { canEdit } });
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
    <h4>My Playlists</h4>
    {#each data.playlists as playlist}
      <Card
        onClick={() => onPlaylistClick(playlist._id, true)}
        textSize="large"
      >
        {playlist.name}
      </Card>
    {/each}
    {#if data.following.length > 0}
      <h4>Following</h4>
      {#each data.following as playlist}
        <Card
          onClick={() => onPlaylistClick(playlist._id, false)}
          textSize="large"
        >
          {playlist.name}
        </Card>
      {/each}
    {/if}
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
      <button
        on:click={() => {
          creating = false;
        }}
      >
        Cancel
      </button>
    </form>
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

  <div class="search">
    <form on:submit={onSearchUsers}>
      <input type="text" bind:value={searchQuery} placeholder="Search users" />
      <button type="submit" disabled={!searchQuery}>Search</button>
    </form>
  </div>

  <div>
    {#each searchResult as user}
      <Card onClick={() => onOtherUserClick(user._id)}>{user.name}</Card>
    {/each}
  </div>
</Layout>

<style>
  .search {
    margin: 1em 0;
  }
</style>
