import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from "@hello-pangea/dnd";
import { ChevronRight, Edit2, RefreshCw, Calendar, MoreHorizontal, Check, Circle, GripVertical, CheckSquare, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert-dialog";
import { useAppDispatch } from "../../../app/hooks/reduxHooks";
import { editGoalAction, regenerateGoal, editTask, deleteGoalAction } from "../../../app/features/goalSlice";

interface RoadmapViewProps {
  goalItem: any;
  onBack: () => void;
}

export const RoadmapView = ({ goalItem, onBack }: RoadmapViewProps) => {
  const dispatch = useAppDispatch();
  const [tasks, setTasks] = useState<any[]>(goalItem.goal || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goalItem.title);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Task specific states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState({ title: '', description: '' });
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    setTasks(goalItem.goal || []);
    setEditedTitle(goalItem.title);
  }, [goalItem]);

  const handleEditToggle = async () => {
    if (isEditing) {
      if (editedTitle.trim() !== goalItem.title) {
        setIsSaving(true);
        await dispatch(editGoalAction({ id: goalItem._id, title: editedTitle.trim() }));
        setIsSaving(false);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleRegenerate = async () => {
    if (isEditing && editedTitle.trim() !== goalItem.title) {
      setIsSaving(true);
      await dispatch(editGoalAction({ id: goalItem._id, title: editedTitle.trim() }));
      setIsSaving(false);
      setIsEditing(false);
    }
    setIsRegenerating(true);
    await dispatch(regenerateGoal(goalItem._id));
    setIsRegenerating(false);
  };

  const startEditingTask = (task: any) => {
    setEditingTaskId(task._id);
    setEditedTaskContent({ title: task.title, description: task.description || '' });
  };

  const handleSaveTask = async () => {
    if (editingTaskId) {
      await dispatch(editTask({ 
        id: goalItem._id, 
        taskId: editingTaskId, 
        title: editedTaskContent.title, 
        description: editedTaskContent.description 
      }));
      setEditingTaskId(null);
    }
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await dispatch(deleteGoalAction({ id: goalItem._id, taskId: taskToDelete }));
      setTaskToDelete(null);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    let newStatus = "pending";
    if (currentStatus === "pending") newStatus = "in_progress";
    else if (currentStatus === "in_progress") newStatus = "completed";
    else newStatus = "pending";

    await dispatch(editTask({ 
      id: goalItem._id, 
      taskId, 
      status: newStatus 
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === "completed").length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const estDate = new Date(goalItem.createdAt);
  estDate.setDate(estDate.getDate() + 30); // Mock estimated completion date
  const estDateStr = estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 md:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6 text-muted-foreground">
        <button onClick={onBack} className="hover:text-primary transition-colors font-medium">My Goals</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Roadmap</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        {isEditing ? (
          <input
            type="text"
            className="flex-1 text-3xl font-extrabold tracking-tight bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEditToggle()}
            autoFocus
          />
        ) : (
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{goalItem.title}</h1>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleEditToggle}
            disabled={isSaving || isRegenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? "Save Title" : "Edit Goal"}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating || isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerate
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-card border border-border rounded-xl p-5 mb-10 shadow-sm flex flex-col justify-center">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-foreground">{progress}% Completed</span>
          <span className="text-sm font-medium text-muted-foreground">{completedTasks} of {totalTasks} tasks completed • Estimated {estDateStr}</span>
        </div>
        <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task Timeline */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks-list">
          {(provided) => (
            <div
              className="space-y-6 md:space-y-8 pl-2 md:pl-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task: any, index: number) => {
                // For aesthetic testing relative to the photo, we will artificially determine 'in_progress'
                // if it's the first non-completed item.
                let isCompleted = task.status === "completed";
                let isInProgress = task.status === "in_progress";

                if (!isCompleted && !isInProgress) {
                  const previousAllCompleted = tasks.slice(0, index).every((t: any) => t.status === "completed");
                  if (previousAllCompleted) isInProgress = true;
                }
                const draggableId = task._id || `task-${index}`;

                return (
                  <Draggable key={draggableId} draggableId={draggableId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={cn("flex relative group", snapshot.isDragging && "z-50 opacity-95 relative")}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={provided.draggableProps.style}
                      >
                        {/* Vertical connector line */}
                        {index < totalTasks - 1 && !snapshot.isDragging && (
                          <div className="absolute left-[11px] top-8 bottom-[-24px] md:bottom-[-32px] w-[2px] bg-border/60 group-last:hidden" />
                        )}

                        {/* Icon Circle */}
                        <div className="mr-5 mt-2 relative z-10 flex-shrink-0 w-6 flex justify-center bg-background">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-1 shadow-sm transition-colors cursor-pointer" onClick={() => handleToggleStatus(task._id, task.status)}>
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : isInProgress ? (
                            <div className="w-6 h-6 rounded-full border-[3px] border-primary flex items-center justify-center bg-background shadow-sm transition-colors cursor-pointer" onClick={() => handleToggleStatus(task._id, task.status)}>
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 bg-background transition-colors cursor-pointer hover:border-primary" onClick={() => handleToggleStatus(task._id, task.status)} />
                          )}
                        </div>

                        {/* Task Card */}
                        <div className={cn(
                          "flex-1 bg-card rounded-xl p-5 shadow-sm transition-all duration-200",
                          isInProgress ? "border-2 border-primary/50 shadow-md ring-4 ring-primary/5" : "border border-border",
                          isCompleted && "bg-muted/30 opacity-80"
                        )}>
                          <div className="flex items-start gap-3">
                            {/* Grip / Drag icon - bound to @hello-pangea/dnd */}
                            <div
                              className="pt-0.5 text-muted-foreground/40 cursor-grab hover:text-muted-foreground/70 transition-colors active:cursor-grabbing hover:bg-muted/30 rounded p-0.5"
                              {...provided.dragHandleProps}
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Custom Checkbox */}
                            <div className="pt-0.5">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded border border-primary bg-primary text-primary-foreground flex items-center justify-center cursor-pointer" onClick={() => handleToggleStatus(task._id, task.status)}>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 hover:border-primary transition-colors cursor-pointer" onClick={() => handleToggleStatus(task._id, task.status)} />
                              )}
                            </div>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              {editingTaskId === task._id ? (
                                <div className="space-y-3 mb-3">
                                  <input 
                                    className="w-full text-base md:text-lg font-bold bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                    value={editedTaskContent.title}
                                    onChange={(e) => setEditedTaskContent({...editedTaskContent, title: e.target.value})}
                                    placeholder="Task Title"
                                  />
                                  <textarea 
                                    className="w-full text-sm md:text-base text-muted-foreground bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                                    rows={3}
                                    value={editedTaskContent.description}
                                    onChange={(e) => setEditedTaskContent({...editedTaskContent, description: e.target.value})}
                                    placeholder="Task Description"
                                  />
                                  <div className="flex items-center gap-2">
                                    <button onClick={handleSaveTask} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90">Save</button>
                                    <button onClick={() => setEditingTaskId(null)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md hover:bg-secondary/80">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                                    <h3 className={cn(
                                      "font-bold text-base md:text-lg text-foreground tracking-tight truncate transition-all",
                                      isCompleted && "line-through text-muted-foreground"
                                    )}>
                                      {task.title}
                                    </h3>

                                    <span className={cn(
                                      "text-[11px] md:text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 tracking-wide w-fit",
                                      isCompleted ? "bg-[#10b981]/10 text-[#10b981]" :
                                        isInProgress ? "bg-primary/10 text-primary" :
                                          "bg-muted text-muted-foreground"
                                    )}>
                                      {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Pending"}
                                    </span>
                                  </div>

                                  {task.description && (
                                    <p className={cn(
                                      "text-sm md:text-base text-muted-foreground mb-4 leading-relaxed max-w-3xl transition-all",
                                      isCompleted && "line-through opacity-60"
                                    )}>
                                      {task.description}
                                    </p>
                                  )}
                                </>
                              )}

                              <div className="flex items-center justify-between mt-auto pt-2">
                                <div className="flex items-center text-xs font-semibold text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-md">
                                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                  Est: {task.estimated_days ? `${task.estimated_days} days` : "2 days"}
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                  {(!isCompleted) && editingTaskId !== task._id && (
                                    <button onClick={() => startEditingTask(task)} className="p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                  )}
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => setTaskToDelete(task._id)}>
                                        Delete Task
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Delete Task Confirmation */}
      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task from your roadmap.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" size="default">Cancel</AlertDialogCancel>
            <AlertDialogAction size="default" onClick={handleDeleteTask} className=" bg-red-600 text-white hover:bg-red-800">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
