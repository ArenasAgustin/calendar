"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useReducer, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DayView from "@/components/DayView";
import MonthCalendar from "@/components/MonthCalendar";

type DayNote = { day: number; note: string };

type CalendarState = {
  currentYear: number;
  selectedMonth: number | null;
  selectedDay: number | null;
  isMonthModalOpen: boolean;
  isExpandedDay: boolean;
  notes: DayNote[];
};

type Action =
  | { type: "SET_YEAR"; payload: number }
  | { type: "SELECT_MONTH"; payload: number }
  | { type: "CLOSE_MODAL" }
  | { type: "SELECT_DAY"; payload: number }
  | { type: "BACK_TO_MONTH" }
  | { type: "ADD_NOTE"; payload: DayNote };

function calendarReducer(state: CalendarState, action: Action): CalendarState {
  switch (action.type) {
    case "SET_YEAR":
      return { ...state, currentYear: action.payload };
    case "SELECT_MONTH":
      return {
        ...state,
        selectedMonth: action.payload,
        isMonthModalOpen: true,
        isExpandedDay: false,
      };
    case "CLOSE_MODAL":
      return { ...state, isMonthModalOpen: false };
    case "SELECT_DAY":
      return { ...state, selectedDay: action.payload, isExpandedDay: true };
    case "BACK_TO_MONTH":
      return { ...state, isExpandedDay: false, selectedDay: null };
    case "ADD_NOTE":
      return {
        ...state,
        notes: state.notes.some((n) => n.day === action.payload.day)
          ? state.notes.map((n) =>
              n.day === action.payload.day ? action.payload : n
            )
          : [...state.notes, action.payload],
      };
    default:
      return state;
  }
}

export default function Calendar({ initialYear }: { initialYear: number }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(calendarReducer, {
    currentYear: initialYear,
    selectedMonth: null,
    selectedDay: null,
    isMonthModalOpen: false,
    isExpandedDay: false,
    notes: [],
  });

  useEffect(() => {
    router.push(`/${state.currentYear}`);
  }, [state.currentYear, router]);

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              dispatch({ type: "SET_YEAR", payload: state.currentYear - 1 })
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold min-w-[4.5rem] text-center">
            {state.currentYear}
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              dispatch({ type: "SET_YEAR", payload: state.currentYear + 1 })
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button className="bg-aqua hover:bg-aqua/90 text-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add event
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => dispatch({ type: "SELECT_MONTH", payload: index })}
          >
            <MonthCalendar
              monthIndex={index}
              currentYear={state.currentYear}
              onSelectDay={(day) =>
                dispatch({ type: "SELECT_DAY", payload: day })
              }
            />
          </div>
        ))}
      </div>

      <Dialog
        open={state.isMonthModalOpen}
        onOpenChange={() => dispatch({ type: "CLOSE_MODAL" })}
      >
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
              {state.selectedMonth !== null && !state.isExpandedDay && (
                <MonthCalendar
                  monthIndex={state.selectedMonth}
                  currentYear={state.currentYear}
                  notes={state.notes}
                  onSelectDay={(day) =>
                    dispatch({ type: "SELECT_DAY", payload: day })
                  }
                  large
                />
              )}
              {state.selectedMonth !== null &&
                state.isExpandedDay &&
                state.selectedDay !== null && (
                  <DayView
                    day={state.selectedDay}
                    monthIndex={state.selectedMonth}
                    currentYear={state.currentYear}
                    notes={state.notes}
                    onBack={() => dispatch({ type: "BACK_TO_MONTH" })}
                    onNoteChange={(day, note) =>
                      dispatch({
                        type: "ADD_NOTE",
                        payload: { day: state.selectedDay!, note },
                      })
                    }
                  />
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
