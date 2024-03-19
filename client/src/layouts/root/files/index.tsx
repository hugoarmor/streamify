import { PlusIcon } from "../../../assets/plus-icon.svg";
import { SearchIcon } from "../../../assets/search-icon.svg";
import { FilesTable } from "./components/table";
import { FileQueries } from "../../../queries/files";
import { useQuery } from "react-query";
import { Popover } from "../../../components/popover";
import { FolderIcon } from "../../../assets/folder-icon.svg";
import { FileIcon } from "../../../assets/file-icon.svg";
import { AddFileModal } from "./components/add-file-modal";
import { useMemo, useState } from "react";
import { FilesUploadProgress } from "../../../components/files-upload-progress";
import { useFileUploader } from "../../../hooks/useFileUpload";

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
  const { appendFiles, filesUploads: filesBeingUploaded } = useFileUploader();

  const handleNewFileClick = () => setIsAddFileModalOpen(true);
  const handleCloseAddFileModal = () => setIsAddFileModalOpen(false);
  const handleNewFolderClick = () => {};
  const handleUploadFiles = (files: File[]) => {
    appendFiles(files);
    handleCloseAddFileModal();
  };

  const filesUploads = useMemo(() => {
    return filesBeingUploaded.map((file) => ({
      name: file.file.name,
      progress: file.progress,
    }));
  }, [filesBeingUploaded]);

  return (
    <>
      <section className="flex h-full w-full items-center justify-center px-20">
        <section className="flex h-full w-full flex-col py-10">
          <div className="mb-4 flex w-full items-center justify-between">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4" />
              <input
                type="text"
                placeholder="Type to search files..."
                className="placeholder-stf-purple-600 bg-stf-purple-800 border-stf-purple-600 h-8 w-96 rounded-md border pl-10 text-xs outline-none"
              />
            </div>
            <Popover
              anchorElement={
                <button className="bg-stf-purple-800 border-stf-purple-600 flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:opacity-50">
                  <PlusIcon /> New
                </button>
              }
            >
              <div className="bg-stf-purple-900 border-stf-purple-600 text-stf-white flex flex-col gap-2 border px-4 py-4 text-xs">
                <div
                  onClick={handleNewFileClick}
                  className="flex cursor-pointer items-center gap-2 hover:opacity-60"
                >
                  <div className="flex h-5 w-5 items-center justify-center">
                    <FileIcon />
                  </div>
                  New File
                </div>
                <div
                  onClick={handleNewFolderClick}
                  className="flex cursor-pointer items-center gap-2 hover:opacity-60"
                >
                  <div className="flex h-5 w-5 items-center justify-center">
                    <FolderIcon />
                  </div>
                  New Folder
                </div>
              </div>
            </Popover>
          </div>
          <div className="bg-stf-purple-800 border-stf-purple-600 h-full justify-center rounded-xl border px-14 pt-10">
            {isSuccess && <FilesTable files={files} />}
          </div>
        </section>
      </section>
      {filesUploads.length > 0 && <FilesUploadProgress files={filesUploads} />}
      {isAddFileModalOpen && (
        <AddFileModal
          open={isAddFileModalOpen}
          onClose={handleCloseAddFileModal}
          onAddFiles={handleUploadFiles}
        />
      )}
    </>
  );
}
