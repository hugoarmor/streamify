import { StreamifyFiles } from "../layouts/root/files";
import { Http } from "../services/http/http.service";

export class FileQueries {
  static async getAll() {
    const http = new Http();

    const result = await http.get<StreamifyFiles>("api/files");

    if (result.error) throw result.error;

    return result.data;
  }

  static async destroy(path: string) {
    const http = new Http();

    const result = await http.delete<string>(`api/files/${path}`);

    if (result.error) throw result.error;

    return result.data;
  }

  static async destroyMany(paths: string[]) {
    const http = new Http();

    const result = await http.delete<string>("api/files", {
      file_paths: paths,
    });

    if (result.error) throw result.error;

    return result.data;
  }

  static async rename({
    oldPath,
    newPath,
  }: {
    oldPath: string;
    newPath: string;
  }) {
    const http = new Http();

    const result = await http.patch<string>(
      `api/files/${oldPath}/rename`,
      {
        new_file_path: newPath,
      },
    );

    if (result.error) throw result.error;

    return result.data;
  }

  static async zipFiles(filePaths: string[]) {
    const http = new Http();

    const result = await http.post<string>("api/files/zip", {
      file_paths: filePaths,
    });

    if (result.error) throw result.error;

    return result.data;
  }
}
