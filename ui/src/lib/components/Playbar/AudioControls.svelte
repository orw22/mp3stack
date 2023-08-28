<script lang="ts">
  import history from "../../stores/history";
  import queue from "../../stores/queue";
  import type { TrackWithUrl } from "../../types";

  let audioElement: HTMLAudioElement;

  export let currentTrack: TrackWithUrl | undefined;

  export function restart() {
    audioElement.currentTime = 0;
    audioElement.play();
  }
</script>

<button on:click={queue.prev} disabled={$history.length === 0}>Previous</button>
<audio
  controls
  src={currentTrack?.url}
  autoplay
  on:ended={queue.next}
  bind:this={audioElement}
>
  <!-- TODO: Hide controls, use custom elements -->
  Your browser does not support the audio element.
</audio>
<button on:click={queue.next} disabled={$queue.length < 2}>Next</button>
