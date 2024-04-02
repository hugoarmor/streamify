import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Contract } from "./contract";
import { parseCookies } from "nookies"
import { Config } from "../../config";

export class Http extends Contract {
  private client: AxiosInstance = axios.create()

  constructor() {
    super()

    const bearerToken = parseCookies().bearerToken

    this.client = axios.create({
      baseURL: Config.apiUrl,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
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
