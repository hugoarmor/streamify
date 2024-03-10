import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "../assets/home-icon.svg";
import { ClusterIcon } from "../assets/cluster-icon.svg";
import { SettingsIcon } from "../assets/settings-icon.svg";

type SidebarButtonProps = {
  path: string;
  icon: JSX.Element;
  text: string;
  className?: string;
};

const SidebarButton = ({ path, icon, text, className }: SidebarButtonProps) => {
  const location = useLocation();

  const isButtonSelected = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center hover:opacity-50 gap-2 ${
        isButtonSelected ? "bg-stf-purple-650" : ""
      } py-2 px-3 rounded-md ${className ?? ""}`}
    >
      {icon}
      <p>{text}</p>
    </Link>
  );
};

export function Sidebar() {
  return (
    <section className="w-56 gap-2 h-full shrink-0 flex flex-col pt-10 pb-5 px-6 border-r bg-stf-purple-800 border-stf-purple-600 text-xs">
      <SidebarButton path="/" icon={<HomeIcon />} text="Files" />
      <SidebarButton path="/cluster" icon={<ClusterIcon />} text="Cluster" />
      <SidebarButton className="mt-auto" path="/settings" icon={<SettingsIcon />} text="Settings" />
    </section>
  );
}
