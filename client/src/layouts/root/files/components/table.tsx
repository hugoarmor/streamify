import { useState } from "react";
import { StreamifyFiles } from "..";
import { TableRow } from "./table-row";
import "./table.style.scss";
import { CloseIcon } from "../../../../assets/close-icon.svg";
import { DownloadIcon } from "../../../../assets/download-icon.svg";
import { DeleteIcon } from "../../../../assets/delete-icon.svg";

type Props = {
  files: StreamifyFiles;
};

export function FilesTable({ files }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<Set<String>>(new Set<string>());

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
            <p className="text-xs ml-3 mr-7 pointer-events-none">1 Selected</p>
            <div className="flex gap-2">
              <DownloadIcon className="cursor-pointer" />
              <DeleteIcon className="cursor-pointer" color="#ECECEC" />
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
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
