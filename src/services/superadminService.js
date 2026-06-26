import apiClient from './apiClient';

const superadminService = {
  getPerfil: async () => {
    const response = await apiClient.get('/perfil-superadmin');
    return response.data;
  },

  updatePerfil: async (data) => {
    const response = await apiClient.patch('/actualizar-superadmin/', data);
    return response.data;
  },

  updateAvatar: async (formData) => {
    // Requires multipart/form-data
    const response = await apiClient.patch('/perfil/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await apiClient.patch('/superadmin/actualizar-password/', data);
    return response.data;
  },

  getEstudiantes: async () => {
    const response = await apiClient.get('/estudiantes');
    return response.data;
  },

  getEstudianteById: async (id) => {
    const response = await apiClient.get(`/estudiantes/${id}`);
    return response.data;
  },

  updateEstudiante: async (id, data) => { //Endpoint a eliminar
    const response = await apiClient.patch(`/actualizar-estudiantes/${id}`, data);
    return response.data;
  },

  deleteEstudiante: async (id) => { //eliminar estudiante
    const response = await apiClient.delete(`/eliminar-estudiantes/${id}`);
    return response.data;
  },

  suspenderEstudiante: async (id) => { //eliminar
    const response = await apiClient.patch(`/estudiantes/${id}/suspender`, {});
    return response.data;
  },

  habilitarEstudiante: async (id) => { //eliminar
    const response = await apiClient.patch(`/estudiantes/${id}/habilitar`, {});
    return response.data;
  },

  getRedes: async () => {
    const response = await apiClient.get('/redes');
    return response.data;
  },

  getRedById: async (id) => {
    const response = await apiClient.get(`/red/${id}`);
    return response.data;
  },

  updateRed: async (id, data) => { //eliminar
    const response = await apiClient.patch(`/actualizar-red/${id}`, data);
    return response.data;
  },

  deleteRed: async (id) => {
    const response = await apiClient.delete(`/eliminar-red/${id}`);
    return response.data;
  },

  verificarRed: async (id, verificada) => { //eliminar
    const response = await apiClient.patch(`/red/${id}/verificada`, { verificada });
    return response.data;
  },

  getSolicitudesRedes: async () => {
    const response = await apiClient.get('/superadmin/redes/pendientes');
    return response.data;
  },

  getSolicitudesRehabilitacion: async () => { //pendiente eliminar
    const response = await apiClient.get('/redes/rehabilitar/solicitudes');
    return response.data;
  },

  resolverSolicitudRed: async (id, estado) => {
    const response = await apiClient.patch(`/redes/solicitudes/${id}/resolver`, { estado });
    return response.data;
  },

  resolverSolicitudRehabilitacion: async (id, estado) => {
    const response = await apiClient.patch(`/redes/rehabilitar/solicitudes/${id}/resolver`, { estado });
    return response.data;
  },

  getRedesPendientes: async () => {
    const response = await apiClient.get('/superadmin/redes/pendientes');
    return response.data;
  },


  getReportes: async (subtype) => {
    const response = await apiClient.get(`/reportes/ver/${subtype}`);
    return response.data;
  },

  getSolicitudes: async (subtype) => {
    const response = await apiClient.get(`/solicitudes/ver/${subtype}`);
    return response.data;
  },

  getSolicitudesRevocacionAdminRed: async (params = {}) => {
    const response = await apiClient.get('/solicitudes/ver/revocar_admin_red', { params });
    return response.data;
  },

  resolverSolicitudHabilitarUsuario: async (id, data) => {
    const response = await apiClient.patch(`/superadmin/solicitudes/habilitar-usuarios/${id}/resolver`, data);
    return response.data;
  },

  resolverReporteUsuario: async (id, data) => {
    const response = await apiClient.patch(`/reportes/usuarios/${id}/resolver`, data);
    return response.data;
  },

  resolverReporteApp: async (id, data) => {
    const response = await apiClient.patch(`/reportes/app/${id}/resolver`, data);
    return response.data;
  },

  resolverReporteRed: async (id, data) => {
    const response = await apiClient.patch(`/reportes/redes/${id}/resolver`, data);
    return response.data;
  },

  resolverReporteRedGlobalSuperAdmin: async (id, data) => {
    const response = await apiClient.patch(`/reportes/superadmin/red-global/${id}/resolver`, data);
    return response.data;
  },

  resolverSolicitudVerificacion: async (id, data) => {
    const response = await apiClient.patch(`/redes/solicitudes/${id}/resolver-verificacion`, data);
    return response.data;
  },

  resolverSolicitudOficializacion: async (id, data) => {
    const response = await apiClient.patch(`/redes/solicitudes/${id}/resolver-oficializacion`, data);
    return response.data;
  },

  resolverSolicitudRehabilitar: async (id, data) => {
    const response = await apiClient.patch(`/superadmin/solicitudes/rehabilitar/${id}/resolver`, data);
    return response.data;
  },

  resolverSolicitudRevocarAdminRed: async (id, data) => {
    const response = await apiClient.patch(`/red/${id}/resolver/revocar-rol`, data);
    return response.data;
  },

  deleteReporte: async (subtype, id) => {
    const response = await apiClient.delete(`/superadmin/reportes/${subtype}/${id}`);
    return response.data;
  },

  resolverAprobacionRed: async (id, accion) => {
    const response = await apiClient.patch(`/superadmin/redes/${id}/aprobacion`, { accion });
    return response.data;
  },

  getApelaciones: async () => {
    const response = await apiClient.get('/apelaciones');
    return response.data;
  },

  getApelacionById: async (id) => {
    const response = await apiClient.get(`/apelaciones/${id}`);
    return response.data;
  },

  resolverApelacion: async (id, data) => {
    const response = await apiClient.patch(`/apelaciones/${id}/resolver`, data);
    return response.data;
  }
};

export const getStrikesUsuario = (id) =>
  apiClient.get(`/estudiantes/${id}/strikes`)

export const eliminarStrikeUsuario = (userId, strikeId) =>
  apiClient.delete(`/estudiantes/${userId}/strikes/${strikeId}`)

export const getStrikesRed = (id) =>
  apiClient.get(`/redes/${id}/strikes`)

export const eliminarStrikeRed = (redId, strikeId) =>
  apiClient.delete(`/redes/${redId}/strikes/${strikeId}`)

export default superadminService;
