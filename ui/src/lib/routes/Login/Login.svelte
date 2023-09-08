<script lang="ts">
  import { type AxiosResponse } from "axios";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import api from "../../../api";
  import authToken from "../../stores/authToken";
  import LoginForm from "./LoginForm.svelte";

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
    const form = event.target as HTMLFormElement;

    await api
      .post("/users/login", {
        email: (form.elements.email as HTMLInputElement).value,
        password: (form.elements.password as HTMLInputElement).value,
      })
      .then((response) => processTokenResponse(response));
  }

  async function onRegister(event: Event) {
    const form = event.target as HTMLFormElement;

    await api
      .post("/users", {
        name: (form.elements.name as HTMLInputElement).value,
        email: (form.elements.email as HTMLInputElement).value,
        password: (form.elements.password as HTMLInputElement).value,
      })
      .then((response) => processTokenResponse(response));
  }
</script>

<div id="login-wrapper">
  <div>
    <h2>Log in</h2>
    <LoginForm onSubmit={onLogin} />
  </div>

  <div>
    <h2>Register</h2>
    <LoginForm onSubmit={onRegister} register />
  </div>
</div>

<style>
  #login-wrapper {
    display: flex;
    flex-direction: row;
    width: min(1280px, 80vw);
  }
  #login-wrapper div {
    flex-grow: 1;
  }
</style>
