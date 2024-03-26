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
};

export function PasscodeScreen(props: Props) {
  const { register, handleSubmit } = useForm<PasscodeFormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <main className="bg-gradient-purple flex flex-col w-full h-svh px-20 pt-10 items-center justify-center">
      <StreamifyLogo size={70} />
      <div className="mb-3 mt-10">Type the passcode to access:</div>
      <form className="flex" onSubmit={handleSubmit(props.onSubmit)}>
        <input
          {...register("passcode")}
          type="password"
          className="px-4 py-2 border border-stf-purple-600 rounded-l-md bg-stf-purple-700 outline-none"
        />
        <button
          type="submit"
          className="h-full bg-stf-purple-700 border border-l-0 border-stf-purple-600 text-stf-white rounded-r-md px-2 flex items-center justify-center"
        >
          <SendIcon fontSize="small" />
        </button>
      </form>
    </main>
  );
}
