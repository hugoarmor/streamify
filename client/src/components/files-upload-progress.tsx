import { CircularProgressbar } from "react-circular-progressbar";

type Props = {
  files: { name: string; progress: number }[];
};

export function FilesUploadProgress({ files }: Props) {
  return (
    <div className="flex flex-col bg-stf-purple-700 border border-stf-purple-600 rounded-lg px-6 py-2 fixed bottom-6 right-6">
      <p className="font-semibold mb-2">Files Upload</p>
      <div className="flex flex-col gap-1">
        {files.map((file, index) => (
          <div key={"file-upload-" + index} className="font-extralight flex items-center gap-2">
            <div className="w-4 shrink-0">
              <CircularProgressbar
                strokeWidth={15}
                value={file.progress}
                styles={{
                  path: { stroke: "#399a18" },
                  trail: { stroke: "#240046" },
                  text: { fill: "#5A189A", fontSize: "12px" },
                }}
              />
            </div>
            <p>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
