import { StreamifyLogo } from "../../../assets/streamify-logo.svg";
import { useForm } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  passcode: z.string(),
});

type PasscodeFormSchema = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: PasscodeFormSchema) => void | Promise<void>;
  errorMessage?: string;
};

export function PasscodeScreen(props: Props) {
  const { register, handleSubmit, reset } = useForm<PasscodeFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const submit = async (data: PasscodeFormSchema) => {
    await props.onSubmit?.(data);
    reset();
  };

  const isError = !!props.errorMessage;

  return (
    <main className="bg-gradient-purple flex flex-col w-full h-svh px-20 pt-10 items-center justify-center">
      <StreamifyLogo size={70} />
      <div className="mb-3 mt-10">Type the passcode to access:</div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex h-full">
          <input
            {...register("passcode")}
            type="password"
            className={`${
              isError ? "border-red-500" : "border-stf-purple-600"
            } px-4 py-2 border bg-stf-purple-700 rounded-l-md outline-none`}
          />
          <button
            type="submit"
            className={`${
              isError ? "border-red-500" : "border-stf-purple-600"
            } h-full bg-stf-purple-700 border border-l-0 text-stf-white rounded-r-md px-2 flex items-center justify-center`}
          >
            <SendIcon fontSize="small" />
          </button>
        </div>
      </form>
      <div className={`${isError ? "visible" : "invisible"} text-red-500 text-sm mt-2`}>{props.errorMessage ?? "NONE"}</div>
    </main>
  );
}
