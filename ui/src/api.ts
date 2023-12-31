import axios, { type AxiosRequestConfig } from "axios";
import { API_URL } from "./lib/constants";
import authToken from "./lib/stores/authToken";
import toasts from "./toasts";

const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

// set authorization header
authToken.subscribe((token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : null;
});

// response/error handling
api.interceptors.response.use(
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

// custom method for GET requests without use of cache
api.noCacheGet = (url: string, config?: AxiosRequestConfig) => {
  return api.get(url, {
    ...config,
    headers: {
      ...config?.headers,
      "Cache-Control": "no-cache",
    },
  });
};

export default api;
