import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import "./dropzone.style.scss";

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
}

function MyDropzone({ onDrop, className }: Props) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  return (
    <div
      {...getRootProps()}
      className={`bg-stf-purple-700 dashed-border ${isDragActive ? "border-stf-white" : ""} ${className}`}
    >
      <input {...getInputProps()} />
      <p className='text-sm'>Drag & drop files here, or click to select files</p>
    </div>
  );
};

export default MyDropzone;
