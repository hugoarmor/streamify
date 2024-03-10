import { format, fromUnixTime } from "date-fns";
import { StreamifyFile, StreamifyFiles } from "..";
import { FileIcon } from "../../../../assets/file-icon.svg";
import { FolderIcon } from "../../../../assets/folder-icon.svg";
import { MoreIcon } from "../../../../assets/more-icon.svg";

type Props = {
  files: StreamifyFiles;
};

export function FilesTable({ files }: Props) {
  const getFileSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    while (size >= 1000 && unitIndex < units.length - 1) {
      size /= 1000;
      unitIndex++;
    }

    const fixedSize = size % 1 === 0 ? size : size.toFixed(2);

    return `${fixedSize} ${units[unitIndex]}`;
  };

  const getFormattedDate = (posixTime: number) =>
    format(fromUnixTime(posixTime), "dd/MM/yyyy HH:mm");

  const TableRow = (props: { name: string } & StreamifyFile) => (
    <tr className="border-t border-stf-purple-600">
      <td className="py-3 flex items-center gap-2 pointer-events-none">
        <div className="w-10 flex items-center justify-center">
          {props.type === "directory" ? <FolderIcon /> : <FileIcon />}
        </div>
        {props.name}
      </td>
      <td className="text-center font-thin pointer-events-none">
        {getFormattedDate(props.last_modified)}
      </td>
      <td className="text-center font-thin pointer-events-none">{getFileSize(props.size)}</td>
      <td className="flex items-center justify-center">
        <MoreIcon className="cursor-pointer" />
      </td>
    </tr>
  );

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="">
          <th className="w-1/2 pb-5 text-left">File Name</th>
          <th className="w-1/4 pb-5">Last Modified</th>
          <th className="w-1/8 pb-5">Size</th>
          <th className="w-1/8 pb-5"></th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(files).map(([name, { type, size, last_modified }]) => (
          <TableRow
            key={name}
            name={name}
            type={type}
            size={size}
            last_modified={last_modified}
          />
        ))}
      </tbody>
    </table>
  );
}
