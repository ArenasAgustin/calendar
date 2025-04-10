import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayViewProps } from "@/utils/interfaces";
import { getDateToString } from "@/utils/functions";

export default function DayView({
  day,
  monthIndex,
  currentYear,
  notes,
  onBack,
}: DayViewProps) {
  const notesDay = useMemo(
    () => notes.filter((note) => note.day === day),
    [notes, day]
  );

  return (
    <div className="p-6 w-full">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to {getDateToString("month", currentYear, monthIndex)}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-medium">
          {getDateToString("long", currentYear, monthIndex, day)}
        </h2>

        {notesDay.map((note, index) => (
          <div className="border rounded-lg p-6 bg-card text-base" key={index}>
            {note.note}
          </div>
        ))}
      </div>
    </div>
  );
}
