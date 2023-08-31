<script lang="ts">
  export let onClick: () => void;
  export let disabled = false;
</script>

<button class="card" on:click={onClick} {disabled}>
  <slot />
</button>

<style>
  .card {
    background-color: var(--color-white);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 5px 7px 0px;
    padding: 1em 2em;
    min-width: 240px;
    font-size: 1.1em;
    font-weight: 600;
  }
</style>
