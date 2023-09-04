<!--
  @component
  ResetPasswordForm
  
  - Used in {Profile.svelte} for updating user's name and email

  Props: 
    - {(event: Event) => void} onSubmit
    - {string} nameValue
    - {string} emailValue
    - {() => void} onCancel
-->

<script lang="ts">
  import { ALPHA_PATTERN, EMAIL_PATTERN } from "../../constants/regex";

  export let onSubmit: (event: Event) => void;
  export let nameValue: string;
  export let emailValue: string;
  export let onCancel: () => void;
</script>

<form on:submit={onSubmit}>
  <input
    type="text"
    placeholder="Name"
    required
    bind:value={nameValue}
    pattern={ALPHA_PATTERN.source}
    title="Name must be alphabetic"
  />
  <input
    type="text"
    placeholder="Email"
    required
    bind:value={emailValue}
    pattern={EMAIL_PATTERN.source}
    title="Must be a valid email address"
  />
  <button type="submit">Save</button>
  <button on:click={onCancel}>Cancel</button>
</form>
