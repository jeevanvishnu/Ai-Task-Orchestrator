import { Search, ChevronDown, Menu } from "lucide-react";

interface TopNavProps {
  onMenuClick?: () => void;
}

export const TopNav = ({ onMenuClick }: TopNavProps) => {
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

        <div className="flex items-center bg-muted/50 rounded-md px-3 py-1.5 w-full max-w-[240px] md:max-w-96 border border-border/50">
          <Search className="text-muted-foreground w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity ml-4">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
          alt="User Profile"
          className="w-8 h-8 rounded-full object-cover border border-border"
        />
        <span className="hidden md:block text-sm font-medium text-foreground">Sarah Jenkins</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>
    </header>
  );
};
