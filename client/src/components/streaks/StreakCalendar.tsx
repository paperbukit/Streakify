import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function StreakCalendar() {
  const { streakEntries } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getStreakData = (date: Date) => {
    const dateString = getDateString(date);
    return streakEntries.find(entry => 
      getDateString(entry.date) === dateString
    );
  };

  const getDayClassName = (date: Date) => {
    const streakData = getStreakData(date);
    const isToday = getDateString(date) === getDateString(today);
    const isCurrentMonth = date.getMonth() === month;
    const hasActivity = streakData?.hasActivity;

    return cn(
      "aspect-square flex items-center justify-center text-sm rounded-lg font-medium transition-colors",
      {
        "text-gray-400 dark:text-gray-600": !isCurrentMonth,
        "text-gray-700 dark:text-gray-300": isCurrentMonth && !hasActivity,
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400": hasActivity && !isToday,
        "bg-aqua-500 text-white": isToday,
        "bg-gray-100 dark:bg-gray-800": !hasActivity && isCurrentMonth,
      }
    );
  };

  const generateCalendarDays = () => {
    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-aqua-200 dark:border-gray-700 p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Streak Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[8rem] text-center">
            {monthNames[month]} {year}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((date) => (
          <div key={date.toISOString()} className={getDayClassName(date)}>
            {date.getDate()}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Streak Day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-aqua-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
          <p className="text-2xl font-bold text-aqua-600 dark:text-aqua-400">
            {useApp().profile?.currentStreak || 0} days
          </p>
        </div>
      </div>
    </div>
  );
}
