<script lang="ts">
  export let onClick: (() => void) | undefined = undefined;
  export let disabled: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";
</script>

<button class={$$props.class} on:click={onClick} {disabled} {type}>
  <slot />
</button>
