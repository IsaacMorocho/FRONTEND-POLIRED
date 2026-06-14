import apiClient from './apiClient'

const crearApelacion = async (data) => {
  const response = await apiClient.post('/apelaciones', data)
  return response.data
}

export { crearApelacion }
