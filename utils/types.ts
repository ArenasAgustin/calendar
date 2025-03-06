export type DayNote = {
  day: number | string | null;
  month?: number | string | null;
  year?: number | string | null;
  note: string;
};

export type CalendarState = {
  currentYear: number;
  selectedMonth: number | null;
  selectedDay: number | null;
  isMonthModalOpen: boolean;
  isAddNoteModalOpen: boolean;
  isExpandedDay: boolean;
  notes: DayNote[];
};

export type Action =
  | { type: "SET_YEAR"; payload: number }
  | { type: "SELECT_MONTH"; payload: number }
  | { type: "CLOSE_MODAL_MONTH" }
  | { type: "CLOSE_MODAL_NOTE" }
  | { type: "OPEN_MODAL_NOTE" }
  | { type: "SELECT_DAY"; payload: number }
  | { type: "BACK_TO_MONTH" }
  | { type: "ADD_NOTE"; payload: DayNote }
  | { type: "DELETE_NOTE"; payload: DayNote }
  | { type: "DELETE_ALL_NOTES" }
  | { type: "SET_NOTES"; payload: DayNote[] }
  | { type: "SET_MONTH"; payload: number }
  | { type: "SET_DAY"; payload: number }
  | { type: "SET_YEAR"; payload: number }
  | { type: "SET_NOTE"; payload: string };
