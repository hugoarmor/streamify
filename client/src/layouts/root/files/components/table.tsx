import { StreamifyFiles } from "..";
import { TableRow } from "./table-row";

type Props = {
  files: StreamifyFiles;
};

export function FilesTable({ files }: Props) {
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
