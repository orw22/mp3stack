<script lang="ts">
  import Icon from "../../components/Icon.svelte";
  import IconButton from "../../components/IconButton.svelte";
  import { ALPHANUMERIC_PATTERN } from "../../constants/regex";

  export let onSubmit: (event: Event) => void;
  export let files: FileList;
  export let nameValue: string;
  export let onCancel: () => void;
</script>

<form on:submit={onSubmit}>
  <input type="file" bind:files />
  <input
    type="text"
    placeholder="Track name"
    required
    bind:value={nameValue}
    pattern={ALPHANUMERIC_PATTERN.source}
    title="Track name must be alphanumeric"
  />
  <IconButton type="submit">Upload <Icon name="upload" size={20} /></IconButton>
  <button on:click={onCancel}>Cancel</button>
</form>

<style>
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 1em;
  }

  /* file upload button */
  input[type="file"]::file-selector-button {
    margin-right: 1em;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-weight: 500;
    font-family: inherit;
    background-color: var(--color-light-grey);
    cursor: pointer;
    transition: border-color 0.25s, background-color 0.25s;
  }

  input[type="file"]::file-selector-button:hover {
    border-color: var(--color-primary);
  }

  input[type="file"]::file-selector-button:focus,
  input[type="file"]::file-selector-button:focus-visible {
    outline: 4px auto var(--color-primary);
  }
</style>
