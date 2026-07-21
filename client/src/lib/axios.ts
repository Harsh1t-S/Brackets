import axios from "axios";

// Configurable per environment (local/staging/prod) via VITE_API_URL; falls
// back to the production API so existing deploys keep working unchanged.
const baseURL =
  import.meta.env.VITE_API_URL ??
  "https://brackets-production-26e2.up.railway.app/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Log the user out on an expired/invalid session instead of leaving the app
// in a broken half-authenticated state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthRequest =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthRequest && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
