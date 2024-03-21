import { Http } from "../services/http/http.service";

export type Jam = {
  id: string;
	inserted_at: string,
	bytes_limit: number,
	expires_at: string,
	folder_relative_path: string,
	updated_at: string
}

export class JamQueries {
  static async show(jamId: string) {
    const http = new Http();

    const result = await http.get<Jam>(`api/jams/${jamId}`);

    if (result.error) throw result.error;

    return result.data;
  }
}
