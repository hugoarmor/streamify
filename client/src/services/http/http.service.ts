import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Contract } from "./contract";

export class Http extends Contract {
  private client: AxiosInstance = axios.create()

  constructor() {
    super()

    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    })
  }

  public async get<T>(path: string, config?: AxiosRequestConfig<any> | undefined) {
    return this.try<T>(() => this.client.get(path, config))
  }

  public async post<T>(path: string, data?: any) {
    return this.try<T>(() => this.client.post(path, data))
  }

  public async put<T>(path: string, data?: any) {
    return this.try<T>(() => this.client.put(path, data))
  }

  public async delete<T>(path: string) {
    return this.try<T>(() => this.client.delete(path))
  }
}
