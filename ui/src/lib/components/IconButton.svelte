<script lang="ts">
  export let onClick: () => void;
  export let disabled: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";
  export let textLeft: string = "";
  export let textRight: string = "";
</script>

<button class="icon-button" on:click={onClick} {disabled} {type}>
  {textLeft}<slot />{textRight}
</button>
