<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-routing";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";

  export let id: string;

  let user = getUser();

  function getUser() {
    return axios.get(`/users/${id}`);
  }
</script>

<Layout>
  {#await user}
    <Loader />
  {:then { data }}
    <h4>{data.name}</h4>
    <h6>Playlists</h6>
    {#each data.playlists as playlist}
      <button
        on:click={() =>
          navigate(`/playlist/${playlist._id}`, {
            state: { canEdit: false },
          })}
      >
        {playlist.name}
      </button>
    {/each}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}
</Layout>
