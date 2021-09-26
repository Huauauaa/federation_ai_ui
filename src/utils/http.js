import axios from 'axios';

export const baseURL = '/api';

const instance = axios.create({
  baseURL,
  timeout: 60e3,
});

instance.interceptors.request.use((config) => {
  if (
    ['post', 'patch'].includes(config.method) &&
    config.url !== '/auth/login/'
  ) {
    const body = config.data || {};
    const data = new FormData();
    Object.keys(body).forEach((key) => data.append(key, body[key]));
    config.data = data;
  }
  return config;
});

instance.interceptors.response.use(
  (result) => {
    return result.data;
  },
  (error) => {
    const { response } = error;
    return Promise.reject(response.data);
  },
);

export default instance;
