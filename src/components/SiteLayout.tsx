import { Outlet } from "react-router-dom";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";

const SiteLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <Outlet />
    </div>
  );
};

export default SiteLayout;
