<script lang="ts">
  import { navigate } from "svelte-navigator";
  import api from "../../api";
  import Card from "../components/Card.svelte";
  import Layout from "../components/Layout.svelte";
  import SearchBar from "../components/SearchBar.svelte";
  import type { User } from "../types";

  const SEARCH_WINDOW = 200;

  let searchQuery: string;
  let prevUserInputEvent: number;

  let searchResult: User[] = [];

  async function onSearchUsers(event: Event) {
    event.preventDefault();
    // throttle API calls
    if (prevUserInputEvent > event.timeStamp - SEARCH_WINDOW) return;

    prevUserInputEvent = event.timeStamp;
    await api
      .get("/users", { params: { name: searchQuery } })
      .then((response) => {
        searchResult = response.data as User[];
      });
  }

  function onOtherUserClick(id: string) {
    navigate(`/user/${id}`);
  }
</script>

<Layout>
  <SearchBar
    onSubmit={onSearchUsers}
    onInput={onSearchUsers}
    bind:value={searchQuery}
    searchButtonDisabled={!searchQuery}
  />

  <div>
    {#each searchResult as user}
      <Card onClick={() => onOtherUserClick(user._id)}>
        <span slot="title">{user.name}</span>
      </Card>
    {/each}
    {#if searchResult.length === 0}
      <span>No results</span>
    {/if}
  </div>
</Layout>
