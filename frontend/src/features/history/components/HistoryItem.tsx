import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";

interface HistoryItemProps {
  title: string;
  dateStr: string;
  progress: number;
  totalTasks: number;
  status: "completed" | "in_progress" | "pending";
  onClick: () => void;
}

export const HistoryItem = ({ title, dateStr, progress, totalTasks, status, onClick }: HistoryItemProps) => {
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";

  return (
    <div className="group bg-card border border-border rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 hover:shadow-md transition-all">
      {/* Icon Area */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
        isCompleted ? "bg-[#10b981]/10 text-[#10b981]" : "bg-primary/10 text-primary"
      )}>
        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
      </div>

      {/* Info Area */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-foreground truncate mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Created {dateStr}
          </span>
          <span>•</span>
          <span>{totalTasks} Tasks</span>
        </div>
      </div>

      {/* Progress Area */}
      <div className="w-full md:w-48 lg:w-64 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Progress</span>
          <span className="text-xs font-bold text-foreground">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isCompleted ? "bg-[#10b981]" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
        <span className={cn(
          "text-[10px] md:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shrink-0",
          isCompleted ? "bg-[#10b981]/10 text-[#10b981]" :
          isInProgress ? "bg-primary/10 text-primary" :
          "bg-muted text-muted-foreground"
        )}>
          {status.replace("_", " ")}
        </span>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClick}
          className="font-bold text-xs"
        >
          View Roadmap
        </Button>
      </div>
    </div>
  );
};
