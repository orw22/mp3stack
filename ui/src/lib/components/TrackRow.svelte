<script lang="ts">
  import type { Track } from "../types";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";

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
    <IconButton onClick={() => onClick(track)}
      ><Icon name="play" size={20} /></IconButton
    >
    {#if !isQueue}
      <button on:click={() => onAddToQueue(track)}>Add to queue</button>
    {/if}
    <IconButton onClick={() => onRemove(track._id)}>
      {#if isQueue}
        Remove <Icon name="xMark" size={20} />
      {:else}
        Delete <Icon name="trash" size={20} />
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
