import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";

interface GoalCardProps {
  title: string;
  dateStr: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  isCompleted?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export const GoalCard = ({ title, dateStr, progress, tasksCompleted, totalTasks, isCompleted, onClick, onDelete }: GoalCardProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={onClick}
      className="goal-card bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">Created {dateStr}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:bg-muted p-1 rounded-md transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalOpen(true);
              }}
            >
              Delete Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      {/* Delete Goal Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" size="default" onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              size="default" 
              onClick={(e) => { 
                e.stopPropagation();
                setDeleteModalOpen(false); 
                onDelete?.(); 
              }} 
              className="bg-red-600 text-white hover:bg-red-800"
            >
              Delete Goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
