import { useCallback, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import Sidebar from "./Sidebar";
import CalendarGrid from "./CalendarGrid";

interface DayNote {
  text: string;
}
interface CalendarState {
  startDate: Date | null;
  endDate: Date | null;
  notes: Record<string, DayNote>;
  generalNote: string;
}

const HERO_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=900&q=80",
  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=900&q=80",
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80",
  "https://images.unsplash.com/photo-1490750967868-88df5691cc94?w=900&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=900&q=80",
  "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=80",
  "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80",
  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=900&q=80",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(day: Date, start: Date, end: Date) {
  const d = day.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return d > s && d < e;
}

function isInRange(day: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return isBetween(day, start, end);
}

function buildGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  let startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) {
    const d = new Date(year, month, 1 - (startDow - i));
    cells.push(d);
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push(new Date(year, month + 1, next++));
  }

  const rows: (Date | null)[][] = [];
  for (let r = 0; r < cells.length / 7; r++)
    rows.push(cells.slice(r * 7, r * 7 + 7));
  return rows;
}

function SpiralRings() {
  return (
    <div className="flex items-center justify-center gap-[5px] py-3 bg-[#e8e8e8]">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="w-[13px] h-[20px] rounded-full border-[3px] border-[#888] bg-transparent"
          style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }}
        />
      ))}
    </div>
  );
}

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [state, setState] = useState<CalendarState>({
    startDate: null,
    endDate: null,
    notes: {},
    generalNote: "",
  });
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [noteInput, setNoteInput] = useState("");
  const [activeNoteDay, setActiveNoteDay] = useState<string | null>(null);

  const heroImg = HERO_IMAGES[viewMonth];
  const grid = buildGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDayClick = useCallback((day: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    setState((prev) => {
      // If no start date set, set start and switch to selecting end
      if (!prev.startDate || (prev.startDate && prev.endDate)) {
        setSelecting("end");
        return { ...prev, startDate: day, endDate: null };
      }

      // otherwise set end date (sort to ensure start <= end)
      const start = prev.startDate!;
      const [s, e] = [start, day].sort((a, b) => a.getTime() - b.getTime());
      setSelecting("start");
      return { ...prev, startDate: s, endDate: e };
    });
  }, []);

  const getDayClasses = (day: Date, isCurrentMonth: boolean): string => {
    const base =
      "relative flex items-center justify-center text-xs font-medium select-none transition-all duration-150 ";
    if (!isCurrentMonth) return base + "text-gray-300 cursor-default";

    const isSat = (day.getDay() + 6) % 7 === 5;
    const isSun = (day.getDay() + 6) % 7 === 6;
    const isToday = isSameDay(day, today);
    const isStart = state.startDate && isSameDay(day, state.startDate);
    const isEnd = state.endDate && isSameDay(day, state.endDate);
    const inRange = isInRange(day, state.startDate, state.endDate);
    const hasNote = !!state.notes[dateKey(day)];

    let cls = base + "cursor-pointer rounded-full w-7 h-7 ";

    if (isStart || isEnd) {
      cls += "bg-[#1a6bbf] text-white font-bold shadow-md ";
    } else if (inRange) {
      cls += "bg-[#d0e8f7] text-[#1a6bbf] rounded-none ";
    } else if (isToday) {
      cls += "ring-2 ring-[#1a6bbf] text-[#1a6bbf] font-bold ";
    } else if (isSat || isSun) {
      cls += "text-[#1a6bbf] hover:bg-[#e8f4fb] ";
    } else {
      cls += "text-[#333] hover:bg-gray-100 ";
    }

    if (hasNote)
      cls +=
        "after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#f59e0b] ";

    return cls;
  };

  const getRangeWrapClass = (day: Date, isCurrentMonth: boolean): string => {
    if (!isCurrentMonth || !state.startDate || !state.endDate) return "";
    const inRange = isInRange(day, state.startDate, state.endDate);
    const isStart = isSameDay(day, state.startDate!);
    const isEnd = isSameDay(day, state.endDate!);
    if (isStart) return "bg-[#d0e8f7] rounded-l-full";
    if (isEnd) return "bg-[#d0e8f7] rounded-r-full";
    if (inRange) return "bg-[#d0e8f7]";
    return "";
  };

  const saveNote = () => {
    if (!activeNoteDay) return;
    setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [activeNoteDay]: { text: noteInput } },
    }));
    setNoteInput("");
    setActiveNoteDay(null);
  };

  const rangeLabel = () => {
    if (!state.startDate) return "Click a day to start selection";
    if (!state.endDate)
      return `From ${state.startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} — click end date`;
    return `${state.startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} → ${state.endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  };

  return (
    <div
      className="min-h-screen bg-[#d0d0d0] flex items-center justify-center p-4 sm:p-8"
      style={{
        fontFamily: "'Georgia', serif",
        background:
          "radial-gradient(ellipse at center, #c8c8c8 0%, #a0a0a0 100%)",
      }}
    >
      <div
        className="w-full max-w-[560px] bg-white rounded-sm overflow-hidden"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
          transform: "perspective(1200px) rotateX(1deg)",
        }}
      >
        <SpiralRings />

        <CalendarHeader
          viewMonth={viewMonth}
          viewYear={viewYear}
          heroImg={heroImg}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />

        <div className="flex flex-col sm:flex-row">
          <Sidebar
            state={state}
            setState={setState}
            rangeLabel={rangeLabel}
            activeNoteDay={activeNoteDay}
            setActiveNoteDay={setActiveNoteDay}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            saveNote={saveNote}
          />

          <CalendarGrid
            grid={grid}
            viewMonth={viewMonth}
            getDayClasses={getDayClasses}
            getRangeWrapClass={getRangeWrapClass}
            handleDayClick={handleDayClick}
            state={state}
            setActiveNoteDay={setActiveNoteDay}
            setNoteInput={setNoteInput}
            dateKey={dateKey}
          />
        </div>
        <div className="bg-[#1a6bbf] h-1.5 w-full" />
      </div>
    </div>
  );
}
