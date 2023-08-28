<script lang="ts">
  import axios from "axios";
  import { Wave } from "svelte-loading-spinners";
  import { navigate } from "svelte-routing";
  import Layout from "../components/Layout.svelte";

  let profile = getProfile();

  function refreshProfile() {
    profile = getProfile();
  }

  function getProfile() {
    return axios.get("/users/me");
  }

  //   TODO: Update user and reset password functions
</script>

<Layout>
  {#await profile}
    <Wave size="60" color="#FF3E00" unit="px" duration="1s" />
  {:then { data }}
    <h3>Profile</h3>
    <h4>Name: {data.name}</h4>
    <h4>Email: {data.email}</h4>
    <button>Reset password</button>
    <button>Save changes</button>
  {/await}

  <button on:click={() => navigate("/")}>Back</button>
</Layout>
