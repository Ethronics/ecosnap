import { Outlet } from "react-router-dom";
import { Navigation } from "../Navigation";
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
