<script lang="ts">
  import axios, { type AxiosResponse } from "axios";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import LoginForm from "../components/LoginForm.svelte";
  import authToken from "../stores/authToken";

  onMount(() => {
    if ($authToken) {
      navigate("/");
    }
  });

  function processTokenResponse(response: AxiosResponse) {
    authToken.set(response.data.token);
    navigate("/");
  }

  async function onLogin(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    await axios
      .post("/users/login", {
        email: (form.elements.email as HTMLInputElement).value,
        password: (form.elements.password as HTMLInputElement).value,
      })
      .then((response) => processTokenResponse(response));
  }

  async function onRegister(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    await axios
      .post("/users", {
        name: (form.elements.name as HTMLInputElement).value,
        email: (form.elements.email as HTMLInputElement).value,
        password: (form.elements.password as HTMLInputElement).value,
      })
      .then((response) => processTokenResponse(response));
  }
</script>

<div id="wrapper">
  <div class="side">
    <h2>Log in</h2>
    <LoginForm onSubmit={onLogin} />
  </div>

  <div class="side">
    <h2>Register</h2>
    <LoginForm onSubmit={onRegister} register />
  </div>
</div>

<style>
  #wrapper {
    display: flex;
    flex-direction: row;
    width: min(1280px, 80vw);
  }

  .side {
    width: 50%;
  }
</style>
