<!--
  @component
  IconButton
  
  - Specialised button component for displaying icons optionally with text

  Props:
    - {string} class (via $$props.class)
    - {() => void} onClick
    - {boolean} disabled
    - {"button" | "submit" | "reset"} type
-->

<script lang="ts">
  export let onClick: (() => void) | undefined = undefined;
  export let disabled: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";
</script>

<button
  class="icon-button {$$props.class}"
  on:click={onClick}
  {disabled}
  {type}
>
  <slot />
</button>

<style>
</style>
