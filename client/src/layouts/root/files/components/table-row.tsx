import { format, fromUnixTime } from "date-fns";
import { StreamifyFile } from "..";
import { useState } from "react";
import { FolderIcon } from "../../../../assets/folder-icon.svg";
import { FileIcon } from "../../../../assets/file-icon.svg";
import { MoreIcon } from "../../../../assets/more-icon.svg";
import { Popover } from "@mui/material";
import { DownloadIcon } from "../../../../assets/download-icon.svg";
import { Http } from "../../../../services/http/http.service";

export function TableRow(props: { name: string } & StreamifyFile) {
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);

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

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;

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
        <MoreIcon onClick={handleClick} className="cursor-pointer" />
        <Popover
          id={popoverId}
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
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
          </div>
        </Popover>
      </td>
    </tr>
  );
}
