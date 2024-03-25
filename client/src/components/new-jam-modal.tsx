import { Dialog, Input, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  open: boolean;
  onClose?: () => void;
  fileName?: string;
  onSubmit?: (data: NewJamFormSchema) => void | Promise<void>;
};

const formSchema = z.object({
  expirationDate: z.date(),
  canEdit: z.boolean(),
  password: z.string().min(6)
});

export type NewJamFormSchema = z.infer<typeof formSchema>;

export function NewJamModal(props: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue } = useForm<NewJamFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmitEvent = async (data: NewJamFormSchema) => {
    setLoading(true);

    await props.onSubmit?.(data);

    setLoading(false);
  };

  const handleDateTimeChange = (date: Date | null) => date ? setValue("expirationDate", date) : null;
  const VisibilityAdornment = () => (
    <div onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer">
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </div>
  )

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
        onSubmit={handleSubmit(handleSubmitEvent)}
        className="bg-stf-purple-800 w-96 rounded-lg text-stf-white"
      >
        <div className="px-8 pt-8 pb-4 gap-6 flex flex-col w-full">
          <p className="text-lg">Jam folder</p>
          <DateTimePicker
            label="Jam expiration"
            minDate={new Date()}
            onChange={handleDateTimeChange}
          />
          <div className="flex">
            <label className="flex items-center gap-2">Can users edit this folder?</label>
            <Switch {...register("canEdit")} color="primary" />
          </div>
          <TextField label="Password" type={showPassword ? "text" : "password"} InputProps={{
            endAdornment: <VisibilityAdornment />
          }} {...register("password")} color="primary" />
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
    </Dialog>
  );
}
