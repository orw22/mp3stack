<script lang="ts">
  export let onClick: () => void;
  export let disabled = false;
</script>

<button class="card" on:click={onClick} {disabled}>
  <div class="card-inner">
    <slot name="title" />
    <slot name="subtitle" />
    <slot name="description" />
  </div>
</button>

<style>
  .card {
    border: 1px solid var(--color-light-grey);
    background-color: var(--color-white);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 5px 7px 0px;
    padding: 1em 2em;
    min-width: 240px;
    font-weight: 600;
    margin: 0.5em;
  }

  .card-inner {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
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
