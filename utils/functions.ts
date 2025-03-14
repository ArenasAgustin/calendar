import { TypeConfigDateToString } from "@/utils/interfaces";
import { Action, CalendarState, DayNote } from "@/utils/types";

export function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(month: number, year: number): number {
  const date = new Date(year, month, 1);
  return date.getDay() ?? 0;
}

export function generateDayOptions(
  month?: number | string | null,
  year?: number | string | null
) {
  if (!month || !year) return [];

  const daysInMonth = getDaysInMonth(
    Number.parseInt(month.toString()),
    Number.parseInt(year.toString())
  );
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

export function isToday(day: number, month: number, year: number) {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

export function calendarReducer(
  state: CalendarState,
  action: Action
): CalendarState {
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
    case "CLOSE_MODAL_MONTH":
      return { ...state, isMonthModalOpen: false };
    case "CLOSE_MODAL_NOTE":
      return { ...state, isAddNoteModalOpen: false };
    case "OPEN_MODAL_NOTE":
      return { ...state, isAddNoteModalOpen: true };
    case "SELECT_DAY":
      return { ...state, selectedDay: action.payload, isExpandedDay: true };
    case "BACK_TO_MONTH":
      return { ...state, isExpandedDay: false, selectedDay: null };
    case "ADD_NOTE":
      const newNote = {
        ...action.payload,
        month: action.payload.month ?? state.selectedMonth,
        year: action.payload.year ?? state.currentYear,
      };

      return {
        ...state,
        notes: state.notes.some(
          (n) =>
            n.day === newNote.day &&
            n.month === newNote.month &&
            n.year === newNote.year
        )
          ? state.notes.map((n) =>
              n.day === newNote.day &&
              n.month === newNote.month &&
              n.year === newNote.year
                ? newNote
                : n
            )
          : [...state.notes, newNote],
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter(
          (n) =>
            n.day !== action.payload.day ||
            n.month !== action.payload.month ||
            n.year !== action.payload.year
        ),
      };
    case "DELETE_ALL_NOTES":
      return { ...state, notes: [] };
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    default:
      return state;
  }
}

export function noteReducer(state: DayNote, action: Action): DayNote {
  switch (action.type) {
    case "SET_MONTH":
      return { ...state, month: action.payload };
    case "SET_DAY":
      return { ...state, day: action.payload };
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_NOTE":
      return { ...state, note: action.payload };
    default:
      return state;
  }
}

export function getDateToString(
  type: string,
  year: number,
  month: number,
  day: number = 1
) {
  let typeConfig: TypeConfigDateToString = {
    month: "long",
  };

  if (type === "long") {
    typeConfig.day = "numeric";
    typeConfig.year = "numeric";
  } else if (type === "month-year") {
    typeConfig.year = "numeric";
  }

  return new Date(year, month, day).toLocaleString("en", typeConfig);
}
