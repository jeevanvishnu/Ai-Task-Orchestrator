import { MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";

interface GoalCardProps {
  title: string;
  dateStr: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  isCompleted?: boolean;
  onClick?: () => void;
}

export const GoalCard = ({ title, dateStr, progress, tasksCompleted, totalTasks, isCompleted, onClick }: GoalCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="goal-card bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">Created {dateStr}</p>
        </div>
        <button className="text-muted-foreground hover:bg-muted p-1 rounded-md transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
           <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
           <span className="text-xs font-bold">{progress}%</span>
        </div>
        
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000", isCompleted ? "bg-green-500" : "bg-primary")}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground font-medium">
          <span className={cn(isCompleted ? "text-green-500" : "text-muted-foreground")}>{tasksCompleted} of {totalTasks}</span> tasks completed
        </p>
      </div>
    </div>
  );
};
