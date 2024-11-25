import { FileIcon } from "../../assets/file-icon.svg";
import { FolderIcon } from "../../assets/folder-icon.svg";
import { PlusIcon } from "../../assets/plus-icon.svg";
import { SearchIcon } from "../../assets/search-icon.svg";
import { Popover } from "../popover";

type Props = {
  onNewFileClick: () => void;
  onNewFolderClick?: () => void;
}

export function ActionsHeader(props: Props) {
  return (
    <div className="mb-4 flex w-full items-center justify-between">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-4" />
        <input
        disabled
          type="text"
          placeholder="Type to search files..."
          className="cursor-not-allowed placeholder-stf-purple-600 bg-stf-purple-800 border-stf-purple-600 h-8 w-96 rounded-md border pl-10 text-xs outline-none"
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
            onClick={props.onNewFileClick}
            className="flex cursor-pointer items-center gap-2 hover:opacity-60"
          >
            <div className="flex h-5 w-5 items-center justify-center">
              <FileIcon />
            </div>
            New File
          </div>
          {props.onNewFolderClick && <div
            className="flex cursor-pointer items-center gap-2 hover:opacity-60"
            onClick={props.onNewFolderClick}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              <FolderIcon />
            </div>
            New Folder
          </div>}
        </div>
      </Popover>
    </div>
  );
}
