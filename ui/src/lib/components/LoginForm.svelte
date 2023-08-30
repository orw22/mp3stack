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
  <input name="email" type="text" placeholder="Email" />
  {#if register}
    <input name="name" type="text" placeholder="Full name" />
  {/if}
  <input name="password" type="password" placeholder="Password" />
  <button type="submit">{register ? "Register" : "Log in"}</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    margin-bottom: 0.8em;
    min-width: 280px;
  }
</style>
