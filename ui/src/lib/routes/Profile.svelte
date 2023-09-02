<script lang="ts">
  import api from "../../api";
  import toasts from "../../toasts";
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

  function getProfile(refresh: boolean = false) {
    return api.get("/users/me", {
      headers: refresh ? { "Cache-Control": "no-cache" } : {},
    });
  }

  function refreshProfile() {
    profile = getProfile(true);
  }

  async function updateProfile(event: Event, isPasswordReset: boolean = false) {
    event.preventDefault();
    if (isPasswordReset && !validPassword) {
      return;
    }
    await api
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

  async function updateEditingValues() {
    try {
      const response = await profile;
      // set initial editing values
      newName = response.data.name;
      newEmail = response.data.email;
    } catch (error) {
      return;
    }
  }

  $: profile, updateEditingValues();
</script>

<Layout>
  {#await profile}
    <Loader />
  {:then { data }}
    <h4>Profile</h4>
    <p>Name: {data.name}<br />Email: {data.email}</p>
    {#if !(editing || resettingPassword)}
      <button
        on:click={() => {
          editing = true;
        }}
      >
        Edit
      </button>
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
        <input
          type="text"
          placeholder="Name"
          bind:value={newName}
          pattern="[a-zA-Z ]+"
          title="Name must be alphabetic"
        />
        <input
          type="text"
          placeholder="Email"
          bind:value={newEmail}
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          title="Must be a valid email address"
        />
        <button type="submit">Save</button>
        <button
          on:click={() => {
            editing = false;
          }}
        >
          Cancel
        </button>
      </form>
    {:else if resettingPassword}
      <form on:submit={(e) => updateProfile(e, true)}>
        <input
          type="password"
          placeholder="Password"
          bind:value={newPassword}
        />
        <input
          type="password"
          placeholder="Re-enter password"
          bind:value={newPasswordCheck}
        />
        <button type="submit" disabled={!validPassword}>Submit</button>
        <button
          on:click={() => {
            resettingPassword = false;
          }}
        >
          Cancel
        </button>
      </form>
    {/if}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}
</Layout>
