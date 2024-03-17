import { useState } from "react";
import { StreamifyFiles } from "..";
import { TableRow } from "./table-row";
import "./table.style.scss";

type Props = {
  files: StreamifyFiles;
};

export function FilesTable({ files }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleRowFocus = (name: string) => {
    setSelectedFiles(prev => [...prev, name]);
  }

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="text-xs">
          <th className="w-1/2 p-0">
            <div className="cursor-pointer hover:opacity-70 font-light bg-stf-purple-700 border-stf-purple-600 border-y rounded-l-lg border-l pl-4 py-2 text-left">
              File Name
            </div>
          </th>
          <th className="w-1/4 p-0">
            <div className="cursor-pointer hover:opacity-70 font-light bg-stf-purple-700 border-stf-purple-600 border-y py-2">
              Last Modified
            </div>
          </th>
          <th className="w-1/8 p-0">
            <div className="cursor-pointer hover:opacity-70 font-light bg-stf-purple-700 border-stf-purple-600 border-y py-2">
              Size
            </div>
          </th>
          <th className="w-1/8 p-0">
            <div className="font-light bg-stf-purple-700 border-stf-purple-600 border-y border-r rounded-r-lg py-2 text-transparent">
              Actions
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(files).map(
          ([name, file]) => (
            <TableRow
              isFocused={selectedFiles.some(f => f === name)}
              key={name}
              name={name}
              file={file}
              onFocus={() => handleRowFocus(name)}
            />
          )
        )}
      </tbody>
    </table>
  );
}
