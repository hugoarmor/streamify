import { Link } from "react-router-dom";
import { FolderIcon } from "../../../../assets/folder-icon.svg";

type Props = {
  path: string;
  eachLink: (path: string) => string;
};

export function FoldersBar(props: Props) {
  const folders = props.path?.split("/");
  const buildFolderPathLink = (folders: string[], index: number) => {
    const folderRelativePath = folders?.slice(0, index + 1).join("/");

    return props.eachLink(folderRelativePath);
  };

  return (
    <div className="w-full h-10 flex bg-stf-purple-700 mt-auto rounded-b-xl border-t border-stf-purple-600">
      <div className="flex items-center gap-2 px-6 text-xs">
        <Link reloadDocument to="/">
          <FolderIcon size={15} />
        </Link>
        {folders?.map((folder, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-stf-white pointer-events-none">{">"}</span>
            <Link
              reloadDocument
              to={buildFolderPathLink(folders, index)}
              className="text-stf-white"
            >
              {folder}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
