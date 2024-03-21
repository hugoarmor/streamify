import { useEffect, useState } from "react";
import { FileRowActions, TableRow } from "./table-row";
import "./table.style.scss";
import { useMutation, useQuery } from "react-query";
import { StreamifyFiles } from "../../layouts/root/files";
import { FileQueries } from "../../queries/files";
import { FileService } from "../../services/file";
import { CloseIcon } from "../../assets/close-icon.svg";
import { DownloadIcon } from "../../assets/download-icon.svg";
import { DeleteIcon } from "../../assets/delete-icon.svg";

type Props = {
  files: StreamifyFiles;
  rowActions?: FileRowActions;
};

export function FilesTable({ files, rowActions }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<Set<String>>(
    new Set<string>()
  );
  const {
    mutate: zipFiles,
    data: zipId,
    reset,
  } = useMutation("zipFiles", FileQueries.zipFiles);
  const { refetch } = useQuery("files");

  const handleRowFocus = (name: string) => {
    const newSet = new Set(selectedFiles);

    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }

    setSelectedFiles(newSet);
  };

  const canShowActions = selectedFiles.size > 0;
  const onCancelShowActions = () => setSelectedFiles(new Set());

  const handleDownloadClick = async () => {
    const filePaths = [...selectedFiles.values()] as string[];

    if (filePaths.length === 0) return;
    if (filePaths.length > 1) return zipFiles(filePaths);

    const url = `http://localhost:4000/api/files/${filePaths[0]}`;

    return FileService.downloadFile(url);
  };

  const handleDeleteClick = async () => {
    const filePaths = [...selectedFiles.values()] as string[];

    await FileQueries.destroyMany(filePaths);

    setSelectedFiles(new Set());
    refetch();
  };

  useEffect(() => {
    if (!zipId) return;

    const url = `http://localhost:4000/api/files/zip/${zipId}`;

    FileService.downloadFile(url);
    reset();
  }, [zipId]);

  return (
    <>
      {canShowActions && (
        <div className="w-full relative bg-red-200">
          <div className="h-8 bg-stf-purple-700 absolute border-stf-purple-600 border rounded-2xl px-2 w-full flex items-center">
            <div
              onClick={onCancelShowActions}
              className="flex items-center justify-center hover:bg-purple-900 cursor-pointer h-5 w-5 rounded-full"
            >
              <CloseIcon />
            </div>
            <p className="text-xs ml-3 mr-7 pointer-events-none">{selectedFiles.size} Selected</p>
            <div className="flex gap-2">
              <DownloadIcon
                onClick={handleDownloadClick}
                className="cursor-pointer"
              />
              <DeleteIcon
                onClick={handleDeleteClick}
                className="cursor-pointer"
                color="#ECECEC"
              />
            </div>
          </div>
        </div>
      )}
      <table className="w-full table-fixed">
        <thead>
          <tr className={`text-xs ${canShowActions ? "invisible" : ""}`}>
            <th className="w-1/2 p-0">
              <div className="flex items-center h-8 cursor-pointer hover:opacity-70 font-light bg-stf-purple-700 border-stf-purple-600 border-y rounded-l-lg border-l pl-4 py-2 text-left">
                File Name
              </div>
            </th>
            <th className="w-1/4 p-0">
              <div className="flex justify-center items-center h-8 cursor-pointer hover:opacity-70 font-light bg-stf-purple-700 border-stf-purple-600 border-y py-2">
                Last Modified
              </div>
            </th>
            <th className="w-1/8 p-0">
              <div className="flex justify-center items-center h-8 cursor-pointer hover:opacity-70 font-light bg-stf-purple-700 border-stf-purple-600 border-y py-2">
                Size
              </div>
            </th>
            <th className="w-1/8 p-0">
              <div className="flex justify-center items-center h-8 font-light bg-stf-purple-700 border-stf-purple-600 border-y border-r rounded-r-lg py-2 text-transparent">
                Actions
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(files).map(([name, file]) => (
            <TableRow
              isFocused={selectedFiles.has(name)}
              key={name}
              name={name}
              file={file}
              onFocus={() => handleRowFocus(name)}
              actions={rowActions}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
