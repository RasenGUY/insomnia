export interface ApiSuccessResponseBase<T, M = undefined> {
  status: string
  timestamp: string
  message: string
  data: T,
  meta?: M
}