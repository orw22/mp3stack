<!--
  @component
  Loader
  
  - Features sound wave loader and div wrapper
  - Covers full page, loader is centered

-->

<script lang="ts">
  import { Wave } from "svelte-loading-spinners";
</script>

<div class="loader">
  <Wave size={28} color="#00c2d2" unit="px" duration="0.8s" />
</div>

<style>
  .loader {
    display: flex;
    background: white;
    place-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
