import { Action, CalendarState } from "@/utils/types";
import { TypeConfigDateToString } from "@/utils/interfaces";

export const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (month: number, year: number) =>
  new Date(year, month, 1).getDay();

export const isToday = (day: number, month: number, year: number) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
};

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
    case "CLOSE_MODAL":
      return { ...state, isMonthModalOpen: false };
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
