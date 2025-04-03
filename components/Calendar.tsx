"use client";

import { useReducer, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import MonthCalendar from "@/components/MonthCalendar";
import ModalMonth from "@/components/ModalMonth";
import ModalNote from "@/components/ModalNote";
import { Button } from "@/components/ui/button";
import { calendarReducer, fetchNotes } from "@/utils/functions";

export default function Calendar({ initialYear }: { initialYear: number }) {
  const router = useRouter();

  const initialState = {
    currentYear: initialYear,
    selectedMonth: null,
    selectedDay: null,
    isMonthModalOpen: false,
    isAddNoteModalOpen: false,
    isExpandedDay: false,
    notes: [],
  };

  const [state, dispatch] = useReducer(calendarReducer, initialState);

  useEffect(() => {
    fetchNotes(dispatch);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarNotes", btoa(JSON.stringify(state.notes)));
  }, [state.notes]);

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
        <Button
          className="bg-aqua hover:bg-aqua/90 text-gray-800"
          onClick={() => dispatch({ type: "OPEN_MODAL_NOTE" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add note
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
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

      <ModalMonth stateGlobal={state} dispatchGlobal={dispatch} />

      <ModalNote
        stateGlobal={state}
        dispatchGlobal={dispatch}
        currentYear={state.currentYear}
      />
    </div>
  );
}
