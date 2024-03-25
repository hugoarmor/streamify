import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Contract } from "./contract";

export class Http extends Contract {
  private client: AxiosInstance = axios.create()

  constructor() {
    super()

    this.client = axios.create({
      baseURL: "http://localhost:4000",
      withCredentials: true
    })
  }

  public async get<T>(path: string, config?: AxiosRequestConfig<any> | undefined) {
    return this.try<T>(() => this.client.get(path, config))
  }

  public async post<T>(path: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.try<T>(() => this.client.post(path, data, config))
  }

  public async put<T>(path: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.try<T>(() => this.client.put(path, data, config))
  }

  public async patch<T>(path: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.try<T>(() => this.client.patch(path, data, config))
  }

  public async delete<T>(path: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return this.try<T>(() => this.client.delete(path, { data, ...config}))
  }
}
