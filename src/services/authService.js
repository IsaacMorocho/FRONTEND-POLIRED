import apiClient from './apiClient';

const authService = {
  loginSuperAdmin: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  loginAdminRed: async (credentials) => {
    const payload = { ...credentials, context: 'admin_panel' };
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  recuperarPasswordSuperAdmin: async (email) => {
    const response = await apiClient.post('/recuperar-password', { email });
    return response.data;
  },

  recuperarPasswordEstudiante: async (email) => {
    const response = await apiClient.post('/recuperar-password-e', { email });
    return response.data;
  },

  verifyResetToken: async (token) => {
    const response = await apiClient.get(`/recuperar-password/${token}`);
    return response.data;
  },

  resetPassword: async (token, passwords) => {
    const response = await apiClient.post(`/nuevo-password/${token}`, passwords);
    return response.data;
  }
    confirmarCuenta: async (token) => {
    const response = await apiClient.get(`/confirmar/${token}`);
    return response.data;
  }
};

export default authService;
