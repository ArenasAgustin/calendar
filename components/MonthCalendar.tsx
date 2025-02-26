// import { useMemo } from "react";

interface MonthCalendarProps {
  monthIndex: number;
  currentYear: number;
  large?: boolean;
  isExpandedDay: boolean;
  selectedDay: number | null;
  setIsExpandedDay: (isExpanded: boolean) => void;
  setSelectedDay: (day: number | null) => void;
  generateMonthDays: (
    monthIndex: number,
    currentYear: number
  ) => { day: number | string; isCurrentMonth: boolean; isToday?: boolean }[];
  getNote: (day: number) => string;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Obtiene la cantidad de días en el mes
// const getDaysInMonth = (month: number, year: number) =>
//   new Date(year, month + 1, 0).getDate();

// // Obtiene el primer día del mes (0 = Domingo, 1 = Lunes, etc.)
// const getFirstDayOfMonth = (month: number, year: number) =>
//   new Date(year, month, 1).getDay();

// // Verifica si un día es el día actual
// const isToday = (day: number, month: number, year: number) => {
//   const today = new Date();
//   return (
//     day === today.getDate() &&
//     month === today.getMonth() &&
//     year === today.getFullYear()
//   );
// };

export default function MonthCalendar({
  monthIndex,
  currentYear,
  large = false,
  selectedDay,
  isExpandedDay,
  setIsExpandedDay,
  setSelectedDay,
  generateMonthDays,
  getNote,
}: MonthCalendarProps) {
  // const monthDays = useMemo(() => {
  //   const daysInMonth = getDaysInMonth(monthIndex, currentYear);
  //   const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
  //   const days = [];

  //   // Días del mes anterior para alinear la cuadrícula
  //   const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
  //   for (let i = 0; i < prevMonthDays; i++) {
  //     days.push({ day: "", isCurrentMonth: false });
  //   }

  //   // Días del mes actual
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     days.push({
  //       day: i,
  //       isCurrentMonth: true,
  //       isToday: isToday(i, monthIndex, currentYear),
  //     });
  //   }

  //   // Rellenar con días del siguiente mes hasta completar 42 celdas (6 filas)
  //   while (days.length < 42) {
  //     days.push({ day: "", isCurrentMonth: false });
  //   }

  //   return days;
  // }, [monthIndex, currentYear]);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setIsExpandedDay(true);
  };

  return (
    // <div className={`p-4 border rounded-lg ${large ? "w-full" : ""}`}>
    //   <h2 className="font-medium text-2xl mb-6 text-center">
    //     {new Date(currentYear, monthIndex).toLocaleString("default", {
    //       month: "long",
    //     })}
    //   </h2>
    //   <div className="grid grid-cols-7 gap-2 text-center text-sm">
    //     {weekDays.map((day) => (
    //       <div
    //         key={day}
    //         className="text-muted-foreground uppercase text-xs font-medium"
    //       >
    //         {day}
    //       </div>
    //     ))}
    //     {monthDays.map((day, index) => (
    //       <div
    //         key={index}
    //         className={`min-h-[80px] flex flex-col items-center justify-start p-2 rounded-lg
    //           ${
    //             day.isCurrentMonth
    //               ? "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
    //               : "text-gray-400"
    //           }
    //           ${day.isToday ? "bg-blue-500 text-white font-bold" : ""}
    //         `}
    //         onClick={() =>
    //           day.isCurrentMonth &&
    //           onSelectDay &&
    //           onSelectDay(day.day as number)
    //         }
    //       >
    //         {day.day}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className={`p-4 ${large ? "w-full" : "border rounded-lg"}`}>
      <h2 className={`font-medium ${large ? "text-2xl mb-6" : "mb-4"}`}>
        {new Date(currentYear, monthIndex).toLocaleString("en", {
          month: "long",
        })}
      </h2>
      <div
        className={`grid grid-cols-7 ${
          large ? "gap-4" : "mgap-1 text-center text-sm"
        }`}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            className={`text-muted-foreground uppercase${
              large ? "text-sm font-medium text-center" : " text-xs py-1"
            }`}
          >
            {day.slice(0, 1)}
          </div>
        ))}
        {generateMonthDays(monthIndex, currentYear).map((day, index) => {
          if (large) {
            return (
              <div
                key={index}
                className={`
                min-h-[120px] p-2 border rounded-lg
                ${!day.isCurrentMonth ? "bg-gray-100 dark:bg-gray-800/50" : ""}
                ${day.isToday ? "border-aqua-light" : ""}
                ${day.isCurrentMonth ? "cursor-pointer hover:border-aqua" : ""}
                ${
                  selectedDay === day.day && !isExpandedDay
                    ? "border-aqua border-2"
                    : ""
                }
              `}
                onClick={() =>
                  day.isCurrentMonth && handleDayClick(day.day as number)
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
                {day.isCurrentMonth &&
                  !isExpandedDay &&
                  getNote(day.day as number) && (
                    <p className="text-xs text-muted-foreground line-clamp-4">
                      {getNote(day.day as number)}
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
