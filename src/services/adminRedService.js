import apiClient from './apiClient';

const adminRedService = {
  getPerfil: async () => {
    const response = await apiClient.get('/perfil/admin-red');
    return response.data;
  },

  updatePerfil: async (data) => {
    const response = await apiClient.patch('/perfil/admin-red/actualizar', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await apiClient.patch('/perfil/admin-red/actualizar/password', data);
    return response.data;
  },

  getInfoRed: async () => {
    const response = await apiClient.get('/red/admin/informacion');
    return response.data;
  },

  updateRed: async (data, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await apiClient.patch('/admin/actualizar/red', data, config);
    return response.data;
  },

  getEstudiantes: async () => {
    const response = await apiClient.get('/admin/estudiantes/listar');
    return response.data;
  },

  eliminarEstudiante: async (estudianteId) => {
    const response = await apiClient.delete(`/admin/estudiantes/eliminar/${estudianteId}`);
    return response.data;
  },

  getReportes: async () => {
    const response = await apiClient.get('/admin/red/reportes');
    return response.data;
  },

  resolverReporte: async (id, data) => {
    const response = await apiClient.patch(`/admin/reportes/${id}/resolver`, data);
    return response.data;
  },

  solicitarVerificacion: async (data) => {
    const response = await apiClient.post('/redes/solicitar-verificacion', data);
    return response.data;
  },

  solicitarRehabilitacion: async (data) => {
    const response = await apiClient.post('/solicitudes/rehabilitar', data);
    return response.data;
  },

  solicitarRevocacionAdmin: async (data) => {
    const response = await apiClient.post('/redes/solicitar/revocar-admin', data);
    return response.data;
  },

  getReportesGenerales: async () => {
    const response = await apiClient.get('/reportes');
    return response.data;
  },

  getSolicitudesVerificacion: async () => {
    const response = await apiClient.get('/solicitudes/verificacion');
    return response.data;
  },

  getSolicitudesoficializacion: async () => {
    const response = await apiClient.get('/solicitudes/oficializacion');
    return response.data;
  },

  resolverReporteGeneral: async (id, data) => {
    const response = await apiClient.patch(`/reportes/${id}/resolver`, data);
    return response.data;
  },

  deleteReporte: async (id) => {
    const response = await apiClient.delete(`/reportes/${id}`);
    return response.data;
  },

  deleteSolicitud: async (endpoint) => {
    const response = await apiClient.delete(endpoint);
    return response.data;
  }
};

export default adminRedService;
