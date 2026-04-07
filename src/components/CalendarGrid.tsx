export default function CalendarGrid({
  grid,
  viewMonth,
  getDayClasses,
  getRangeWrapClass,
  handleDayClick,
  state,
  setActiveNoteDay,
  setNoteInput,
  dateKey,
}: any) {
  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-7 mb-1">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <div
            key={d}
            className={`text-center text-[9px] font-bold tracking-widest pb-1 ${d === "SAT" || d === "SUN" ? "text-[#1a6bbf]" : "text-gray-400"}`}
          >
            {d}
          </div>
        ))}
      </div>

      {grid.map((row: (Date | null)[], ri: number) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((day, ci) => {
            if (!day) return <div key={ci} />;
            const isCurrentMonth = day.getMonth() === viewMonth;
            const key = dateKey(day);
            return (
              <div
                key={ci}
                className={`flex items-center justify-center py-[3px] ${getRangeWrapClass(day, isCurrentMonth)}`}
              >
                <div
                  className={getDayClasses(day, isCurrentMonth)}
                  onClick={() => handleDayClick(day, isCurrentMonth)}
                  onContextMenu={(e) => {
                    if (!isCurrentMonth) return;
                    e.preventDefault();
                    setActiveNoteDay(key);
                    setNoteInput(state.notes[key]?.text ?? "");
                  }}
                  title={
                    isCurrentMonth
                      ? "Click to select • Right-click to add note"
                      : undefined
                  }
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1a6bbf]" />
          <span className="text-[9px] text-gray-400">Start / End</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-[#d0e8f7]" />
          <span className="text-[9px] text-gray-400">Range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full ring-2 ring-[#1a6bbf]" />
          <span className="text-[9px] text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-[9px] text-gray-400">Has note</span>
        </div>
        <span className="text-[9px] text-gray-300 ml-auto hidden sm:block">
          Right-click day → note
        </span>
      </div>
    </div>
  );
}
