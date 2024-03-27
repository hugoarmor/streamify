import { FileQueries } from "../../../queries/files";
import { useMutation, useQuery } from "react-query";
import { useMemo, useState } from "react";
import { FilesUploadProgress } from "../../../components/files-upload-progress";
import { useFileUploader } from "../../../hooks/useFileUpload";
import { FilesTable } from "../../../components/files-table/table";
import { AddFileModal } from "../../../components/add-file-modal";
import { FileService } from "../../../services/file";
import { ActionsHeader } from "../../../components/files-table/actions-header";

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
  const {
    data: files,
    isSuccess,
    isError,
    refetch,
  } = useQuery("files", () => FileQueries.getAll());
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const { appendFiles, filesUploads: filesBeingUploaded } = useFileUploader({
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

  const handleNewFileClick = () => setIsAddFileModalOpen(true);
  const handleCloseAddFileModal = () => setIsAddFileModalOpen(false);
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

  const handleRowFileDelete = async (file_path: string) => {
    await destroyFile(file_path);
    refetch();
  };
  const handleRowFileRename = async (name: string, newName: string) => {
    await renameFile({ oldPath: name, newPath: newName });
    refetch();
  };
  const handleRowFileDownload = (filePath: string) => {
    FileService.downloadFile(
      `http://localhost:4000/api/files/${encodeURIComponent(filePath)}`
    );
  };

  return (
    <>
      <section className="flex h-full w-full items-center justify-center px-20">
        <section className="flex h-full w-full flex-col py-10">
          <ActionsHeader onNewFileClick={handleNewFileClick} />
          <div className="bg-stf-purple-800 border-stf-purple-600 h-full justify-center rounded-xl border px-14 pt-10">
            {isSuccess && (
              <FilesTable
                files={files}
                rowActions={{
                  onFileDelete: handleRowFileDelete,
                  onFileRename: handleRowFileRename,
                  onFileDownload: handleRowFileDownload,
                }}
              />
            )}
            {isError && <div>There was an error fetching the files</div>}
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
