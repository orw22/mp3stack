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
  export let onSubmit: (event: Event) => void;
  export let register = false;
</script>

<form on:submit={onSubmit}>
  <input
    name="email"
    type="text"
    placeholder="Email"
    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
    title="Must be a valid email address"
  />
  {#if register}
    <input
      name="name"
      type="text"
      placeholder="Full name"
      pattern="[a-zA-Z ]+"
      title="Must be alphabetic"
    />
  {/if}
  <input
    name="password"
    type="password"
    placeholder="Password"
    pattern=""
    title="Weak password"
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
