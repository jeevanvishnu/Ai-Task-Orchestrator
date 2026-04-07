import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { HistoryItem } from "../features/history/components/HistoryItem";
import { useAppDispatch, useAppSelector } from "../../app/hooks/reduxHooks";
import { getGoals } from "../../app/features/goalSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import { cn } from "../lib/utils";

export const History = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { goals, loading, error } = useAppSelector((state: RootState) => state.goal);
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (goals.length === 0) {
      dispatch(getGoals());
    }
  }, [dispatch, goals.length]);

  const filteredGoals = goals.filter(goal => {
    const totalTasks = goal.goal?.length || 0;
    const completedTasks = goal.goal?.filter((t: any) => t.status === "completed").length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    let status: "completed" | "in_progress" | "pending" = "pending";
    if (progress === 100) status = "completed";
    else if (progress > 0) status = "in_progress";

    const matchesFilter = filter === "all" || status === filter;
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 max-w-md mx-auto">
          <p className="font-bold mb-2">Failed to load history</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-8 md:py-12 max-w-6xl mx-auto w-full pb-20 fade-in">
      {/* Header Area */}
      <div className="mb-10 lg:mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">Goal History</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Review and track the progress of all your AI-generated roadmaps.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        {/* Simple Tabs UI */}
        <div className="flex items-center p-1 bg-secondary/40 rounded-xl w-fit border border-border/50">
          {(["all", "in_progress", "completed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                filter === t 
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative sm:min-w-[280px]">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input 
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
             />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-secondary/50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Newest first</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content List */}
      <div className="space-y-4">
        {loading && goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in zoom-in-95 duration-500">
             <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
             </div>
             <p className="text-muted-foreground font-medium italic">Assembling your progress data...</p>
          </div>
        ) : filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => {
            const totalTasks = goal.goal?.length || 0;
            const completedTasks = goal.goal?.filter((t: any) => t.status === "completed").length || 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const date = new Date(goal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            let status: "completed" | "in_progress" | "pending" = "pending";
            if (progress === 100) status = "completed";
            else if (progress > 0) status = "in_progress";

            return (
              <HistoryItem 
                key={goal._id}
                title={goal.title}
                dateStr={date}
                progress={progress}
                totalTasks={totalTasks}
                status={status}
                onClick={() => navigate(`/goals/${goal._id}`)}
              />
            );
          })
        ) : (
          <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-border/60 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground/60" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-foreground mb-1">No matches found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">We couldn't find any goals matching your search query or filters.</p>
             </div>
             <button 
                onClick={() => {setFilter("all"); setSearchQuery("");}}
                className="text-primary font-bold text-sm hover:underline underline-offset-4"
             >
                Clear all filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
