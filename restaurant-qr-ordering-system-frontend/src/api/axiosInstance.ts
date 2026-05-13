import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types'
import { localStorageService } from '../services/localStorageService'

const baseURL = '/api'

export const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorageService.getAccessToken()
  const sessionToken = sessionStorage.getItem('sessionToken')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (sessionToken) {
    // For customers, we might pass session token in header or use it differently, 
    // but the backend currently expects it in the request body for some calls.
    // However, some GET calls might need it.
    config.headers['X-Session-Token'] = sessionToken
  }
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse<unknown>>) => {
    const status = err.response?.status
    const message = err.response?.data?.message || err.message

    if (status === 502 || err.code === 'ERR_NETWORK') {
      console.error('Backend server is not accessible. Make sure Spring Boot is running on port 8080.')
    }
    
    if (status === 401) {
      localStorageService.clearAuth()
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/t/')) {
        window.location.assign('/login')
      }
    }
    
    // Create a cleaner error object
    const error = new Error(message) as any
    error.status = status
    error.data = err.response?.data
    
    return Promise.reject(error)
  },
)

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise
  if (!data.success) {
    throw new Error(data.message || 'Request failed')
  }
  return data.data
}

export default axiosInstance
