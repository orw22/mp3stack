import axios from "axios";
import { writable } from "svelte/store";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { COOKIE_KEY } from "../constants";

const token = writable<string | undefined>(getCookie(COOKIE_KEY));

const unsubscribeFromToken = token.subscribe((value) => {
  if (value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${value}`;
    setCookie(COOKIE_KEY, value, { expires: 0.125 });
  } else {
    removeCookie(COOKIE_KEY);
    axios.defaults.headers.common["Authorization"] = "";
  }
});

export default token;
export { unsubscribeFromToken };
