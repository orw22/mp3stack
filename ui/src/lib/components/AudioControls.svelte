<script lang="ts">
  import history from "../stores/history";
  import queue from "../stores/queue";
  import type { TrackWithUrl } from "../types";

  export let currentTrack: TrackWithUrl | undefined;
</script>

<button on:click={queue.prev} disabled={$history.length === 0}>Previous</button>
<audio controls src={currentTrack?.url} autoplay on:ended={queue.next}>
  <!-- TODO: Hide controls, use custom elements -->
  Your browser does not support the audio element.
</audio>
<button on:click={queue.next} disabled={$queue.length < 2}>Next</button>
