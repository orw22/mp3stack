<!--
  @component
  ActionBar

  - Container component for page action buttons
-->

<hr />

<div class="action-bar">
  <slot />
</div>

<style>
  .action-bar {
    width: 100%;
    display: flex;
    gap: 0.25em;
    justify-content: center;
    margin-bottom: 1.5em;
  }
</style>
