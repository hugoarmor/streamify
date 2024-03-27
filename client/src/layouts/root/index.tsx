import { StreamifyLogo } from "../../assets/streamify-logo.svg";
import { UserIcon } from "../../assets/user-icon.svg";
import { Sidebar } from "../../components/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function RootLayout() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate()

  if(isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    navigate("/sign-in")
    return null
  }

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

export default RootLayout;
