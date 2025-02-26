import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useMemo, useCallback } from "react";

type DayNote = { day: number; note: string };

interface DayViewProps {
  day: number;
  monthIndex: number;
  currentYear: number;
  notes: DayNote[];
  onBack: () => void;
  onNoteChange: (day: number, note: string) => void;
}

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
          Back to{" "}
          {new Date(currentYear, monthIndex).toLocaleDateString("en", {
            month: "long",
          })}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-medium">
          {new Date(currentYear, monthIndex, day).toLocaleDateString("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
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
