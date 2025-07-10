import { DailyGoal } from "@shared/schema";
import { useApp } from "../../contexts/AppContext";
import { ProgressRing } from "../ui/ProgressRing";
import { Button } from "../ui/button";
import { Plus, Minus, Trophy } from "lucide-react";

interface DailyGoalCardProps {
  goal: DailyGoal;
}

export function DailyGoalCard({ goal }: DailyGoalCardProps) {
  const { incrementGoalCount, decrementGoalCount } = useApp();

  const progress = (goal.currentCount / goal.targetCount) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ProgressRing
            progress={progress}
            size={60}
            strokeWidth={4}
            className="flex-shrink-0"
          >
            <div className="text-center">
              {goal.isCompleted ? (
                <Trophy className="w-5 h-5 text-yellow-500 mx-auto" />
              ) : (
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {goal.currentCount}/{goal.targetCount}
                </span>
              )}
            </div>
          </ProgressRing>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-white">
              {goal.title}
            </h4>
            {goal.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {goal.description}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Progress: {goal.currentCount}/{goal.targetCount}
              </span>
              {goal.isCompleted && (
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Complete! 🎉
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => decrementGoalCount(goal.id)}
            disabled={goal.currentCount === 0}
            className="w-8 h-8"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => incrementGoalCount(goal.id)}
            disabled={goal.currentCount >= goal.targetCount}
            className="w-8 h-8 bg-aqua-500 hover:bg-aqua-600 text-white"
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
