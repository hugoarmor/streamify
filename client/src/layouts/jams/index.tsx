import { useMutation, useQuery } from "react-query";
import { useMemo, useState } from "react";
import { useFileUploader } from "../../hooks/useFileUpload";
import { FileQueries } from "../../queries/files";
import { PlusIcon } from "../../assets/plus-icon.svg";
import { FileIcon } from "../../assets/file-icon.svg";
import { FolderIcon } from "../../assets/folder-icon.svg";
import { Popover } from "../../components/popover";
import { FilesTable } from "../../components/files-table/table";
import { FilesUploadProgress } from "../../components/files-upload-progress";
import { AddFileModal } from "../../components/add-file-modal";
import { SearchIcon } from "../../assets/search-icon.svg";
import { StreamifyLogo } from "../../assets/streamify-logo.svg";
import { JamQueries } from "../../queries/jam";
import { useParams } from "react-router-dom";
import { FileService } from "../../services/file";
import { getMinutes } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { PasscodeScreen } from "./components/passcode-screen";

export type StreamifyFile = {
  size: number;
  type: string;
  last_modified: number;
  relative_path: string;
};

export type StreamifyFiles = {
  [key: string]: StreamifyFile;
};

export function JamsIndexLayout() {
  const { jamId } = useParams();

  const { isAuthenticated, signInJamGuest } = useAuth();

  const { mutateAsync: destroyFile } = useMutation(
    "deleteFile",
    FileQueries.destroy
  );
  const { mutateAsync: renameFile } = useMutation(
    "renameFile",
    FileQueries.rename
  );

  const { data: jam, isError } = useQuery(
    "jam",
    () => JamQueries.show(jamId!),
    {
      enabled: !!jamId && isAuthenticated,
    }
  );
  const { data: files, refetch } = useQuery(
    "files",
    () => FileQueries.getAll(jam?.folder_relative_path),
    {
      enabled: !!jam?.folder_relative_path,
    }
  );

  const { appendFiles, filesUploads: filesBeingUploaded } = useFileUploader({
    folder_relative_path: jam?.folder_relative_path,
    onFileUpload: () => refetch(),
  });

  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  const uploadLimitBytes = 1 * 1024 * 1024 * 1024;
  const currentUploadSize = 0.3 * 1024 * 1024 * 1024;
  const uploadProgress = Math.min(
    (currentUploadSize / uploadLimitBytes) * 100,
    100
  );

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

  const hasFiles = Object.keys(files ?? {}).length > 0;

  const handleRowFileDelete = async (file_path: string) => {
    await destroyFile(file_path);
    refetch();
  };
  const handleRowFileRename = async (name: string, newName: string) => {
    await renameFile({
      oldPath: name,
      newPath: `${jam?.folder_relative_path}/${newName}`,
    });
    refetch();
  };
  const handleRowFileDownload = (filePath: string) => {
    FileService.downloadFile(
      `http://localhost:4000/api/files/${encodeURIComponent(filePath)}`
    );
  };

  const expirationTime = useMemo(() => {
    if (!jam?.expires_at) return null;

    const expiration = new Date(jam.expires_at);
    const now = new Date();

    const minutesDifference = getMinutes(expiration) - getMinutes(now);
    const hoursDifference = expiration.getHours() - now.getHours();
    const daysDifference = expiration.getDate() - now.getDate();

    if (daysDifference > 0) return `${daysDifference} days`;
    if (hoursDifference > 0) return `${hoursDifference} hours`;
    if (minutesDifference > 0) return `${minutesDifference} minutes`;
  }, [jam?.expires_at]);

  const isExpired = useMemo(() => {
    if (!jam?.expires_at) return false;

    const expiration = new Date(jam.expires_at);
    const now = new Date();

    return now > expiration;
  }, []);

  if (isExpired || isError)
    return (
      <main className="bg-gradient-purple flex flex-col w-full h-svh px-20 pt-10">
        <header className="h-16 pb-10 font-light">
          <h1 className="text-stf-white text-xl">Not found</h1>
        </header>
      </main>
    );

  if (!isAuthenticated)
    return <PasscodeScreen onSubmit={data => signInJamGuest({
      jamId: jamId!,
      password: data.passcode
    })} />

  return (
    <main className="bg-gradient-purple flex flex-col w-full h-svh px-20 pt-10">
      <header className="h-16 pb-10 font-light">
        <h1 className="text-stf-white text-lg" style={{ lineHeight: "20px" }}>
          This is a <strong className="font-bold">Streamify Jam</strong>
        </h1>
        <h1 className="text-stf-white text-xl">
          You have <strong className="font-bold">{expirationTime}</strong> to
          share your files here...
        </h1>
      </header>
      <section className="flex h-full w-full flex-col">
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
        <div className="flex flex-col bg-stf-purple-800 border-stf-purple-600 h-full rounded-xl border">
          <div className="px-14 pt-10">
            {hasFiles ? (
              <FilesTable
                files={files!}
                rowActions={{
                  onFileDelete: handleRowFileDelete,
                  onFileRename: handleRowFileRename,
                  onFileDownload: handleRowFileDownload,
                }}
              />
            ) : (
              <p>No files to display</p>
            )}
          </div>
          <div className="hidden mt-auto w-full h-2 bg-stf-purple-600 rounded-b-xl">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-full flex bg-green-400 rounded-bl-xl"
            ></div>
          </div>
        </div>
      </section>

      <div className="flex w-full items-center justify-center my-6">
        <StreamifyLogo />
      </div>

      {filesUploads.length > 0 && <FilesUploadProgress files={filesUploads} />}
      {isAddFileModalOpen && (
        <AddFileModal
          open={isAddFileModalOpen}
          onClose={handleCloseAddFileModal}
          onAddFiles={handleUploadFiles}
        />
      )}
    </main>
  );
}
