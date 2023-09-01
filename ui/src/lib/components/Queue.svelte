<!--
  @component
  Queue
  
  - Displays list of tracks currently in the queue, each with option to play now or remove from the queue
  - (TODO) Animate in to view

  Props:
    - {boolean} open - whether the queue is showing or not
    - {() => void} onClose - callback triggered when close button clicked
-->

<script lang="ts">
  import queue from "../stores/queue";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";
  import TrackRow from "./TrackRow.svelte";

  export let open = false;
  export let onClose: () => void;
</script>

{#if open}
  <div class="queue">
    <h4>Queue</h4>
    <IconButton onClick={onClose} blank class="queue-close-btn">
      <Icon name="xMark" size={36} />
    </IconButton>
    {#if $queue.length > 1}
      <div class="tracklist">
        {#each $queue.slice(1) as track, index}
          <TrackRow
            {track}
            {index}
            onClick={() => queue.play(track)}
            onRemove={() => queue.remove(index + 1)}
            isQueue
          />
        {/each}
      </div>
    {:else}
      <p>There's nothing in the queue right now</p>
    {/if}
  </div>
{/if}

<style>
  .queue {
    position: fixed;
    padding: 2em;
    right: 0;
    top: 5em;
    width: 50vw;
    height: calc(100vh - 5em);
    background: #fff;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .tracklist {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  :global(.queue-close-btn) {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
  }
</style>
