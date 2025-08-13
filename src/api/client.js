import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

// Helper for uploading files using multipart/form-data
export const uploadFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export default apiClient;
