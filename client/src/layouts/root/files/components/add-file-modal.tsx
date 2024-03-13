import { Dialog } from "@mui/material";
import { useState } from "react";
import MyDropzone from "../../../../components/dropzone";
import { FileService } from "../../../../services/file";
import { DeleteIcon } from "../../../../assets/delete-icon.svg";
import { FileIcon } from "../../../../assets/file-icon.svg";
import "./add-file-modal.style.scss";

export function AddFileModal(props: { open: boolean; onClose?: () => void }) {
  const [files, setFiles] = useState<{ [key: string]: File }>({});

  const handleAddFiles = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.reduce((acc, file) => {
      acc[file.name] = file;
      return acc;
    }, {} as { [key: string]: File });

    setFiles((prevFiles) => ({ ...prevFiles, ...newFiles }));
  };

  const handleRemoveFile = (name: string) => {
    const newFiles = { ...files };
    delete newFiles[name];
    setFiles(newFiles);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
      PaperProps={{
        style: {
          backgroundColor: "#240046",
          borderRadius: "0.5rem",
          border: "1px solid #5A189A",
        },
      }}
    >
      <form
        onSubmit={e => {
          e.preventDefault()
          props.onClose?.()
        }}
        className="add-file-modal bg-stf-purple-800 rounded-lg text-stf-white"
      >
        <div className="px-8 pt-8 pb-4 flex flex-col w-full">
          <p className="text-lg mb-6">Upload files</p>
          <div className="max-h-52 overflow-auto flex flex-col gap-2">
            {Object.entries(files).map(([name, file]) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileIcon />
                  <p className="text-sm font-bold">{name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs">
                    {FileService.getFileSize(file.size)}
                  </p>
                  <DeleteIcon
                    className="cursor-pointer"
                    onClick={() => handleRemoveFile(name)}
                  />
                </div>
              </div>
            ))}
          </div>
          <MyDropzone onDrop={handleAddFiles} />
        </div>
        <div className="flex px-8 py-4 justify-end gap-4 mt-4 border-t border-stf-purple-600 text-sm">
          <button
            type="button"
            onClick={props.onClose}
            className={`hover:opacity-70 bg-stf-purple-650 border border-stf-purple-600 text-stf-white rounded px-5 py-1`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`hover:opacity-70 bg-stf-white border border-stf-purple-600 text-stf-purple-600 rounded px-5 py-1`}
          >
            Upload
          </button>
        </div>
      </form>
    </Dialog>
  );
}
