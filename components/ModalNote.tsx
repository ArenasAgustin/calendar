import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { months } from "@/utils/constants";
import { noteReducer, generateDayOptions } from "@/utils/functions";
import { Action, CalendarState } from "@/utils/types";

export default function ModalNote({
  stateGlobal,
  dispatchGlobal,
  currentYear,
}: {
  stateGlobal: CalendarState;
  dispatchGlobal: React.Dispatch<Action>;
  currentYear: number;
}) {
  const initialState = {
    month: null,
    day: null,
    year: currentYear,
    note: "",
  };

  const [state, dispatch] = useReducer(noteReducer, initialState);

  return (
    <Dialog
      open={stateGlobal.isAddNoteModalOpen}
      onOpenChange={() => dispatchGlobal({ type: "CLOSE_MODAL_NOTE" })}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select
                value={state.month ? state.month.toString() : ""}
                onValueChange={(value) =>
                  dispatch({ type: "SET_MONTH", payload: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={state.day ? state.day.toString() : ""}
                onValueChange={(value) =>
                  dispatch({ type: "SET_DAY", payload: Number(value) })
                }
                disabled={!state.month || !state.year}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {generateDayOptions(state.month, state.year).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={state.year ? state.year.toString() : ""}
              onChange={(e) =>
                dispatch({ type: "SET_YEAR", payload: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Event description..."
              value={state.note}
              onChange={(e) =>
                dispatch({ type: "SET_NOTE", payload: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-aqua hover:bg-aqua/90 text-gray-800"
            onClick={() => {
              dispatchGlobal({ type: "ADD_NOTE", payload: state });
              dispatchGlobal({ type: "CLOSE_MODAL_NOTE" });
            }}
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
