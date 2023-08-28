<script lang="ts">
  import type { Track } from "../types";

  export let track: Track;
  export let index: number;
  export let onClick: (track: Track) => void;
  export let onAddToQueue: (track: Track) => void;
  export let onRemove: (id: string) => void;
</script>

<div role="row" tabindex={index}>
  <span>{track.name}</span>
  <span>
    <button on:click={() => onClick(track)}>Play now</button>
    <button on:click={() => onAddToQueue(track)}>Add to queue</button>
    <button on:click={() => onRemove(track._id)}>Remove</button>
  </span>
</div>

<style>
  div[role="row"] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid lightgrey;
    padding: 0.25em 1.5em;
  }
</style>
