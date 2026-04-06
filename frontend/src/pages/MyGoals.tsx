import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/reduxHooks";
import { getGoals } from "../../app/features/goalSlice";
import { GoalCard } from "../components/ui/GoalCard";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";

export const MyGoals = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { goals, loading, error } = useAppSelector((state: RootState) => state.goal);

  useEffect(() => {
    if (goals.length === 0) {
      dispatch(getGoals());
    }
  }, [dispatch, goals.length]);

  return (
    <div className="px-4 md:px-10 py-8 md:py-12 max-w-6xl mx-auto w-full pb-20 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Goals</h1>
        <p className="text-muted-foreground mt-2">Manage and track your generated roadmaps</p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            Error: {error}
        </div>
      )}

      {loading && goals.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {goals.map((goalItem, i) => {
            const totalTasks = goalItem.goal?.length || 0;
            const completedTasks = goalItem.goal?.filter((t: any) => t.status === "completed").length || 0;
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
              />
            );
          })}
        </div>
      )}

      {!loading && goals.length === 0 && !error && (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl px-4 mt-8">
            <p className="text-muted-foreground">No goals found. Head to the dashboard to generate one!</p>
        </div>
      )}
    </div>
  );
};
