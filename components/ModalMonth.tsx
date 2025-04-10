import Image from "next/image";
import DayView from "@/components/DayView";
import MonthCalendar from "@/components/MonthCalendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Action, CalendarState } from "@/utils/types";

export default function ModalMonth({
  stateGlobal,
  dispatchGlobal,
}: {
  stateGlobal: CalendarState;
  dispatchGlobal: React.Dispatch<Action>;
}) {
  return (
    <Dialog
      open={stateGlobal.isMonthModalOpen}
      onOpenChange={() => dispatchGlobal({ type: "CLOSE_MODAL_MONTH" })}
    >
      <DialogContent className="max-w-full lg:max-w-7xl p-0 h-auto max-h-screen">
        <div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 grid-flow-dense h-full max-h-screen">
          <div className="relative h-full max-h-[800px] bg-muted">
            <Image
              src="https://v0.dev/placeholder.svg"
              alt="Month illustration"
              fill
              className="object-cover h-full"
            />
          </div>
          <div className="h-full max-h-[800px] overflow-y-auto">
            {stateGlobal.selectedMonth !== null &&
              !stateGlobal.isExpandedDay && (
                <MonthCalendar
                  monthIndex={stateGlobal.selectedMonth}
                  currentYear={stateGlobal.currentYear}
                  notes={stateGlobal.notes}
                  onSelectDay={(day) =>
                    dispatchGlobal({ type: "SELECT_DAY", payload: day })
                  }
                  large
                />
              )}
            {stateGlobal.selectedMonth !== null &&
              stateGlobal.isExpandedDay &&
              stateGlobal.selectedDay !== null && (
                <DayView
                  day={stateGlobal.selectedDay}
                  monthIndex={stateGlobal.selectedMonth}
                  currentYear={stateGlobal.currentYear}
                  notes={stateGlobal.notes}
                  onBack={() => dispatchGlobal({ type: "BACK_TO_MONTH" })}
                />
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
