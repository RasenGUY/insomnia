export interface BaseApiResponse<T> {
  success: boolean
  timestamp: string
  message?: string
  data?: T,
}