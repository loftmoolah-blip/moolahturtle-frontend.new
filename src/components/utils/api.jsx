import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  withCredentials: false,
});

export const API_ENDPOINTS = {
  health: "/health",
  investors: "/investors",
  sellers: "/sellers",
  leads: "/leads",
  properties: "/properties",
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    register: "/auth/register",
    forgot: "/auth/forgot-password",
    reset: "/auth/reset-password",
  },
};

export default apiClient;
