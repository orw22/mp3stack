<script lang="ts">
  import axios from "axios";
  import { navigate } from "svelte-routing";
  import toasts from "../../toasts";
  import Icon from "../components/Icon.svelte";
  import IconButton from "../components/IconButton.svelte";
  import Layout from "../components/Layout.svelte";
  import Loader from "../components/Loader.svelte";

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

  function getProfile() {
    return axios.get("/users/me");
  }

  function refreshProfile() {
    profile = getProfile();
  }

  async function updateProfile(event: Event, isPasswordReset: boolean = false) {
    event.preventDefault();
    if (!(isPasswordReset ? validPassword : validNameEmail)) {
      return;
    }
    await axios
      .put(
        "/users/me",
        isPasswordReset
          ? { password: newPassword }
          : { name: newName, email: newEmail }
      )
      .then(() => {
        editing = false;
        resettingPassword = false;
        toasts.success(
          isPasswordReset ? "Password changed" : "Profile updated"
        );
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
    <Loader />
  {:then { data }}
    <h3>Profile</h3>
    <h4>Name: {data.name}</h4>
    <h4>Email: {data.email}</h4>
    {#if !(editing || resettingPassword)}
      <IconButton
        onClick={() => {
          editing = true;
        }}
      >
        Edit <Icon size={16} name="pencil" />
      </IconButton>
      <button
        on:click={() => {
          resettingPassword = true;
        }}
      >
        Reset password
      </button>
    {/if}

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
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}

  <button on:click={() => navigate("/")}>Back</button>
</Layout>
