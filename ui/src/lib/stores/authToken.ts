import axios from "axios";
import { writable } from "svelte/store";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { AUTH_COOKIE_KEY } from "../constants";

const authToken = writable<string | undefined>(getCookie(AUTH_COOKIE_KEY));

const unsubscribeFromToken = authToken.subscribe((value) => {
  if (value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${value}`;
    setCookie(AUTH_COOKIE_KEY, value, { expires: 0.125 });
  } else {
    removeCookie(AUTH_COOKIE_KEY);
    axios.defaults.headers.common["Authorization"] = "";
  }
});

export default authToken;
export { unsubscribeFromToken };
