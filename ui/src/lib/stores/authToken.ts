import { writable } from "svelte/store";
import { AUTH_COOKIE_KEY } from "../constants";

/**
 * Authentication JWT store
 * @type {Writable<string | undefined>}
 */
const authToken = writable<string | undefined>(
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(AUTH_COOKIE_KEY))
    ?.split("=")[1]
);

/**
 * Subscribes to changes in authToken and updates browser cookie
 */
const unsubscribeFromAuthToken = authToken.subscribe((value) => {
  if (value) {
    document.cookie = `${AUTH_COOKIE_KEY}=${value}; path=/; max-age=10800`;
  } else {
    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
  }
});

export default authToken;
export { unsubscribeFromAuthToken };
