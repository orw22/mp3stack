<!--
  @component
  NameForm
  
  - Reusable single input form (e.g. used when creating or renaming a playlist)

  Props: 
    - {(event: Event) => void} onSubmit - callback function to be called when the form is submitted
    - {string} value - value of the input to bind to
    - {string} submitButtonLabel - label of the submit button
    - {() => void} onCancel - callback function to be called when the cancel button is clicked
    - {string} placeholder - placeholder text for the input
    - {string} title - error message for the input when the pattern is not matched
-->

<script lang="ts">
  import { ALPHANUMERIC_PATTERN } from "../constants/regex";

  export let onSubmit: (event: Event) => void;
  export let value: string;
  export let submitButtonLabel: string;
  export let onCancel: () => void;
  export let placeholder = "Playlist name";
  export let title = "Playlist name must be alphanumeric";
</script>

<form on:submit={onSubmit}>
  <input
    type="text"
    {placeholder}
    required
    pattern={ALPHANUMERIC_PATTERN.source}
    {title}
    bind:value
  />
  <button type="submit">{submitButtonLabel}</button>
  <button on:click={onCancel}>Cancel</button>
</form>
