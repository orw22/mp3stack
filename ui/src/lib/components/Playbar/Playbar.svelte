<!--
  @component
  Playbar
  
  - Renders name of track currently playing and audio controls component

  Props: 
    - {() => void} onQueueClick
-->

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
  <h6>Now playing: {currentTrack ? currentTrack.name : ""}</h6>
  <AudioControls {currentTrack} bind:restart />
  <IconButton onClick={onQueueClick}><Icon name="queue" /></IconButton>
</div>

<style>
  .playbar {
    position: fixed;
    width: 100%;
    background-color: var(--color-white);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    bottom: 0;
    left: 0;
    z-index: 10;
  }

  h6 {
    margin: 1.5em 0;
  }
</style>
