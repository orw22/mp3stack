<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import axios from "axios";
  import { onDestroy } from "svelte";
  import { Route, Router } from "svelte-routing";
  import Footer from "./lib/components/Footer.svelte";
  import Header from "./lib/components/Header.svelte";
  import Playbar from "./lib/components/Playbar.svelte";
  import { API_URL } from "./lib/constants";
  import Home from "./lib/routes/Home.svelte";
  import Login from "./lib/routes/Login.svelte";
  import Playlist from "./lib/routes/Playlist.svelte";
  import Profile from "./lib/routes/Profile.svelte";
  import queue from "./lib/stores/queue";
  import token, { unsubscribeFromToken } from "./lib/stores/token";
  import toasts from "./toasts";

  // set axios base url
  axios.defaults.baseURL = API_URL;

  // API response/error handling
  axios.interceptors.response.use(
    (response) => {
      if (response.data.message) {
        toasts.success(response.data.message);
      }
      return response;
    },
    (err) => {
      toasts.error(err.response.data.message);
      throw err;
    }
  );

  onDestroy(() => {
    unsubscribeFromToken();
    queue.unsubscribefromHistory();
  });

  export let url = "/";
</script>

<SvelteToast options={{ duration: 2500, intro: { x: 300 } }} />
<Router {url}>
  <Header loggedIn={$token ? $token.length > 0 : false} />
  <main>
    <Route component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/profile" component={Profile} />
    <Route path="/playlist/:id" let:params><Playlist id={params.id} /></Route>
  </main>
</Router>
{#if $token}
  <Playbar />
{/if}
<Footer />
