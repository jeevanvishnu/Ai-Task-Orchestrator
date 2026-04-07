import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useTheme } from "../../../context/ThemeProvider";
import type { Theme } from "../../../context/ThemeProvider";

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "light" as Theme, label: "Light", icon: Sun, colors: "bg-white" },
    { id: "dark" as Theme, label: "Dark", icon: Moon, colors: "bg-slate-900" },
    { id: "system" as Theme, label: "System", icon: Monitor, colors: "bg-gradient-to-r from-white to-slate-900" },
  ];

  return (
    <section className="pt-8 border-t border-border/60">
      <h2 className="text-xl font-bold text-foreground mb-2">Appearance</h2>
      <p className="text-sm text-muted-foreground mb-6">Select or customize your UI theme.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all overflow-hidden",
              theme === t.id 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border bg-card hover:bg-secondary/40"
            )}
          >
            <div className={cn("w-full h-24 rounded-xl mb-1 shadow-inner border border-border/50", t.colors)}>
              <div className="p-3 space-y-2">
                 <div className={cn("h-2 w-2/3 rounded-full opacity-20", t.id === 'light' ? 'bg-slate-400' : 'bg-slate-100')} />
                 <div className={cn("h-2 w-1/2 rounded-full opacity-10", t.id === 'light' ? 'bg-slate-400' : 'bg-slate-100')} />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">{t.label}</span>
            {theme === t.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center p-1">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};
