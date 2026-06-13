import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token inválido o no proporcionado (o caducado)
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');
        // Usamos window.location para forzar la recarga y limpiar estado
        window.location.href = '/login';
      } else if (status === 403) {
        // Sin permisos
        toast.error(data?.msg || 'Sin permisos para realizar esta acción');
      } else if (status === 500) {
        toast.error('Error interno del servidor');
      }
    } else {
      toast.error('Error de red o no se pudo contactar al servidor');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
