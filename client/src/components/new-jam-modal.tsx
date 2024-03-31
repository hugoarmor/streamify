import { Dialog, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { JamCreate, JamQueries } from "../queries/jam";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  open: boolean;
  onClose?: () => void;
  folderRelativePath: string;
  onSubmit?: (data: JamCreate) => void | Promise<void>;
};

const formSchema = z.object({
  expirationDate: z.date(),
  canEdit: z.boolean().default(true),
  password: z.string().min(6),
});

export type NewJamFormSchema = z.infer<typeof formSchema>;

export function NewJamModal(props: Props) {
  const [loading, setLoading] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: jamFolder, data: createdJam } = useMutation(
    "createJam",
    JamQueries.create
  );

  const hasCreated = !!createdJam;

  const { register, handleSubmit, setValue } = useForm<NewJamFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      canEdit: true
    }
  });

  const handleSubmitEvent = async (data: NewJamFormSchema) => {
    setLoading(true);

    const jamDetails: JamCreate = {
      folder_relative_path: props.folderRelativePath,
      expires_at: data.expirationDate.toISOString(),
      password: data.password,
      can_edit: data.canEdit,
    };

    await jamFolder(jamDetails);

    await props.onSubmit?.(jamDetails);

    setLoading(false);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/jams/${createdJam?.id}`
    );
    setCopiedToClipboard(true);
  };

  const handleDateTimeChange = (date: Date | null) =>
    date ? setValue("expirationDate", date) : null;
  const VisibilityAdornment = () => (
    <div
      onClick={() => setShowPassword((prev) => !prev)}
      className="cursor-pointer"
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </div>
  );

  useEffect(() => {
    if (!copiedToClipboard) return;

    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 3000);
  }, [copiedToClipboard]);

  const CreatedContent = () => (
    <form
      onSubmit={handleSubmit(() => {})}
      className="bg-stf-purple-800 w-96 rounded-lg text-stf-white"
    >
      <div className={`px-8 pt-8 pb-4 gap-6 flex flex-col w-full`}>
        <div>
          <div className="flex items-center gap-2">
            <CloudUploadIcon fontSize="medium" />
            <p className="text-lg">"Your jam has been created!"</p>
          </div>
        </div>
        <div
          onClick={handleCopyClick}
          className="border border-stf-purple-600 rounded px-3 py-2 bg-stf-purple-700 cursor-pointer flex items-center gap-2 text-sm hover:opacity-50"
        >
          {copiedToClipboard ? (
            <CheckIcon fontSize="small" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
          <p>Copy this link to share your jam</p>
        </div>
      </div>
      <div className="flex px-8 py-4 justify-end gap-4 mt-4 border-t border-stf-purple-600 text-sm">
        <button
          type="button"
          onClick={props.onClose}
          className={`${
            loading ? "opacity-50 pointer-events-none" : ""
          } hover:opacity-70 bg-stf-purple-650 border border-stf-purple-600 text-stf-white rounded px-5 py-1`}
        >
          Exit
        </button>
      </div>
    </form>
  );

  const NotCreatedContent = () => (
    <form
      onSubmit={handleSubmit(handleSubmitEvent)}
      className="bg-stf-purple-800 w-96 rounded-lg text-stf-white"
    >
      <div className={`px-8 pt-8 pb-4 gap-6 flex flex-col w-full`}>
        <div>
          <div className="flex items-center gap-2">
            <CloudUploadIcon fontSize="medium" />
            <p className="text-lg">Jam folder</p>
          </div>

          <p className="text-xs mb-auto mt-2 opacity-70">
            Share this folder with other people via link sharing, users can also
            edit the folder files if you want to.
          </p>
        </div>
        <DateTimePicker
          label="Jam expiration"
          minDate={new Date()}
          onChange={handleDateTimeChange}
        />
        <TextField
          label="Pass code to your Jam"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: <VisibilityAdornment />,
          }}
          {...register("password")}
          color="primary"
        />
        <div className="flex cursor-not-allowed">
          <label className="flex text-sm items-center gap-2">
            Can users edit this folder?
          </label>
          <Switch disabled {...register("canEdit")} defaultChecked color="primary" />
        </div>
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
          Confirm
        </button>
      </div>
    </form>
  );

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
      {hasCreated ? <CreatedContent /> : <NotCreatedContent />}
    </Dialog>
  );
}
