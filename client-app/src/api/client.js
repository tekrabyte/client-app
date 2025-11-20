import axios from 'axios';
import { useAuth } from '../store/auth';

// GANTI URL INI DENGAN DOMAIN WORDPRESS ANDA
const BASE_URL = "https://erpos.tekrabyte.id/wp-json/tekra-saas/v1";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Auto-inject Token Auth (Simulasi jika nanti pakai JWT)
api.interceptors.request.use((config) => {
    const { token } = useAuth.getState();
    if (token) {
        // config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

export default api;