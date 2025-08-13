import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  withCredentials: false,
});

export const setToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

apiClient.setToken = setToken;

export const API_ENDPOINTS = {
  health: "/health",
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    register: "/auth/register",
    forgot: "/auth/forgot-password",
    reset: "/auth/reset-password",
  },
  investors: {
    base: "/investors",
    register: "/investors/register",
    verifyPhone: "/investors/verify-phone",
    forgotPassword: "/investors/forgot-password",
    resetPassword: "/investors/reset-password",
    sendEmailConfirmation: "/investors/send-email-confirmation",
    verifyEmail: "/investors/verify-email",
    resendEmailConfirmation: "/investors/resend-email-confirmation",
    me: "/investors/me",
    byId: (id) => `/investors/${id}`,
    leads: (id) => `/investors/${id}/leads`,
    offers: (id) => `/investors/${id}/offers`,
    verify: (id) => `/investors/${id}/verify`,
  },
  sellers: {
    base: "/sellers",
    register: "/sellers/register",
    verifyPhone: "/sellers/verify-phone",
    verifyCode: "/sellers/verify-code",
    byId: (id) => `/sellers/${id}`,
    verify: (id) => `/sellers/${id}/verify`,
  },
  properties: {
    base: "/properties",
    byId: (id) => `/properties/${id}`,
    uploadPhotos: (id) => `/properties/${id}/photos`,
    offers: (id) => `/properties/${id}/offers`,
  },
  offers: {
    base: "/offers",
    byId: (id) => `/offers/${id}`,
    accept: (id) => `/offers/${id}/accept`,
    counter: (id) => `/offers/${id}/counter`,
    withdraw: (id) => `/offers/${id}/withdraw`,
  },
};

export default apiClient;
