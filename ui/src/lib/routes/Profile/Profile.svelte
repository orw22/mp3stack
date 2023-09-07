<script lang="ts">
  import { onDestroy } from "svelte";
  import api from "../../../api";
  import toasts from "../../../toasts";
  import ActionBar from "../../components/ActionBar.svelte";
  import Layout from "../../components/Layout.svelte";
  import Loader from "../../components/Loader.svelte";
  import authToken from "../../stores/authToken";
  import eventSource from "../../stores/eventSource";
  import ResetPasswordForm from "./ResetPasswordForm.svelte";
  import UpdateProfileForm from "./UpdateProfileForm.svelte";

  let profile: Promise<any> = getProfile();

  let editing = false;
  let resettingPassword = false;

  let updated = false;

  let newName: string;
  let newEmail: string;
  let newPassword: string;
  let newPasswordCheck: string;

  function setUpdated(value: boolean) {
    updated = value;
  }

  function setEditing(value: boolean) {
    editing = value;
  }

  function setResettingPassword(value: boolean) {
    resettingPassword = value;
  }

  $: validPassword =
    newPassword?.length > 0 && newPassword === newPasswordCheck;

  function getProfile() {
    return api.get("/users/me", { params: { et: $authToken?.slice(-6) } });
    // cache busting (ensures that user profile responses are cached separately and thus
    // prevents users from seeing another user's details on their profile page)
    // using a query param results in unique URLs and unique cache entries for each
    // auth token (=> each user)
    // use case: 2 users logging in on the same device within 1 day of each other
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

  function onUserUpdate(event: MessageEvent) {
    profile = Promise.resolve({ data: JSON.parse(event.data) });
    setUpdated(true);
  }

  eventSource?.addEventListener("userUpdate", onUserUpdate);
  onDestroy(() => {
    if (updated) api.noCacheGet("/users/me"); // update HTTP cache in background
    eventSource?.removeEventListener("userUpdate", onUserUpdate);
  });
</script>

<Layout>
  {#await profile}
    <Loader />
  {:then { data }}
    <h4>Profile</h4>
    <p>Name: {data.name}<br />Email: {data.email}</p>

    <ActionBar>
      <button on:click={() => setEditing(true)}>Edit</button>
      <button on:click={() => setResettingPassword(true)}>
        Reset password
      </button>
    </ActionBar>

    {#if editing}
      <UpdateProfileForm
        onSubmit={(e) => updateProfile(e)}
        bind:nameValue={newName}
        bind:emailValue={newEmail}
        onCancel={() => setEditing(false)}
      />
    {:else if resettingPassword}
      <ResetPasswordForm
        onSubmit={(e) => updateProfile(e, true)}
        bind:value={newPassword}
        bind:checkValue={newPasswordCheck}
        onCancel={() => setResettingPassword(false)}
        submitButtonDisabled={!validPassword}
      />
    {/if}
  {:catch error}
    <p>{error.response.data.message}</p>
  {/await}
</Layout>
