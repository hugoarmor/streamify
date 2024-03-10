import { useEffect, useState } from "react";
import { Http } from "./services/http/http.service";
import { StreamifyLogo } from "./assets/streamify-logo.svg";
import { UserIcon } from "./assets/user-icon.svg";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";

type StreamifyFile = {
  size: number;
  type: string;
};

type StreamifyFiles = {
  [key: string]: StreamifyFile;
};

function App() {
  const [files, setFiles] = useState<StreamifyFiles>({});

  useEffect(() => {
    (async () => {
      const http = new Http();
      const response = await http.get<StreamifyFiles>("api/files");

      if (response.error) return console.error(response.error.message);

      setFiles(response.data);
    })();
  }, []);

  return (
    <main className="bg-gradient-purple flex flex-col w-full h-svh">
      <header className="flex items-center justify-between h-16 px-10 border-b border-stf-purple-600">
        <StreamifyLogo />
        <div className="w-8 h-8 bg-stf-white rounded-full flex justify-center items-center">
          <UserIcon />
        </div>
      </header>
      <section className="w-full h-full flex">
        <Sidebar />
        <section className="flex h-full w-full">
          <Outlet />
        </section>
      </section>
    </main>
  );
}

export default App;
