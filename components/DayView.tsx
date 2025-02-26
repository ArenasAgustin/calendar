import { useMemo, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DayViewProps } from "@/utils/interfaces";
import { getDateToString } from "@/utils/functions";

export default function DayView({
  day,
  monthIndex,
  currentYear,
  notes,
  onBack,
  onNoteChange,
}: DayViewProps) {
  const note = useMemo(
    () => notes.find((note) => note.day === day)?.note || "",
    [notes, day]
  );

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onNoteChange(day, e.target.value);
    },
    [day, onNoteChange]
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

        <div className="border rounded-lg p-6 bg-card">
          <Textarea
            placeholder="Add your notes for this day..."
            className="min-h-[400px] resize-none text-base"
            value={note}
            onChange={handleNoteChange}
          />
        </div>
      </div>
    </div>
  );
}
