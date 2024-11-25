import { Dialog } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  fileName?: string;
  onSubmit?: (newFolderName: string) => void | Promise<void>;
};

export function AddFolderModal(props: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!props.onSubmit || !inputRef.current) return setLoading(false);

    const newFolderName = inputRef.current.value.trim();

    if (!newFolderName) {
      return setLoading(false);
    }

    await props.onSubmit?.(inputRef.current.value);

    setLoading(false);
  };

  const Input = () => {
    useEffect(() => {
      if (!inputRef.current || loading) return;

      inputRef.current.value = props.fileName || "";
      inputRef.current.focus();
      inputRef.current.select();
    }, []);

    return (
      <input
        ref={inputRef}
        type="text"
        className="px-4 outline-none h-10 rounded-md bg-stf-purple-650 border border-stf-purple-600"
      />
    );
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
        onSubmit={handleSubmit}
        className="bg-stf-purple-800 w-96 rounded-lg text-stf-white"
      >
        <div className="px-8 pt-8 pb-4 gap-6 flex flex-col w-full">
          <p className="text-lg">Create folder</p>
          <Input />
        </div>
        <div className="flex px-8 py-4 justify-end gap-4 mt-4 border-t border-stf-purple-600 text-sm">
          <button
            type="button"
            onClick={props.onClose}
            className={`${
              loading ? "opacity-50 pointer-events-none" : ""
            } hover:opacity-70 bg-stf-purple-650 border border-stf-purple-600 text-stf-white rounded px-5 py-1`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${
              loading ? "opacity-50 pointer-events-none" : ""
            } hover:opacity-70 bg-stf-white border border-stf-purple-600 text-stf-purple-600 rounded px-5 py-1`}
          >
            Create
          </button>
        </div>
      </form>
    </Dialog>
  );
}
