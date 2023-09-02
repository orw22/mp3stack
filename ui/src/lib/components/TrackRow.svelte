<!--
  @component
  TrackRow
  
  - Renders a single track inside a playlist's tracklist or in the queue
  - Shows track name and buttons to play now, add to queue and remove/delete from playlist

  Props:
    - {Track} track
    - {number} index - position of track in the tracklist
    - {() => void} onClick
    - {() => void} onRemove
    - {() => void} onAddToQueue
    - {boolean} isQueue - indicates whether the component is rendering as part of the Queue
    - {boolean} canEdit - indicates whether admin actions (remove/delete) can be performed on the track
-->

<script lang="ts">
  import type { Track } from "../types";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";

  export let track: Track;
  export let index: number;
  export let onClick: () => void;
  export let onRemove: () => void;
  export let onAddToQueue: () => void = () => null;
  export let isQueue: boolean = false;
  export let canEdit: boolean = true;
</script>

<div role="row" tabindex={index}>
  <span>{track.name}</span>
  <span>
    <IconButton {onClick}>
      <Icon name="play" size={20} />
    </IconButton>
    {#if !isQueue}
      <button on:click={onAddToQueue}>Add to queue</button>
    {/if}
    {#if canEdit}
      <IconButton onClick={onRemove}>
        {#if isQueue}
          Remove <Icon name="xMark" size={20} />
        {:else}
          Delete <Icon name="trash" size={20} />
        {/if}
      </IconButton>
    {/if}
  </span>
</div>

<style>
  div[role="row"] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-medium-grey);
    padding: 0.25em 1.5em;
  }

  div[role="row"] span {
    display: inherit;
    gap: 0.5em;
  }
</style>
