<script lang="ts">
  import { navigate } from "svelte-navigator";
  import api from "../../api";
  import ActionBar from "../components/ActionBar.svelte";
  import Card from "../components/Card.svelte";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";
  import NameForm from "../components/NameForm.svelte";

  let creating = false;
  let newPlaylistName: string;

  let playlists = getPlaylists();

  function getPlaylists() {
    return api.noCacheGet("/users/me/playlists");
  }

  function refreshPlaylists() {
    playlists = getPlaylists();
  }

  function setCreating(value: boolean) {
    creating = value;
  }

  function onPlaylistClick(id: string, canEdit: boolean) {
    navigate(`/playlist/${id}`, { state: { canEdit } });
  }

  async function onCreatePlaylist(event: Event) {
    await api.post("/playlists", { name: newPlaylistName }).then(() => {
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
    <h4>Playlists</h4>
    {#each data.playlists as playlist}
      <Card onClick={() => onPlaylistClick(playlist._id, true)}>
        <h5 slot="title">{playlist.name}</h5>
      </Card>
    {/each}
    {#if data.playlists.length === 0}
      <p>You haven't created any playlists yet.</p>
    {/if}
    {#if data.following.length > 0}
      <h4>Following</h4>
      {#each data.following as playlist}
        <Card onClick={() => onPlaylistClick(playlist._id, false)}>
          <h5 slot="title">{playlist.name}</h5>
          <small slot="subtitle">by {playlist.userId}</small>
        </Card>
      {/each}
    {/if}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}

  <ActionBar>
    <button on:click={() => setCreating(true)}>Create new playlist</button>
  </ActionBar>

  {#if creating}
    <NameForm
      onSubmit={onCreatePlaylist}
      bind:value={newPlaylistName}
      submitButtonLabel="Create"
      onCancel={() => setCreating(false)}
    />
  {/if}
</Layout>
