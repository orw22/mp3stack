<script lang="ts">
  import history from "../../stores/history";
  import queue from "../../stores/queue";
  import type { TrackWithUrl } from "../../types";

  let audioEl: HTMLAudioElement;
  let paused: boolean;
  let currentTime = 0;
  let progressTime = 0;
  let duration = 0;

  let prevTimeInputEvent: number;
  let prevUpdated: number;

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
    audioEl.play();
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
  bind:this={audioEl}
>
  Your browser does not support the audio element.
</audio>

<button on:click={queue.prev} disabled={$history.length === 0}>Previous</button>
<button on:click={onPlayPause} disabled={!currentTrack}>
  {paused ? "Play" : "Pause"}
</button>
<button on:click={queue.next} disabled={$queue.length < 2}>Next</button>
<input
  type="range"
  name="current-time"
  bind:value={progressTime}
  on:input={onTimeInput}
  on:change={onTimeChange}
  min={0}
  step={1}
  max={duration}
/>

<div>
  <input
    name="volume"
    type="range"
    min={0}
    max={1}
    step={0.01}
    on:input={(e) => {
      audioEl.volume = parseFloat(e.currentTarget.value);
    }}
  />
  <label for="volume">Volume</label>
</div>
