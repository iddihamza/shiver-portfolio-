import { Link } from "react-router-dom";
import MobileNavBar from "@/components/navigation/MobileNavBar";
import { useAuth } from "@/contexts/AuthContext";

const SiteHeader = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");

  return (
    <header className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-tech z-50 border-b border-border">
      <div className="hidden lg:flex justify-between items-center px-8 py-4">
        <Link
          to="/"
          className="mono-font font-bold text-xl tracking-wide text-foreground hover:text-accent transition-colors"
        >
          Shiver
        </Link>
        <nav>
          {isAdmin ? (
            <ul className="flex gap-6 mono-font">
              <li>
                <Link to="/portfolio" className="text-sm md:text-base text-accent hover:underline">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/characters" className="text-sm md:text-base text-accent hover:underline">
                  Characters
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="text-sm md:text-base text-accent hover:underline">
                  Timeline
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-sm md:text-base text-accent hover:underline">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-sm md:text-base text-accent hover:underline">
                  Cases
                </Link>
              </li>
              <li>
                <Link to="/multimedia" className="text-sm md:text-base text-accent hover:underline">
                  Multimedia
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm md:text-base text-accent hover:underline">
                  Admin
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm md:text-base text-accent hover:underline">
                  Sign In
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-6 mono-font">
              <li>
                <Link to="/timeline" className="text-sm md:text-base text-accent hover:underline">
                  Timeline
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-sm md:text-base text-accent hover:underline">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-sm md:text-base text-accent hover:underline">
                  Cases
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm md:text-base text-accent hover:underline">
                  Sign In
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>

      <div className="lg:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          <Link
            to="/"
            className="mono-font font-bold text-lg md:text-xl tracking-wide text-foreground hover:text-accent transition-colors"
          >
            Shiver
          </Link>
          <Link to="/auth" className="text-sm mono-font text-accent hover:underline">
            Sign In
          </Link>
        </div>
        <MobileNavBar />
      </div>
    </header>
  );
};

export default SiteHeader;
