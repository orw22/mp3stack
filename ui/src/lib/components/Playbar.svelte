<script lang="ts">
  import history from "../stores/history";
  import queue from "../stores/queue";

  $: currentTrack = $queue.at(0);
</script>

<div class="playbar">
  <h4>Now playing: {currentTrack?.name}</h4>
  <button on:click={queue.prev} disabled={$history.length === 0}
    >Previous</button
  >
  <audio controls src={currentTrack?.url} autoplay on:ended={queue.next}>
    Your browser does not support the audio element.
  </audio>
  <button on:click={queue.next} disabled={$queue.length < 2}>Next</button>
</div>

<style>
  .playbar {
    position: fixed;
    width: 100%;
    border-top: 1px solid grey;
    bottom: 0;
    left: 0;
  }
</style>
