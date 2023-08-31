<script lang="ts">
  export let onClick: () => void;
  export let textSize: "small" | "medium" | "large" = "medium";
  export let disabled = false;

  let fontSize = textSize === "small" ? 0.8 : textSize === "medium" ? 1 : 1.2;
</script>

<button
  class="card"
  style="font-size: {fontSize}em"
  on:click={onClick}
  {disabled}
>
  <slot />
</button>

<style>
  .card {
    border: 1px solid var(--color-light-grey);
    background-color: var(--color-white);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 5px 7px 0px;
    padding: 1em 2em;
    min-width: 240px;
    font-weight: 600;
  }

  button:hover {
    background-color: var(--color-light-grey);
    border: 1px solid var(--color-primary);
  }
  button:focus,
  button:focus-visible {
    outline: none;
    background-color: var(--color-light-grey);
  }
</style>
