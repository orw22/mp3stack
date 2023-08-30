<script lang="ts">
  import axios from "axios";
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
    <h3>User: {data.name}</h3>
    {#each data.playlists as playlist, index}
      <button>{playlist.name}</button>
    {/each}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}
</Layout>
