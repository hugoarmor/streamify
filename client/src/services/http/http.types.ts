export type Success<T> = {
  data: T
  error: null
}

export type Failure = {
  error: { message: string; status: number }
}

export type Result <S, F> = Promise<S | F>