<script lang="ts">
  export let disabled: boolean;
  export let onClick: () => void;
  export let type: "button" | "submit" | "reset" = "button";
</script>

<button class="icon-button" {disabled} on:click={onClick} {type}>
  <slot />
</button>

<style>
  /* TODO */
</style>
