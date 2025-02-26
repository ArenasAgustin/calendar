import { useMemo } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { weekDays } from "@/utils/constants";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isToday,
  getDateToString,
} from "@/utils/functions";
import { MonthCalendarProps } from "@/utils/interfaces";

export default function MonthCalendar({
  monthIndex,
  currentYear,
  large = false,
  notes = [],
  onSelectDay,
}: MonthCalendarProps) {
  const monthDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(monthIndex, currentYear);
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
    const days = [];

    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < prevMonthDays; i++) {
      days.push({ day: "", isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: isToday(i, monthIndex, currentYear),
      });
    }

    while (days.length < 42) {
      days.push({ day: "", isCurrentMonth: false });
    }

    return days;
  }, [monthIndex, currentYear]);

  const notesMap = useMemo(() => {
    return new Map(notes.map((note) => [note.day, note.note]));
  }, [notes]);

  const montString = getDateToString("month", currentYear, monthIndex);

  return (
    <div className={`p-4 ${large ? "w-full" : "border rounded-lg"}`}>
      {!large && (
        <h2 className={`font-medium ${large ? "text-2xl mb-6" : "mb-4"}`}>
          {montString}
        </h2>
      )}
      {large && (
        <DialogTitle
          className={`font-medium ${large ? "text-2xl mb-6" : "mb-4"}`}
        >
          {montString}
        </DialogTitle>
      )}
      <div
        className={`grid grid-cols-7 ${
          large ? "gap-4" : "gap-1 text-center text-sm"
        }`}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground uppercase text-xs font-medium text-center"
          >
            {day}
          </div>
        ))}
        {monthDays.map((day, index) => {
          if (large) {
            return (
              <div
                key={index}
                className={`
                min-h-[120px] p-2 border rounded-lg
                ${day.isToday ? "border-aqua-light" : ""}
                ${
                  day.isCurrentMonth
                    ? "cursor-pointer hover:border-aqua"
                    : "bg-gray-100 dark:bg-gray-800/50"
                }
              `}
                onClick={() =>
                  day.isCurrentMonth && onSelectDay(day.day as number)
                }
              >
                <div
                  className={`
                text-right text-sm mb-2 font-medium
                ${day.isToday ? "text-aqua" : ""}
              `}
                >
                  {day.day}
                </div>
                {day.isCurrentMonth && notesMap.has(day.day as number) && (
                  <p className="text-xs text-muted-foreground line-clamp-4">
                    {notesMap.get(day.day as number)}
                  </p>
                )}
              </div>
            );
          }
          return (
            <div
              key={index}
              className={`
                py-1 text-sm
                ${!day.isCurrentMonth ? "text-muted-foreground/40" : ""}
                ${
                  day.isToday
                    ? "bg-aqua-light text-gray-800 rounded-full font-medium"
                    : ""
                }
                ${
                  day.isCurrentMonth && !day.isToday
                    ? "hover:bg-muted rounded-full"
                    : ""
                }
              `}
            >
              {day.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
