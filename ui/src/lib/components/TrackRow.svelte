<script lang="ts">
  import type { Track } from "../types";
  import IconButton from "./IconButton.svelte";
  import Trash from "./icons/Trash.svelte";
  import XMark from "./icons/XMark.svelte";

  export let track: Track;
  export let index: number;
  export let onClick: (track: Track) => void;
  export let onRemove: (id: string) => void;
  export let onAddToQueue: (track: Track) => void = () => null;
  export let isQueue: boolean = false;
</script>

<div role="row" tabindex={index}>
  <span>{track.name}</span>
  <span>
    <button on:click={() => onClick(track)}>Play now</button>
    {#if !isQueue}
      <button on:click={() => onAddToQueue(track)}>Add to queue</button>
    {/if}
    <IconButton onClick={() => onRemove(track._id)}>
      {#if isQueue}
        <XMark size={20} colour="#000" />
      {:else}
        <Trash size={20} colour="#000" />
      {/if}
    </IconButton>
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
