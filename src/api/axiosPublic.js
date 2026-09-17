import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://etutionbdserver.vercel.app/api';

export const axiosPublic = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
