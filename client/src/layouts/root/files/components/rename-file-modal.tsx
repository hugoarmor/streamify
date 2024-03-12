import { Dialog } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  fileName?: string;
  onSubmit?: (newFileName: string) => void | Promise<void>;
};

export function RenameFileModal(props: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!props.onSubmit || !inputRef.current) return setLoading(false);

    const newFileName = inputRef.current.value.trim();

    if (!newFileName) {
      return setLoading(false);
    }

    await props.onSubmit?.(inputRef.current.value);

    setLoading(false);
  };

  const Input = () => {
    useEffect(() => {
      if (!inputRef.current) return;

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
          borderRadius: "0.5rem",
          backgroundColor: "#240046",
        },
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-stf-purple-800 w-96 border rounded-lg border-stf-purple-600 text-stf-white"
      >
        <div className="px-8 pt-8 pb-4 gap-6 flex flex-col w-full">
          <p className="text-lg">Rename file</p>
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
            Rename
          </button>
        </div>
      </form>
    </Dialog>
  );
}
