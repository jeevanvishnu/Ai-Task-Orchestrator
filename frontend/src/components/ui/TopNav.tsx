import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/reduxHooks";
import { searchGoal, getDashboard } from "../../../app/features/goalSlice";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "../../../app/store";

interface TopNavProps {
  onMenuClick?: () => void;
}

export const TopNav = ({ onMenuClick }: TopNavProps) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchGoal(searchTerm));
        // Optional: navigate to a designated page to show search results if not already there
        if (location.pathname !== "/" && !location.pathname.startsWith("/goals")) {
          navigate("/");
        }
      } else {
        dispatch(getDashboard());
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch, navigate, location.pathname]);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1 text-muted-foreground hover:bg-muted rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center bg-muted/50 rounded-md px-3 py-1.5 w-full max-w-[240px] md:max-w-96 border border-border/50 relative">
          <Search className="text-muted-foreground w-4 h-4 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search globally..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground pr-6"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity ml-4"
        onClick={() => navigate("/settings")}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-border">
          {user?.name?.[0].toUpperCase() || "?"}
        </div>
        <span className="hidden md:block text-sm font-medium text-foreground">{user?.name || "User"}</span>

      </div>
    </header>
  );
};
