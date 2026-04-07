import { useEffect, useRef, useState } from "react";
import { Sparkles, Video, Code, Terminal, Loader2 } from "lucide-react";
import { GoalCard } from "../components/ui/GoalCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks/reduxHooks";
import { getDashboard, createGoalAction, deleteDashboardGoal } from "../../app/features/goalSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import gsap from "gsap";

export const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { goals, loading, error } = useAppSelector((state: RootState) => state.goal);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const handleGenerate = () => {
    if (!goalTitle.trim()) return;
    dispatch(createGoalAction(goalTitle));
    setGoalTitle("");
  };

  useEffect(() => {
    // GSAP Animations setup
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1
      });

      gsap.from(".hero-input-area", {
        scale: 1,
        opacity: 0,
        y: 20,
        delay: 0.2,
        duration: 0.5,
        ease: "back.out(1.2)"
      });

      gsap.from(".suggestion-chip", {
        opacity: 0,
        x: -15,
        stagger: 0.08,
        delay: 0.5,
        ease: "power2.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);


  return (
    <div ref={containerRef} className="px-4 md:px-10 py-8 md:py-12 max-w-6xl mx-auto w-full pb-20">

      <div className="flex flex-col items-center justify-center text-center mt-4 md:mt-6 mb-8 md:mb-12">
        <h1 className="hero-text text-3xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-8 text-foreground">
          What do you want to achieve today?
        </h1>

        <div className="hero-input-area w-full max-w-4xl bg-card rounded-xl shadow-sm border border-border p-4 md:p-6 flex flex-col mb-6 md:mb-8 relative transition-shadow focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring">
          <textarea
            className="w-full bg-transparent border-none outline-none text-base md:text-lg text-foreground placeholder:text-muted-foreground resize-none min-h-[80px]"
            placeholder="I want to launch an e-commerce store..."
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleGenerate}
              disabled={loading || !goalTitle.trim()}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2.5 font-semibold text-sm flex items-center justify-center transition-transform enabled:hover:scale-105 enabled:active:scale-95 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <span className="hero-text text-sm text-muted-foreground font-medium mr-1">Suggestions:</span>
          {["YouTube channel", "SaaS app", "Learn React"].map((s) => (
             <button 
              key={s}
              onClick={() => setGoalTitle(s)}
              className="suggestion-chip flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-medium hover:bg-secondary/80 transition-colors border border-border/50"
             >
                {s}
              </button>
          ))}
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <div className="recent-header flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground">Recent Goals</h2>
          <div className="flex items-center gap-4">
            {goals.length > 0 && (
              <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline-block">{goals.length} Generated</span>
            )}
            <button onClick={() => navigate("/goals")} className="px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border">
              View All
            </button>
          </div>
        </div>

        {error && (
            <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                Error: {error}
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {goals.map((goalItem, i) => {
            const totalTasks = goalItem.goal?.length || 0;
            const completedTasks = goalItem.goal?.filter(t => t.status === "completed").length || 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const date = new Date(goalItem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <GoalCard 
                key={goalItem._id || i}
                title={goalItem.title} 
                dateStr={date}
                progress={progress}
                tasksCompleted={completedTasks}
                totalTasks={totalTasks}
                isCompleted={progress === 100}
                onClick={() => navigate(`/goals/${goalItem._id}`)}
                onDelete={() => dispatch(deleteDashboardGoal(goalItem._id))}
              />
            );
          })}
        </div>

        {!loading && goals.length === 0 && !error && (
            <div className="text-center py-12 md:py-20 bg-muted/20 rounded-2xl border border-dashed border-border px-4">
                <p className="text-sm md:text-base text-muted-foreground">No goals generated yet. Use the tool above to start!</p>
            </div>
        )}
      </div>

    </div>
  );
};
