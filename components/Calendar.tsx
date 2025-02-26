"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import Image from "next/image";
// import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import DayView from "@/components/DayView";
import MonthCalendar from "@/components/MonthCalendar";

type DayNote = {
  day: number;
  note: string;
};

interface CalendarProps {
  initialYear: number;
}

export default function Calendar({ initialYear }: CalendarProps) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [notes, setNotes] = useState<DayNote[]>([]);
  const [isExpandedDay, setIsExpandedDay] = useState(false);

  useEffect(() => {
    router.push(`/${currentYear}`);
  }, [currentYear, router]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const isToday = (day: number, month: number, year: number) => {
    return day === todayDay && month === todayMonth && year === todayYear;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthDays = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Previous month days
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({ day: "", isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: isToday(i, month, year),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: "", isCurrentMonth: false });
    }

    return days;
  };

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setIsMonthModalOpen(true);
    setSelectedDay(null);
    setIsExpandedDay(false);
  };

  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  // const handleDayClick = (day: number) => {
  //   setSelectedDay(day);
  //   setIsExpandedDay(true);
  // };

  // const handleBackToMonth = () => {
  //   setIsExpandedDay(false);
  //   setSelectedDay(null);
  // };

  // const handleNoteChange = (day: number, note: string) => {
  //   setNotes((prevNotes) => {
  //     const existingNoteIndex = prevNotes.findIndex((n) => n.day === day);
  //     if (existingNoteIndex >= 0) {
  //       const newNotes = [...prevNotes];
  //       newNotes[existingNoteIndex] = { day, note };
  //       return newNotes;
  //     }
  //     return [...prevNotes, { day, note }];
  //   });
  // };

  const getNote = (day: number) => {
    return notes.find((note) => note.day === day)?.note || "";
  };

  // const DayView = ({
  //   day,
  //   monthIndex,
  // }: {
  //   day: number;
  //   monthIndex: number;
  // }) => (
  //   <div className="p-6 w-full">
  //     <div className="flex items-center gap-4 mb-6">
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         className="gap-2"
  //         onClick={handleBackToMonth}
  //       >
  //         <ArrowLeft className="h-4 w-4" />
  //         Back to {months[monthIndex]}
  //       </Button>
  //     </div>
  //     <div className="space-y-4">
  //       <h2 className="text-2xl font-medium">
  //         {months[monthIndex]} {day}, {currentYear}
  //       </h2>
  //       <div className="border rounded-lg p-6 bg-card">
  //         <Textarea
  //           placeholder="Add your notes for this day..."
  //           className="min-h-[400px] resize-none text-base"
  //           value={getNote(day)}
  //           onChange={(e) => handleNoteChange(day, e.target.value)}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  // const MonthCalendar = ({
  //   monthIndex,
  //   large = false,
  // }: {
  //   monthIndex: number;
  //   large?: boolean;
  // }) => {
  //   if (large) {
  //     return (
  //       <div className="p-6 w-full">
  //         <h2 className="font-medium text-2xl mb-6">{months[monthIndex]}</h2>
  //         <div className="grid grid-cols-7 gap-4">
  //           {weekDays.map((day) => (
  //             <div
  //               key={day}
  //               className="text-muted-foreground uppercase text-sm font-medium text-center"
  //             >
  //               {day}
  //             </div>
  //           ))}
  //           {generateMonthDays(monthIndex, currentYear).map((day, index) => (
  //             <div
  //               key={index}
  //               className={`
  //                 min-h-[120px] p-2 border rounded-lg
  //                 ${
  //                   !day.isCurrentMonth ? "bg-gray-100 dark:bg-gray-800/50" : ""
  //                 }
  //                 ${day.isToday ? "border-aqua-light" : ""}
  //                 ${
  //                   day.isCurrentMonth ? "cursor-pointer hover:border-aqua" : ""
  //                 }
  //                 ${
  //                   selectedDay === day.day && !isExpandedDay
  //                     ? "border-aqua border-2"
  //                     : ""
  //                 }
  //               `}
  //               onClick={() =>
  //                 day.isCurrentMonth && handleDayClick(day.day as number)
  //               }
  //             >
  //               <div
  //                 className={`
  //                 text-right text-sm mb-2 font-medium
  //                 ${day.isToday ? "text-aqua" : ""}
  //               `}
  //               >
  //                 {day.day}
  //               </div>
  //               {day.isCurrentMonth &&
  //                 !isExpandedDay &&
  //                 getNote(day.day as number) && (
  //                   <p className="text-xs text-muted-foreground line-clamp-4">
  //                     {getNote(day.day as number)}
  //                   </p>
  //                 )}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="p-4 border rounded-lg">
  //       <h2 className="font-medium mb-4">{months[monthIndex]}</h2>
  //       <div className="grid grid-cols-7 gap-1 text-center text-sm">
  //         {weekDays.map((day) => (
  //           <div
  //             key={day}
  //             className="text-muted-foreground uppercase text-xs py-1"
  //           >
  //             {day.slice(0, 1)}
  //           </div>
  //         ))}
  //         {generateMonthDays(monthIndex, currentYear).map((day, index) => (
  //           <div
  //             key={index}
  //             className={`
  //               py-1 text-sm
  //               ${!day.isCurrentMonth ? "text-muted-foreground/40" : ""}
  //               ${
  //                 day.isToday
  //                   ? "bg-aqua-light text-gray-800 rounded-full font-medium"
  //                   : ""
  //               }
  //               ${
  //                 day.isCurrentMonth && !day.isToday
  //                   ? "hover:bg-muted rounded-full"
  //                   : ""
  //               }
  //             `}
  //           >
  //             {day.day}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousYear}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold min-w-[4.5rem] text-center">
            {currentYear}
          </h1>
          <Button variant="outline" size="icon" onClick={handleNextYear}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button className="bg-aqua hover:bg-aqua/90 text-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add event
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month, monthIndex) => (
          <div
            key={month}
            onClick={() => handleMonthClick(monthIndex)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <MonthCalendar
              monthIndex={monthIndex}
              currentYear={currentYear}
              setIsExpandedDay={setIsExpandedDay}
              setSelectedDay={setSelectedDay}
              getNote={getNote}
              isExpandedDay={isExpandedDay}
              selectedDay={selectedDay}
              generateMonthDays={generateMonthDays}
            />
          </div>
        ))}
      </div>

      <Dialog open={isMonthModalOpen} onOpenChange={setIsMonthModalOpen}>
        <DialogContent className="max-w-7xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-[800px] bg-muted">
              <Image
                src="https://v0.dev/placeholder.svg"
                alt="Month illustration"
                fill
                className="object-cover"
              />
            </div>
            <div className="h-[800px] overflow-y-auto">
              {selectedMonth !== null && !isExpandedDay && (
                <MonthCalendar
                  monthIndex={selectedMonth}
                  large
                  currentYear={currentYear}
                  isExpandedDay={isExpandedDay}
                  selectedDay={selectedDay}
                  setIsExpandedDay={setIsExpandedDay}
                  setSelectedDay={setSelectedDay}
                  getNote={getNote}
                  generateMonthDays={generateMonthDays}
                />
              )}
              {selectedMonth !== null && isExpandedDay && selectedDay && (
                <DayView
                  day={selectedDay}
                  monthIndex={selectedMonth}
                  currentYear={currentYear}
                  notes={notes}
                  setIsExpandedDay={setIsExpandedDay}
                  setSelectedDay={setSelectedDay}
                  setNotes={setNotes}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
