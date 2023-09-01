<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-navigator";
  import Card from "../components/Card.svelte";
  import Layout from "../components/Layout.svelte";
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
    await axios
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
  <div class="search">
    <form on:submit={onSearchUsers}>
      <input
        type="text"
        bind:value={searchQuery}
        on:input={onSearchUsers}
        placeholder="Search users"
      />
      <button type="submit" disabled={!searchQuery}>Search</button>
    </form>
  </div>

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

<style>
  .search {
    margin: 1em 0;
  }

  input {
    width: 400px;
  }
</style>
