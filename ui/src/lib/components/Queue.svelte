<script lang="ts">
  import queue from "../stores/queue";
  import IconButton from "./IconButton.svelte";
  import TrackRow from "./TrackRow.svelte";
  import XMark from "./icons/XMark.svelte";

  export let open = false;
  export let onClose: () => void;
</script>

{#if open}
  <div class="queue">
    <h3>Queue</h3>
    <IconButton onClick={onClose}>
      <XMark size={24} colour="#000" />
    </IconButton>
    {#if $queue.length > 1}
      <div class="tracklist">
        {#each $queue.slice(1) as track, index}
          <TrackRow
            {track}
            {index}
            onClick={() => queue.play(track)}
            onRemove={() => queue.remove(track._id)}
            isQueue
          />
        {/each}
      </div>
    {:else}
      <h6>There's nothing in the queue right now</h6>
    {/if}
  </div>
{/if}

<style>
  .queue {
    position: fixed;
    right: 0;
    top: 5em;
    width: 40vw;
    background: white;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .tracklist {
    display: flex;
    flex-direction: column;
  }
</style>
