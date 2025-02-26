export type DayNote = { day: number; note: string };

export type CalendarState = {
  currentYear: number;
  selectedMonth: number | null;
  selectedDay: number | null;
  isMonthModalOpen: boolean;
  isExpandedDay: boolean;
  notes: DayNote[];
};

export type Action =
  | { type: "SET_YEAR"; payload: number }
  | { type: "SELECT_MONTH"; payload: number }
  | { type: "CLOSE_MODAL" }
  | { type: "SELECT_DAY"; payload: number }
  | { type: "BACK_TO_MONTH" }
  | { type: "ADD_NOTE"; payload: DayNote };
