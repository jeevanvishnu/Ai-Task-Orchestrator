import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks/reduxHooks";
import { getGoalById } from "../../app/features/goalSlice";
import { RoadmapView } from "../components/ui/RoadmapView";
import type { RootState } from "../../app/store";

export const GoalRoadmap = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { goals, loading } = useAppSelector((state: RootState) => state.goal);

  useEffect(() => {
    if (id) {
      const existingGoal = goals.find((g: any) => g._id === id);
      if (!existingGoal) {
        dispatch(getGoalById(id));
      }
    }
  }, [dispatch, id, goals.length]);

  const goalItem = goals.find((g: any) => g._id === id);

  if (loading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 w-full h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!goalItem && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full h-full min-h-[50vh]">
        <h2 className="text-xl font-bold text-foreground mb-4">Goal not found</h2>
        <button onClick={() => navigate("/goals")} className="text-primary hover:underline font-medium">
          Return to My Goals
        </button>
      </div>
    );
  }

  // Prevent accessing if it was temporarily not found but is still loading or resolving internally
  if (!goalItem) return null;

  return <RoadmapView goalItem={goalItem} onBack={() => navigate("/goals")} />;
};
