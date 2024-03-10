import { useEffect, useState } from "react";
import { Http } from "./services/http/http.service";
import { StreamifyLogo } from "./assets/streamify-logo.svg";
import { UserIcon } from "./assets/user-icon.svg";
import { HomeIcon } from "./assets/home-icon.svg";
import { ClusterIcon } from "./assets/cluster-icon.svg";
import { SettingsIcon } from "./assets/settings-icon.svg";

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
        <section className="w-56 gap-2 h-full shrink-0 flex flex-col pt-10 pb-5 px-6 border-r bg-stf-purple-800 border-stf-purple-600 text-xs">
          <div className="flex items-center gap-2 bg-stf-purple-650 py-2 px-3 rounded-md">
            <HomeIcon />
            <p>Files</p>
          </div>
          <div className="flex items-center gap-2 py-2 px-3 rounded-md">
            <ClusterIcon />
            <p>Cluster</p>
          </div>
          <div className="flex items-center gap-2 py-2 px-3 rounded-md mt-auto">
            <SettingsIcon />
            <p>Settings</p>
          </div>
        </section>
        <section className="flex h-full w-full">

        </section>
      </section>
    </main>
  );
}

export default App;
