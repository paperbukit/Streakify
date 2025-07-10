import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  iconColor?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  progress,
  iconColor = "from-aqua-400 to-aqua-600",
  className = ""
}: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={cn(
          "w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center",
          iconColor
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
      
      {progress && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-600 dark:text-gray-400">
              {progress.current}/{progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="level-progress h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
