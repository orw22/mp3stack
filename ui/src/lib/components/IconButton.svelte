<!--
  @component
  IconButton
  
  - Specialised button component for displaying icons optionally with text

  Props:
    - {string} class (via $$props.class)
    - {() => void} onClick
    - {boolean} disabled
    - {"button" | "submit" | "reset"} type
    = {boolean} blank - if true, the button will be blank (no background, no border, no padding, no margin)
-->

<script lang="ts">
  export let onClick: (() => void) | undefined = undefined;
  export let disabled: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";
  export let blank: boolean = false;
</script>

<button
  class="icon-button {$$props.class ?? ''} {blank ? 'blank' : ''}"
  on:click={onClick}
  {disabled}
  {type}
>
  <slot />
</button>

<style>
  .icon-button {
    display: flex;
    align-items: center;
    gap: 0.3em;
  }

  .icon-button.blank {
    padding: 0;
    border: none;
    background: none;
    margin: 0.75em;
  }
  .icon-button.blank:hover {
    border: none;
    background: none;
  }
  .icon-button.blank:focus,
  .icon-button.blank:focus-visible {
    border: none;
    background: none;
    outline: none;
  }
</style>
