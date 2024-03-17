import { useCallback, useEffect, useState } from "react";
import { Http } from "../services/http/http.service";
import { useQuery } from "react-query";

type FileUploadType = {
  file: File;
  progress: number;
};

export function useFileUploader() {
  const [filesUploads, setFilesUploads] = useState<FileUploadType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { refetch } = useQuery("files");

  const appendFiles = (newFiles: File[]) => {
    const newFilesUpload = newFiles.map((file) => ({
      file: file,
      progress: 0,
    }));

    setFilesUploads((prevFiles) => [...prevFiles, ...newFilesUpload]);
  };

  const uploadNextFile = async (): Promise<void> => {
    const fileUpload = filesUploads[0];

    if (!fileUpload) return setIsUploading(false);

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", fileUpload.file);
    formData.append("file_name", fileUpload.file.name);

    const http = new Http();

    await http.post("/api/files/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total ?? fileUpload.file.size;

        const progress = Math.round((progressEvent.loaded / total) * 100);
        setFilesUploads((prevFiles) => {
          const newFiles = [...prevFiles];
          newFiles[0].progress = progress;
          return newFiles;
        });
      }
    })

    setFilesUploads((prevFiles) => prevFiles.slice(1));
    setIsUploading(false);
    refetch();
  };

  useEffect(() => {
    if (isUploading || filesUploads.length <= 0) return

    uploadNextFile();
  }, [filesUploads, isUploading]);

  return { filesUploads, appendFiles };
}
