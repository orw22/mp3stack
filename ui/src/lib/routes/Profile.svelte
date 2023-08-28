<script lang="ts">
  import axios from "axios";
  import { Wave } from "svelte-loading-spinners";
  import { navigate } from "svelte-routing";
  import Layout from "../components/Layout.svelte";

  let profile = getProfile();

  let editing = false;
  let resettingPassword = false;
  let newName: string;
  let newEmail: string;
  let newPassword: string;
  let newPasswordCheck: string;

  $: validPassword =
    newPassword?.length > 0 && newPassword === newPasswordCheck;
  $: validNameEmail = newName?.length > 0 && newEmail?.length > 0;

  function refreshProfile() {
    profile = getProfile();
  }

  function getProfile() {
    return axios.get("/users/me");
  }

  async function updateProfile(event: any, password: boolean = false) {
    event.preventDefault();
    if (!(password ? validPassword : validNameEmail)) {
      return;
    }
    await axios
      .put(
        "/users/me",
        password
          ? { password: newPassword }
          : { name: newName, email: newEmail }
      )
      .then(() => {
        editing = false;
        resettingPassword = false;
        refreshProfile();
      });
  }

  (async () => {
    try {
      const response = await profile;
      // set initial editing values
      newName = response.data.name;
      newEmail = response.data.email;
    } catch (error) {
      return;
    }
  })();
</script>

<Layout>
  {#await profile}
    <Wave size="60" color="#FF3E00" unit="px" duration="1s" />
  {:then { data }}
    <h3>Profile</h3>
    <h4>Name: {data.name}</h4>
    <h4>Email: {data.email}</h4>
    <button
      on:click={() => {
        editing = true;
        resettingPassword = false;
      }}
    >
      Edit
    </button>
    <button
      on:click={() => {
        resettingPassword = true;
        editing = false;
      }}
    >
      Reset password
    </button>

    {#if editing}
      <form on:submit={(e) => updateProfile(e)}>
        <input type="text" placeholder="Name" bind:value={newName} />
        <input type="text" placeholder="Email" bind:value={newEmail} />
        <button type="submit" disabled={!validNameEmail}>Save</button>
      </form>
      <button
        on:click={() => {
          editing = false;
        }}
      >
        Cancel
      </button>
    {:else if resettingPassword}
      <form on:submit={(e) => updateProfile(e, true)}>
        <input
          type="password"
          placeholder="Password"
          bind:value={newPassword}
        />
        <input
          type="password"
          placeholder="Reenter password"
          bind:value={newPasswordCheck}
        />
        <button type="submit" disabled={!validPassword}>Submit</button>
      </form>
      <button
        on:click={() => {
          resettingPassword = false;
        }}
      >
        Cancel
      </button>
    {/if}
  {/await}

  <button on:click={() => navigate("/")}>Back</button>
</Layout>
