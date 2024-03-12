import { PlusIcon } from "../../../assets/plus-icon.svg";
import { SearchIcon } from "../../../assets/search-icon.svg";
import { FilesTable } from "./components/table";
import { FileQueries } from "../../../queries/files";
import { useQuery } from "react-query";

export type StreamifyFile = {
  size: number;
  type: string;
  last_modified: number;
  relative_path: string;
};

export type StreamifyFiles = {
  [key: string]: StreamifyFile;
};

export function FilesLayout() {
  const { data: files, isSuccess } = useQuery("files", FileQueries.getAll);

  return (
    <section className="w-full h-full px-20 flex items-center justify-center">
      <section className="flex py-10 w-full h-full flex-col">
        <div className="w-full mb-4 flex items-center justify-between">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4" />
            <input
              type="text"
              placeholder="Type to search files..."
              className="w-96 pl-10 placeholder-stf-purple-600 text-xs h-8 bg-stf-purple-800 border border-stf-purple-600 rounded-md outline-none"
            />
          </div>
          <button className="flex items-center hover:opacity-50 gap-1 border bg-stf-purple-800 border-stf-purple-600 rounded-md text-xs px-3 py-1">
            <PlusIcon /> New
          </button>
        </div>
        <div className="h-full pt-10 px-14 justify-center bg-stf-purple-800 border border-stf-purple-600 rounded-xl">
          {isSuccess && <FilesTable files={files} />}
        </div>
      </section>
    </section>
  );
}
