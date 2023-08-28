<script lang="ts">
  import axios from "axios";
  import { Wave } from "svelte-loading-spinners";
  import { navigate } from "svelte-routing";

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

  async function onCreatePlaylist(event: any) {
    event.preventDefault();

    await axios.post("/playlists", { name: newPlaylistName }).then(() => {
      newPlaylistName = "";
      creating = false;
      refreshPlaylists();
    });
  }
</script>

{#await playlists}
  <Wave size="60" color="#FF3E00" unit="px" duration="1s" />
{:then { data }}
  <h3>Playlists</h3>
  {#each data as playlist}
    <button on:click={() => onPlaylistClick(playlist._id)}>
      {playlist.name}
    </button>
  {/each}
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

<button on:click={onProfileClick}> My profile </button>
