<!--
  @component
  LoginForm
  
  - Login and register forms
  - Used in {Login.svelte}

  Props: 
    - {(event: Event) => void} onSubmit
    - {boolean} register
-->

<script lang="ts">
  import {
    ALPHA_PATTERN,
    EMAIL_PATTERN,
    PASSWORD_PATTERN,
  } from "../constants/regex";

  export let onSubmit: (event: Event) => void;
  export let register = false;
</script>

<form on:submit={onSubmit}>
  <input
    name="email"
    type="text"
    placeholder="Email"
    required
    pattern={EMAIL_PATTERN.source}
    title="Must be a valid email address"
  />
  {#if register}
    <input
      name="name"
      type="text"
      required
      placeholder="Full name"
      pattern={ALPHA_PATTERN.source}
      title="Name must be alphabetic"
    />
  {/if}
  <input
    name="password"
    type="password"
    required
    placeholder="Password"
    pattern={PASSWORD_PATTERN.source}
    title="Password must be at least 10 characters in length and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol"
  />
  <button type="submit">{register ? "Register" : "Log in"}</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }

  input {
    min-width: 280px;
  }
</style>
