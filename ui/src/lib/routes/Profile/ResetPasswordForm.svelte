<!--
  @component
  ResetPasswordForm
  
  - Used in {Profile.svelte} for resetting password
  - Contains password and reenter password fields

  Props: 
    - {(event: Event) => void} onSubmit
    - {string} value
    - {string} checkValue
    - {() => void} onCancel
    - {boolean} submitButtonDisabled
-->

<script lang="ts">
  import { PASSWORD_PATTERN } from "../../constants/regex";

  export let onSubmit: (event: Event) => void;
  export let value: string;
  export let checkValue: string;
  export let onCancel: () => void;
  export let submitButtonDisabled: boolean;
</script>

<form on:submit={onSubmit}>
  <input
    type="password"
    placeholder="Password"
    required
    bind:value
    pattern={PASSWORD_PATTERN.source}
    title="Password must be at least 10 characters in length"
  />
  <input
    type="password"
    placeholder="Re-enter password"
    required
    bind:value={checkValue}
  />
  <button type="submit" disabled={submitButtonDisabled}>Submit</button>
  <button on:click={onCancel}>Cancel</button>
</form>
