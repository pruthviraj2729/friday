import axios from "axios";

const http = axios.create({
  baseURL: "/api/v1/auth",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

http.interceptors.request.use((request) => {
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

function getData(response) {
  return response.data.data;
}

export const authApi = {
  async register(values) {
    return getData(await http.post("/register", values));
  },
  async login(values) {
    return getData(await http.post("/login", values));
  },
  async refresh() {
    return getData(await http.post("/refresh"));
  },
  async logout() {
    return getData(await http.post("/logout"));
  },
  async me() {
    return getData(await http.get("/me"));
  }
};

let refreshPromise;
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = authApi.refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function getApiError(error) {
  return {
    message: error.response?.data?.message || "Something went wrong. Please try again.",
    fields: Object.fromEntries((error.response?.data?.errors || []).map(({ field, message }) => [field, message]))
  };
}
