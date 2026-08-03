import axios from 'axios';

const defaultApiUrl = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl,
  timeout: 15000,
});
