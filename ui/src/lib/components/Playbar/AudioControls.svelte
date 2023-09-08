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

  const TIME_INPUT_WINDOW = 50;
  const TIME_UPDATE_WINDOW = 100;

  let paused: boolean;
  let currentTime = 0;
  let progressTime = 0;
  let duration = 0;
  let volume = 1;
  let muted = false;
  let trackPlayed = false;

  let prevTimeInputEvent: number;
  let prevUpdated: number;
  let wasPaused: [boolean, boolean] = [false, false]; // [value, has been set flag]

  export let currentTrack: TrackWithUrl | undefined;

  function setPaused(value: boolean) {
    paused = value;
  }

  function setMuted(value: boolean) {
    muted = value;
  }

  export function restart() {
    currentTime = 0;
    setPaused(false);
  }

  function onTimeInput(event: Event) {
    if (!wasPaused[1]) {
      wasPaused[0] = paused;
      wasPaused[1] = true;
    }

    if (event.timeStamp < prevTimeInputEvent + TIME_INPUT_WINDOW) {
      // if seeking/dragging slider
      setPaused(true);
    } else {
      currentTime = parseFloat((event.target as HTMLInputElement).value);
      prevUpdated = event.timeStamp;
    }
    prevTimeInputEvent = event.timeStamp;
  }

  function onTimeChange(event: Event) {
    if (prevUpdated < event.timeStamp - TIME_UPDATE_WINDOW) {
      currentTime = parseFloat((event.target as HTMLInputElement).value);
    }
    if (!wasPaused[0]) setPaused(false);
    wasPaused[1] = false;
  }

  $: currentTime, (progressTime = currentTime);

  $: currentTimePercentage = (progressTime / duration) * 100;
  $: volumePercentage = volume * 100;

  $: if (currentTrack) trackPlayed = true;
</script>

<audio
  src={currentTrack?.url}
  autoplay
  on:ended={queue.next}
  bind:paused
  bind:duration
  bind:muted
  bind:currentTime
  bind:volume
>
  Your browser does not support the audio element.
</audio>

<div id="controls-wrapper">
  <IconButton onClick={queue.prev} disabled={$history.length === 0}>
    <Icon name="back" />
  </IconButton>
  <IconButton onClick={() => setPaused(!paused)} disabled={!currentTrack}>
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
    step={0.1}
    max={duration}
    style:background={trackPlayed
      ? `linear-gradient(to right, #00b0b9 0%, #00b0b9 ${currentTimePercentage}%, #f5f5f5 ${currentTimePercentage}%, #f5f5f5 100%)`
      : "#f5f5f5"}
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
    style:background="linear-gradient(to right, #00b0b9 0%, #00b0b9 {volumePercentage}%,
    #f5f5f5 {volumePercentage}%, #f5f5f5 100%)"
  />
  <label for="volume">
    <IconButton blank onClick={() => setMuted(!muted)}>
      {#if volume === 0 || muted}
        <Icon name="speakerMuted" class="volume-icon" />
      {:else}
        <Icon name="speaker" class="volume-icon" />
      {/if}
    </IconButton>
  </label>
</div>

<div />

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  #current-time {
    width: min(480px, 80%);
  }
  #current-time::-webkit-slider-thumb {
    visibility: hidden;
  }
  #volume {
    width: 160px;
  }

  :global(.volume-icon) {
    margin-bottom: -5px;
    margin-left: 0.25em;
  }
  :global(#controls-wrapper button) {
    margin: 0 0.3em;
  }
  #current-time-wrapper span {
    margin: 0 0.5em;
  }
</style>
