import { User, ShieldCheck, Palette, Bell, LayoutGrid, Wallet, LogOut } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../../app/features/authSlice";
import type { AppDispatch } from "../../../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const sidebarOptions = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security & Account", icon: ShieldCheck },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: LayoutGrid },
  { id: "billing", label: "Billing", icon: Wallet },
];

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <nav className="flex flex-col gap-1">
        {sidebarOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onTabChange(option.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
              activeTab === option.id
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <option.icon className="w-5 h-5" />
            {option.label}
          </button>
        ))}
        
        <div className="mt-8 pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
};
