import { Http } from "../services/http/http.service";

type User = {
  id: string;
  username: string;
  email: string;
  inserted_at: string;
  updated_at: string;
};

export class AuthQueries {
  static async me() {
    const http = new Http();

    const result = await http.get<User>("auth/me");

    if (result.error) throw result.error;

    return result.data;
  }

  static signInJamGuest = async ({ jamId, password }: {jamId: string; password: string}) => {
    const http = new Http();

    const result = await http.post<{message: string, token: string}>(`auth/jams/sign_in`, {
      password,
      jam_id: jamId,
    });

    if (result.error) throw new Error(result.error.message);

    return result.data;
  }
}
