import { AxiosError, AxiosRequestConfig } from "axios";
import { Failure, Result, Success } from "./http.types";

export abstract class Contract {
  protected async try<T>(
    fn: () => Promise<{ data?: T; status: number }>
  ): Promise<Result<Success<T>, Failure>> {
    try {
      const apiResponse = await fn();

      const isAxios = Boolean(apiResponse.data);

      if (isAxios) {
        return { data: apiResponse.data as T, error: null };
      }

      return { data: apiResponse as unknown as T, error: null };
    } catch (e: unknown) {
      const error = e as AxiosError;

      return {
        error: {
          message: (error.response?.data as any)?.error || error.response,
          status: error.response?.status ?? 500,
        },
      };
    }
  }

  abstract get<T>(
    path: string,
    config?: AxiosRequestConfig<any> | undefined
  ): Result<Success<T>, Failure>;

  abstract post<T>(path: string, data: any): Result<Success<T>, Failure>;

  abstract put<T>(path: string, data: any): Result<Success<T>, Failure>;

  abstract delete<T>(path: string): Result<Success<T>, Failure>;
}
