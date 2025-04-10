import { DayNote } from "./types";

export interface MonthCalendarProps {
  monthIndex: number;
  currentYear: number;
  large?: boolean;
  notes?: DayNote[];
  onSelectDay: (day: number) => void;
}

export interface DayViewProps {
  day: number;
  monthIndex: number;
  currentYear: number;
  notes: DayNote[];
  onBack: () => void;
}

export interface TypeConfigDateToString {
  month: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
  day?: "numeric" | "2-digit" | undefined;
  year?: "numeric" | "2-digit" | undefined;
}
