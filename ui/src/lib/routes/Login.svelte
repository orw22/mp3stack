<script lang="ts">
  import axios, { type AxiosResponse } from "axios";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import blobUrls from "../stores/blobUrls";
  import history from "../stores/history";
  import queue from "../stores/queue";
  import token from "../stores/token";

  let name: string;
  let lEmail: string;
  let lPassword: string;
  let rEmail: string;
  let rPassword: string;

  onMount(() => {
    if ($token) {
      navigate("/");
    } else {
      queue.reset();
      history.reset();
      blobUrls.reset();
    }
  });

  function processTokenResponse(response: AxiosResponse) {
    token.set(response.data.token);
    navigate("/");
  }

  async function onLogin(event: any) {
    event.preventDefault();

    await axios
      .post("/users/login", { email: lEmail, password: lPassword })
      .then((response) => processTokenResponse(response));
  }

  async function onRegister(event: any) {
    event.preventDefault();

    await axios
      .post("/users", { name, email: rEmail, password: rPassword })
      .then((response) => processTokenResponse(response));
  }
</script>

<h2>Log in</h2>
<form on:submit={onLogin}>
  <input type="text" placeholder="Email" bind:value={lEmail} />
  <input type="password" placeholder="Password" bind:value={lPassword} />
  <button type="submit">Log in</button>
</form>

<h2>Register</h2>
<form on:submit={onRegister}>
  <input type="text" placeholder="Email" bind:value={rEmail} />
  <input type="text" placeholder="Full name" bind:value={name} />
  <input type="password" placeholder="Password" bind:value={rPassword} />
  <button type="submit">Register</button>
</form>
