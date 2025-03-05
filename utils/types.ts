export type DayNote = {
  day: number;
  month?: number | null;
  year?: number;
  note: string;
};

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
  | { type: "ADD_NOTE"; payload: DayNote }
  | { type: "DELETE_NOTE"; payload: DayNote }
  | { type: "DELETE_ALL_NOTES" }
  | { type: "SET_NOTES"; payload: DayNote[] };
