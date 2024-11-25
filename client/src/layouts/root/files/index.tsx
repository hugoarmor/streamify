import { FileQueries } from "../../../queries/files";
import { useMutation, useQuery } from "react-query";
import { useMemo, useState } from "react";
import { FilesUploadProgress } from "../../../components/files-upload-progress";
import { useFileUploader } from "../../../hooks/useFileUpload";
import { FilesTable } from "../../../components/files-table/table";
import { AddFileModal } from "../../../components/add-file-modal";
import { FileService } from "../../../services/file";
import { ActionsHeader } from "../../../components/files-table/actions-header";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { FoldersBar } from "./components/folders-bar";
import { Config } from "../../../config";
import { AddFolderModal } from "../../../components/add-folder";

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
  const params = useQueryParams();

  const {
    data: files,
    isSuccess,
    isError,
    refetch,
  } = useQuery("files", () => FileQueries.getAll(params.folder_relative_path));
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const { appendFiles, filesUploads: filesBeingUploaded } = useFileUploader({
    folder_relative_path: params.folder_relative_path,
    onFileUpload: () => refetch(),
  });
  const { mutateAsync: destroyFile } = useMutation(
    "deleteFile",
    FileQueries.destroy
  );
  const { mutateAsync: renameFile } = useMutation(
    "renameFile",
    FileQueries.rename
  );
  const { mutateAsync: createFolder } = useMutation(
    "createFolder",
    FileQueries.createFolder
  );

  const handleNewFileClick = () => setIsAddFileModalOpen(true);
  const handleCloseAddFileModal = () => setIsAddFileModalOpen(false);
  const handleUploadFiles = (files: File[]) => {
    appendFiles(files);
    handleCloseAddFileModal();
  };

  const handleNewFolderClick = () => setIsAddFolderModalOpen(true);
  const handleCloseAddFolderModal = () => setIsAddFolderModalOpen(false);
  const handleCreateFolder = async (folderName: string) => {
    await createFolder(params.folder_relative_path ? `${params.folder_relative_path}/${folderName}` : folderName);
    refetch();
    handleCloseAddFolderModal();
  };

  const filesUploads = useMemo(() => {
    return filesBeingUploaded.map((file) => ({
      name: file.file.name,
      progress: file.progress,
    }));
  }, [filesBeingUploaded]);

  const handleRowFileDelete = async (file_path: string) => {
    await destroyFile(file_path);
    refetch();
  };
  const handleRowFileRename = async (name: string, newName: string) => {
    await renameFile({
      oldPath: name,
      newPath: params.folder_relative_path
        ? `${params.folder_relative_path}/${newName}`
        : newName,
    });
    refetch();
  };
  const handleRowFileDownload = (filePath: string) => {
    FileService.downloadFile(
      `${Config.apiUrl}/api/files/${encodeURIComponent(filePath)}`
    );
  };

  const filesCount = Object.keys(files ?? {}).length;

  const handleEachLink = (path: string) => `/?folder_relative_path=${path}`;

  return (
    <>
      <section className="flex h-full w-full items-center justify-center px-20">
        <section className="flex h-full w-full flex-col py-10">
          <ActionsHeader onNewFileClick={handleNewFileClick} onNewFolderClick={handleNewFolderClick} />
          <div className="flex flex-col bg-stf-purple-800 border-stf-purple-600 h-full rounded-xl border">
            <div className="px-14 pt-10">
              {isSuccess && (
                <FilesTable
                  files={files}
                  folderRelativePath={params.folder_relative_path}
                  rowActions={{
                    onFileDelete: handleRowFileDelete,
                    onFileRename: handleRowFileRename,
                    onFileDownload: handleRowFileDownload,
                  }}
                />
              )}
              {isError && <div>There was an error fetching the files</div>}
              {filesCount === 0 && <div>No files found</div>}
            </div>
            <FoldersBar
              path={params.folder_relative_path}
              eachLink={handleEachLink}
            />
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

      {isAddFolderModalOpen && (
        <AddFolderModal
          open={isAddFolderModalOpen}
          onClose={handleCloseAddFolderModal}
          onSubmit={handleCreateFolder}
        />
      )}
    </>
  );
}
