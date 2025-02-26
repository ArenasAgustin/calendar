import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

type DayNote = { day: number; note: string };

interface DayViewProps {
  day: number;
  monthIndex: number;
  currentYear: number;
  notes: DayNote[];
  setIsExpandedDay: (isExpanded: boolean) => void;
  setSelectedDay: (day: number | null) => void;
  setNotes: (notes: DayNote[] | ((prevNotes: DayNote[]) => DayNote[])) => void;
}

export default function DayView({
  day,
  monthIndex,
  currentYear,
  notes,
  setIsExpandedDay,
  setSelectedDay,
  setNotes,
}: DayViewProps) {
  const handleNoteChange = (day: number, note: string) => {
    setNotes((prevNotes: DayNote[]) => {
      const existingNoteIndex = prevNotes.findIndex((n) => n.day === day);
      if (existingNoteIndex >= 0) {
        const newNotes = [...prevNotes];
        newNotes[existingNoteIndex] = { day, note };
        return newNotes;
      }
      return [...prevNotes, { day, note }];
    });
  };

  const getNote = (day: number) => {
    return notes.find((note) => note.day === day)?.note || "";
  };

  const handleBackToMonth = () => {
    setIsExpandedDay(false);
    setSelectedDay(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleBackToMonth}
        >
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
            value={getNote(day)}
            onChange={(e) => handleNoteChange(day, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
