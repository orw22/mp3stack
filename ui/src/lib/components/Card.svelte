<!--
  @component
  Card
  
  - Renders a clickable card with a title, subtitle, and description
  - Uses slots to allow for custom content

  Props: 
    - {() => void} onClick - callback function to be called when the card is clicked
    - {boolean} disabled - whether the card is disabled or not
-->

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
    border: 2px solid transparent;
    background-color: var(--color-light-grey);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 5px 7px 0px;
    min-width: 240px;
    margin: 0.5em;
    padding: 1.5em 2em;
  }

  .card-inner {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  :global(.card-inner *) {
    margin: 0;
  }

  button:hover {
    border: 2px solid var(--color-primary);
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto var(--color-primary);
    background-color: var(--color-light-grey);
  }
</style>
