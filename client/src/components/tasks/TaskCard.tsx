import { Task, TaskPriority } from "@shared/schema";
import { useApp } from "../../contexts/AppContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Plus, Minus, Check, Calendar, Trophy } from "lucide-react";
import { cn } from "../../lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { completeTask, incrementTaskCount, decrementTaskCount } = useApp();

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case TaskPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case TaskPriority.LOW:
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.isCompleted;

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 card-hover",
      task.isCompleted 
        ? "opacity-60 border-green-200 dark:border-green-800" 
        : "border-aqua-200 dark:border-gray-700",
      isOverdue && "border-red-200 dark:border-red-800"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className={cn(
            "font-semibold text-gray-800 dark:text-white mb-2",
            task.isCompleted && "line-through"
          )}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {task.description}
            </p>
          )}
          <div className="flex items-center space-x-2 mb-3">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {task.isCompleted ? (
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        ) : task.hasQuantity ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => decrementTaskCount(task.id)}
              disabled={task.currentCount === 0}
              className="w-8 h-8"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">
              {task.currentCount}/{task.targetCount}
            </span>
            <Button
              onClick={() => incrementTaskCount(task.id)}
              disabled={task.currentCount >= task.targetCount}
              className="w-8 h-8 bg-aqua-500 hover:bg-aqua-600 text-white"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => completeTask(task.id)}
            variant="outline"
            size="icon"
            className="w-8 h-8"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>

      {task.hasQuantity && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-600 dark:text-gray-400">
              {task.currentCount} of {task.targetCount} complete
            </span>
          </div>
          <Progress 
            value={(task.currentCount / task.targetCount) * 100} 
            className="h-2"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {task.dueDate && (
            <div className={cn(
              "flex items-center space-x-1",
              isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
            )}>
              <Calendar className="w-4 h-4" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-aqua-600 dark:text-aqua-400">
          <Trophy className="w-4 h-4" />
          <span>+{task.xpReward} XP</span>
        </div>
      </div>
    </div>
  );
}
