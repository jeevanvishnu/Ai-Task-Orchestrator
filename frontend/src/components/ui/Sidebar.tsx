import { LayoutDashboard, Target, Clock, Settings, Network, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "My Goals", icon: Target, path: "/goals" },
  { name: "History", icon: Clock, path: "/history" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar h-full flex flex-col p-4 shadow-xl lg:shadow-none">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2 text-sidebar-foreground font-bold text-xl">
          <Network className="text-primary w-6 h-6" />
          <span>Orchestrator AI</span>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = link.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border pt-4">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          Collapse
        </button>
      </div>
    </div>
  );
};
