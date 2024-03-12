import { format, fromUnixTime } from "date-fns";
import { StreamifyFile } from "..";
import { FolderIcon } from "../../../../assets/folder-icon.svg";
import { FileIcon } from "../../../../assets/file-icon.svg";
import { MoreIcon } from "../../../../assets/more-icon.svg";
import { DownloadIcon } from "../../../../assets/download-icon.svg";
import { DeleteIcon } from "../../../../assets/delete-icon.svg";
import { useMutation, useQuery } from "react-query";
import { FileQueries } from "../../../../queries/files";
import { RenameIcon } from "../../../../assets/rename-icon.svg";
import { Popover } from "../../../../components/popover";

export function TableRow(props: { name: string } & StreamifyFile) {
  const { mutateAsync: destroyFile } = useMutation("deleteFile", FileQueries.destroy);
  const { mutateAsync: renameFile } = useMutation("renameFile", FileQueries.rename);
  const { refetch: refetchFiles } = useQuery("files")

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

  const handleDeleteFile = async () => {
    await destroyFile(props.relative_path);

    refetchFiles()
  }

  const handleRenameFile = async () => {
    const newPath = prompt("New file name");

    if (!newPath) return;

    await renameFile({ oldPath: props.relative_path, newPath });

    refetchFiles()
  }

  return (
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
      <td className="text-center font-thin pointer-events-none">
        {getFileSize(props.size)}
      </td>
      <td className="flex items-center justify-center">
        <Popover
          anchorElement={<MoreIcon className="cursor-pointer" />}
        >
          <div className="flex flex-col gap-2 px-4 py-4 bg-stf-purple-900 border border-stf-purple-600 text-stf-white text-xs">
            <a
              href={`http://localhost:4000/api/files/${props.relative_path}`}
              className="flex items-center gap-2 hover:opacity-60 rounded cursor-pointer"
              download
            >
              <DownloadIcon />
              Download
            </a>
            <div
              className="flex items-center gap-2 hover:opacity-60 rounded cursor-pointer"
              onClick={handleDeleteFile}
            >
              <DeleteIcon />
              Delete
            </div>
            <div
              className="flex items-center gap-2 hover:opacity-60 rounded cursor-pointer"
              onClick={handleRenameFile}
            >
              <RenameIcon />
              Rename
            </div>
          </div>
        </Popover>
      </td>
    </tr>
  );
}
