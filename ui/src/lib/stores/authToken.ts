import axios from "axios";
import { writable } from "svelte/store";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { AUTH_COOKIE_KEY } from "../constants";

/**
 * Authentication JWT store
 * @name authToken
 * @type {Writable<string | undefined>}
 */
const authToken = writable<string | undefined>(getCookie(AUTH_COOKIE_KEY));

/**
 * Subscribes to changes in authToken and updates the axios global Authorization header and browser cookie accordingly.
 */
const unsubscribeFromAuthToken = authToken.subscribe((value) => {
  if (value) {
    setCookie(AUTH_COOKIE_KEY, value, { expires: 0.125 });
    axios.defaults.headers.common["Authorization"] = `Bearer ${value}`;
  } else {
    removeCookie(AUTH_COOKIE_KEY);
    axios.defaults.headers.common["Authorization"] = "";
  }
});

export default authToken;
export { unsubscribeFromAuthToken };
