import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333'
})

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('@admin-supermercado:auth')
  
  if (storedAuth) {
    const { token } = JSON.parse(storedAuth)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})