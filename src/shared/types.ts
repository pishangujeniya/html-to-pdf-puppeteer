export interface ApiResponse<T> {
  data?: T | undefined | null
  error?: string
  statusCode: number
}