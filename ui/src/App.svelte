<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { onDestroy, onMount } from "svelte";
  import { Route, Router, navigate } from "svelte-navigator";
  import Footer from "./lib/components/Footer.svelte";
  import Header from "./lib/components/Header.svelte";
  import Playbar from "./lib/components/Playbar/Playbar.svelte";
  import Queue from "./lib/components/Queue.svelte";
  import Home from "./lib/routes/Home.svelte";
  import Login from "./lib/routes/Login/Login.svelte";
  import Playlist from "./lib/routes/Playlist/Playlist.svelte";
  import Profile from "./lib/routes/Profile/Profile.svelte";
  import Search from "./lib/routes/Search.svelte";
  import User from "./lib/routes/User.svelte";
  import authToken, { unsubscribeFromAuthToken } from "./lib/stores/authToken";
  import { esUnsubscribeFromAuthToken } from "./lib/stores/eventSource";
  import queue from "./lib/stores/queue";

  let queueOpen = false;

  onDestroy(() => {
    unsubscribeFromAuthToken();
    queue.unsubscribefromHistory();
    esUnsubscribeFromAuthToken();
  });

  onMount(() => {
    // on start or refresh, navigate to home page
    navigate("/");
  });

  export let url = "/";
</script>

<SvelteToast options={{ duration: 2500, intro: { x: 300 } }} />
<Router {url}>
  <Header loggedIn={$authToken ? $authToken.length > 0 : false} />
  <main>
    <Route component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/profile" component={Profile} />
    <Route path="/search" component={Search} />
    <Route path="/playlist/:id" let:params><Playlist id={params.id} /></Route>
    <Route path="/user/:id" let:params><User id={params.id} /></Route>
  </main>
</Router>
{#if $authToken}
  <Playbar onQueueClick={() => (queueOpen = !queueOpen)} />
  <Queue
    open={queueOpen}
    onClose={() => {
      queueOpen = false;
    }}
  />
{/if}
<Footer />
