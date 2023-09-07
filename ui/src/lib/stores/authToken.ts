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
 * Subscribes to changes in authToken and updates browser cookie
 */
const unsubscribeFromAuthToken = authToken.subscribe((value) => {
  if (value) {
    setCookie(AUTH_COOKIE_KEY, value, { expires: 0.125 });
  } else removeCookie(AUTH_COOKIE_KEY);
});

export default authToken;
export { unsubscribeFromAuthToken };
