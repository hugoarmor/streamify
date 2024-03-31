import { format, fromUnixTime } from "date-fns";
import { RenameFileModal } from "../rename-file-modal";
import { useMemo, useState } from "react";
import { StreamifyFile } from "../../layouts/root/files";
import { FolderIcon } from "../../assets/folder-icon.svg";
import { FileIcon } from "../../assets/file-icon.svg";
import { FileService } from "../../services/file";
import { MoreIcon } from "../../assets/more-icon.svg";
import { Popover } from "../popover";
import { DownloadIcon } from "../../assets/download-icon.svg";
import { RenameIcon } from "../../assets/rename-icon.svg";
import { DeleteIcon } from "../../assets/delete-icon.svg";
import { NewJamModal } from "../new-jam-modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useQueryParams } from "../../hooks/useQueryParams";
import { Link } from "react-router-dom";

export type FileRowActions = {
  onFileDelete?: (filePath: string) => any;
  onFileRename?: (filePath: string, newName: string) => any;
  onFileDownload?: (filePath: string) => any;
};

type Props = {
  name: string;
  isFocused?: boolean;
  onFocus?: () => void;
  file: StreamifyFile;
  actions?: FileRowActions;
};

export function TableRow(props: Props) {
  const params = useQueryParams();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isFolderJamModalOpen, setIsFolderJamModalOpen] = useState(false);

  const getFormattedDate = (posixTime: number) =>
    format(fromUnixTime(posixTime), "dd/MM/yyyy HH:mm");

  const handleClickRenameFile = () => setIsRenameModalOpen(true);
  const handleCloseRenameModal = () => setIsRenameModalOpen(false);
  const handleRenameFile = async (newPath: string) => {
    await props.actions?.onFileRename?.(props.file.relative_path, newPath);

    setIsRenameModalOpen(false);
  };

  const handleClickJamFolder = () => setIsFolderJamModalOpen(true);
  const handleCloseJamModal = () => setIsFolderJamModalOpen(false);

  const handleDeleteFile = () =>
    props.actions?.onFileDelete?.(props.file.relative_path);
  const handleFileDownload = () =>
    props.actions?.onFileDownload?.(props.file.relative_path);

  const isFolder = props.file.type === "directory";

  const folderUrl = useMemo(() => {
    const newPath = params.folder_relative_path
      ? `${params.folder_relative_path}/${props.name}`
      : props.name;
    return `/?folder_relative_path=${newPath}`;
  }, [params.folder_relative_path, props.name]);

  return (
    <>
      {isFolderJamModalOpen && (
        <NewJamModal
          open={isFolderJamModalOpen}
          onClose={handleCloseJamModal}
          folderRelativePath={props.file.relative_path}
        />
      )}
      {isRenameModalOpen && (
        <RenameFileModal
          open={isRenameModalOpen}
          onClose={handleCloseRenameModal}
          fileName={props.name}
          onSubmit={handleRenameFile}
        />
      )}
      <tr
        className={`border-t border-stf-purple-600 transition-all ${
          props.isFocused ? "bg-stf-purple-650" : ""
        }`}
      >
        <td
          onClick={props.onFocus}
          className="py-3 flex items-center gap-2 cursor-default"
        >
          <div className="w-10 flex items-center justify-center">
            {isFolder ? (
              <Link to={folderUrl} reloadDocument>
                <FolderIcon className="cursor-pointer" />
              </Link>
            ) : (
              <FileIcon />
            )}
          </div>
          {props.name}
        </td>
        <td
          onClick={props.onFocus}
          className="text-center font-thin cursor-default text-sm"
        >
          {getFormattedDate(props.file.last_modified)}
        </td>
        <td
          onClick={props.onFocus}
          className="text-center font-thin cursor-default text-sm"
        >
          {FileService.getFileSize(props.file.size)}
        </td>
        <td className="flex items-center justify-center">
          <Popover anchorElement={<MoreIcon className="cursor-pointer" />}>
            <div className="flex flex-col gap-2 px-4 py-4 bg-stf-purple-900 border border-stf-purple-600 text-stf-white text-xs">
              <div
                onClick={handleFileDownload}
                className="flex items-center gap-2 hover:opacity-60 cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <DownloadIcon />
                </div>
                Download
              </div>
              <div
                className="flex items-center gap-2 hover:opacity-60 cursor-pointer"
                onClick={handleClickRenameFile}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <RenameIcon />
                </div>
                Rename
              </div>
              {isFolder && (
                <div
                  className="flex items-center gap-2 hover:opacity-60 cursor-pointer"
                  onClick={handleClickJamFolder}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <CloudUploadIcon fontSize="small" />
                  </div>
                  Jam Folder
                </div>
              )}
              <div className="text-red-400 border-t border-stf-purple-600"></div>
              <div
                className="flex items-center gap-2 hover:opacity-60 cursor-pointer text-red-400"
                onClick={handleDeleteFile}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <DeleteIcon />
                </div>
                Delete
              </div>
            </div>
          </Popover>
        </td>
      </tr>
    </>
  );
}
