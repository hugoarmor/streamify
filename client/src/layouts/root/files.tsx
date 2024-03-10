import { FileIcon } from "../../assets/file-icon.svg";
import { FolderIcon } from "../../assets/folder-icon.svg";
import { MoreIcon } from "../../assets/more-icon.svg";
import { PlusIcon } from "../../assets/plus-icon.svg";
import { SearchIcon } from "../../assets/search-icon.svg";

export function FilesLayout() {
  return (
    <section className="w-full h-full px-20 flex items-center justify-center">
      <section className="flex py-10 w-full h-full flex-col">
        <div className="w-full mb-4 flex items-center justify-between">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4" />
            <input
              type="text"
              placeholder="Type to search files..."
              className="w-96 pl-10 placeholder-stf-purple-600 text-xs h-8 bg-stf-purple-800 border border-stf-purple-600 rounded-md outline-none"
            />
          </div>
          <button className="flex items-center hover:opacity-50 gap-1 border bg-stf-purple-800 border-stf-purple-600 rounded-md text-xs px-3 py-1">
            <PlusIcon /> New
          </button>
        </div>
        <div className="h-full pt-10 px-14 justify-center bg-stf-purple-800 border border-stf-purple-600 rounded-xl">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th className="w-1/2 pb-5 text-left">File Name</th>
                <th className="w-1/4 pb-5">Last Modified</th>
                <th className="w-1/8 pb-5">Size</th>
                <th className="w-1/8 pb-5"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-stf-purple-600">
                <td className="py-3 flex items-center gap-2">
                  <div className="w-10 flex items-center justify-center">
                    <FileIcon />
                  </div>
                  BigNameOfABigFile.xlsx
                </td>
                <td className="text-center font-thin">10/10/2021 09:30 am</td>
                <td className="text-center font-thin">10 MB</td>
                <td className="flex items-center justify-center">
                  <MoreIcon />
                </td>
              </tr>
              <tr className="border-t border-stf-purple-600">
                <td className="py-3 flex items-center gap-2">
                  <div className="w-10 flex items-center justify-center">
                    <FolderIcon />
                  </div>
                  BigNameOfABigFolder
                </td>
                <td className="text-center font-thin">10/10/2021 09:30 am</td>
                <td className="text-center font-thin">10 MB</td>
                <td className="flex items-center justify-center">
                  <MoreIcon />
                </td>
              </tr>
              <tr className="border-t border-stf-purple-600">
                <td className="py-3 flex items-center gap-2">
                  <div className="w-10 flex items-center justify-center">
                    <FileIcon />
                  </div>
                  BigNameOfABigFile.xlsx
                </td>
                <td className="text-center font-thin">10/10/2021 09:30 am</td>
                <td className="text-center font-thin">10 MB</td>
                <td className="flex items-center justify-center">
                  <MoreIcon />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
