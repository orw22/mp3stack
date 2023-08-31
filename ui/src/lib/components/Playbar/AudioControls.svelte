<!--
  @component
  AudioControls
  
  - Features time, volume, play/pause and skip back/forward controls
  - Part of {Playbar.svelte}

  Props: 
    - {TrackWithUrl | undefined} currentTrack
-->

<script lang="ts">
  import history from "../../stores/history";
  import queue from "../../stores/queue";
  import type { TrackWithUrl } from "../../types";
  import { secondsToMMSS } from "../../utils/time";
  import Icon from "../Icon.svelte";
  import IconButton from "../IconButton.svelte";

  let audioEl: HTMLAudioElement;
  let paused: boolean;
  let currentTime = 0;
  let progressTime = 0;
  let duration = 0;
  let volume = 1;

  let prevTimeInputEvent: number;
  let prevUpdated: number;
  let wasPaused: [boolean, boolean] = [false, false]; // [value, has been set flag]

  export let currentTrack: TrackWithUrl | undefined;

  export function restart() {
    audioEl.currentTime = 0;
    audioEl.play();
  }

  function onPlayPause() {
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
  }

  function onTimeInput(event: Event) {
    if (!wasPaused[1]) {
      wasPaused[0] = paused;
      wasPaused[1] = true;
    }

    if (prevTimeInputEvent > event.timeStamp - 25) {
      // if seeking/dragging slider
      audioEl.pause();
    } else {
      audioEl.currentTime = parseFloat(
        (event.target as HTMLInputElement).value
      );
      prevUpdated = event.timeStamp;
    }
    prevTimeInputEvent = event.timeStamp;
  }

  function onTimeChange(event: Event) {
    if (prevUpdated < event.timeStamp - 100) {
      audioEl.currentTime = parseFloat(
        (event.target as HTMLInputElement).value
      );
    }
    if (!wasPaused[0]) audioEl.play();
    wasPaused[1] = false;
  }

  $: currentTime, (progressTime = currentTime);
</script>

<audio
  src={currentTrack?.url}
  autoplay
  on:ended={queue.next}
  bind:paused
  bind:duration
  bind:currentTime
  bind:volume
  bind:this={audioEl}
>
  Your browser does not support the audio element.
</audio>

<div id="controls-wrapper">
  <IconButton onClick={queue.prev} disabled={$history.length === 0}>
    <Icon name="back" />
  </IconButton>
  <IconButton onClick={onPlayPause} disabled={!currentTrack}>
    {#if paused}
      <Icon name="play" />
    {:else}
      <Icon name="pause" />
    {/if}
  </IconButton>
  <IconButton onClick={queue.next} disabled={$queue.length < 2}>
    <Icon name="forward" />
  </IconButton>
</div>

<div id="current-time-wrapper">
  <span>{secondsToMMSS(progressTime)}</span>
  <input
    id="current-time"
    type="range"
    bind:value={progressTime}
    on:input={onTimeInput}
    on:change={onTimeChange}
    min={0}
    step={1}
    max={duration}
  />
  <span>{secondsToMMSS(duration)}</span>
</div>

<div id="volume-wrapper">
  <input
    id="volume"
    type="range"
    min={0}
    max={1}
    step={0.01}
    bind:value={volume}
  />
  <label for="volume">
    {#if audioEl && audioEl.volume === 0}
      <Icon name="speakerMuted" />
    {:else}
      <Icon name="speaker" />
    {/if}
  </label>
</div>

<style>
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background-color: var(--color-primary);
    border-radius: 50%;
    border: none;
    margin-top: -3px;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    height: 6px;
    background-color: var(--color-light-grey);
  }

  input[type="range"]::-moz-range-progress {
    background-color: var(--color-primary);
  }

  input[type="range"]::-moz-range-track {
    background-color: var(--color-light-grey);
  }

  input[type="range"]::-ms-fill-lower {
    background-color: var(--color-primary);
  }

  input[type="range"]::-ms-fill-upper {
    background-color: var(--color-light-grey);
  }

  input[type="range"] {
    -webkit-appearance: none;
  }

  #current-time {
    width: min(500px, 80%);
  }

  #volume {
    width: 160px;
  }
</style>
