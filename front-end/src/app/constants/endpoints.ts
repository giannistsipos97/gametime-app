import { environment } from '../../environments/environment';

const BASE_URL = environment.apiUrl;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },
  LIBRARY: {
    LIBRARY: `${BASE_URL}/library`,
  },
};
