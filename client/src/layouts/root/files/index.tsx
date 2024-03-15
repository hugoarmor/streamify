import { PlusIcon } from "../../../assets/plus-icon.svg";
import { SearchIcon } from "../../../assets/search-icon.svg";
import { FilesTable } from "./components/table";
import { FileQueries } from "../../../queries/files";
import { useQuery } from "react-query";
import { Popover } from "../../../components/popover";
import { FolderIcon } from "../../../assets/folder-icon.svg";
import { FileIcon } from "../../../assets/file-icon.svg";
import { AddFileModal } from "./components/add-file-modal";
import { useState } from "react";
import { FilesUploadProgress } from "../../../components/files-upload-progress";

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
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  const handleNewFileClick = () => setIsAddFileModalOpen(true);
  const handleCloseAddFileModal = () => setIsAddFileModalOpen(false);
  const handleNewFolderClick = () => {};

  const filesUpload = [
    {
      name: "file_name",
      progress: 60,
    },
    {
      name: "file_name",
      progress: 50,
    },
  ]

  return (
    <>
      <FilesUploadProgress files={filesUpload} />
      <AddFileModal
        open={isAddFileModalOpen}
        onClose={handleCloseAddFileModal}
      />
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
            <Popover
              anchorElement={
                <button className="flex items-center hover:opacity-50 gap-1 border bg-stf-purple-800 border-stf-purple-600 rounded-md text-xs px-3 py-1">
                  <PlusIcon /> New
                </button>
              }
            >
              <div className="flex flex-col gap-2 px-4 py-4 bg-stf-purple-900 border border-stf-purple-600 text-stf-white text-xs">
                <div
                  onClick={handleNewFileClick}
                  className="flex items-center gap-2 hover:opacity-60 cursor-pointer"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FileIcon />
                  </div>
                  New File
                </div>
                <div
                  onClick={handleNewFolderClick}
                  className="flex items-center gap-2 hover:opacity-60 cursor-pointer"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FolderIcon />
                  </div>
                  New Folder
                </div>
              </div>
            </Popover>
          </div>
          <div className="h-full pt-10 px-14 justify-center bg-stf-purple-800 border border-stf-purple-600 rounded-xl">
            {isSuccess && <FilesTable files={files} />}
          </div>
        </section>
      </section>
    </>
  );
}
