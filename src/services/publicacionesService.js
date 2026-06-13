import apiClient from './apiClient';

const publicacionesService = {
  getPublicacionesByRed: async (redId) => {
    const response = await apiClient.get(`/publicaciones/red/${redId}`);
    return response.data;
  },

  getArticulosByRed: async (redId) => {
    const response = await apiClient.get(`/publicaciones/articulos/listar/${redId}`);
    return response.data;
  },

  getArticulosAdmin: async () => {
    const response = await apiClient.get('/publicaciones/articulos/listar/admin');
    return response.data;
  },

  eliminarArticuloAdmin: async (id) => {
    const response = await apiClient.delete(`/publicaciones/admin/articulo/eliminar/${id}`);
    return response.data;
  },

  eliminarPublicacionAdmin: async (id) => {
    const response = await apiClient.delete(`/publicaciones/admin/eliminar/${id}`);
    return response.data;
  }
};

export default publicacionesService;
