<!--
  @component
  SearchBar

  - Search bar with input and search button
-->

<script lang="ts">
  export let onSubmit: (event: Event) => void;
  export let onInput: (event: Event) => void;
  export let value: string;
  export let searchButtonDisabled: boolean;
</script>

<div class="search">
  <form on:submit|preventDefault={onSubmit}>
    <input
      type="text"
      bind:value
      on:input|preventDefault={onInput}
      placeholder="Search users"
    />
    <button type="submit" disabled={searchButtonDisabled}>Search</button>
  </form>
</div>

<style>
  .search {
    margin: 1em 0;
  }

  input {
    min-width: 440px;
  }
</style>
