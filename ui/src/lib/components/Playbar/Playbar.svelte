<script lang="ts">
  import queue from "../../stores/queue";
  import Icon from "../Icon.svelte";
  import IconButton from "../IconButton.svelte";
  import AudioControls from "./AudioControls.svelte";

  $: currentTrack = $queue.at(0);
  let restart: () => void = () => null;

  queue.setRestartCallback(() => restart());

  export let onQueueClick: () => void;
</script>

<div class="playbar">
  <h4>Now playing: {currentTrack ? currentTrack.name : ""}</h4>
  <AudioControls {currentTrack} bind:restart />
  <IconButton onClick={onQueueClick}><Icon name="queue" /></IconButton>
</div>

<style>
  .playbar {
    position: fixed;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid grey;
    bottom: 0;
    left: 0;
    z-index: 10;
  }
</style>
