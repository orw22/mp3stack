<script lang="ts">
  import queue from "../stores/queue";
  import AudioControls from "./AudioControls.svelte";

  $: currentTrack = $queue.at(0);
</script>

<div class="playbar">
  <h4>Now playing: {currentTrack?.name}</h4>
  <AudioControls {currentTrack} />
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
