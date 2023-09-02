<script lang="ts">
  import { navigate } from "svelte-navigator";
  import api from "../../api";
  import Card from "../components/Card.svelte";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";

  export let id: string;

  let user = getUser();

  function getUser() {
    return api.get(`/users/${id}`);
  }
</script>

<Layout>
  {#await user}
    <Loader />
  {:then { data }}
    <h4>{data.name}</h4>
    <h6>Playlists</h6>
    {#each data.playlists as playlist}
      <Card
        onClick={() =>
          navigate(`/playlist/${playlist._id}`, {
            state: { canEdit: false },
          })}
      >
        <h6 slot="title">{playlist.name}</h6>
      </Card>
    {/each}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}
</Layout>
