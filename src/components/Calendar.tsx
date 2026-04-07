"use client";

import { useState, useCallback } from "react";

interface DayNote {
  text: string;
}

interface CalendarState {
  startDate: Date | null;
  endDate: Date | null;
  notes: Record<string, DayNote>;
  generalNote: string;
}

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
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

  const handleDayClick = useCallback(
    (day: Date, isCurrentMonth: boolean) => {
      if (!isCurrentMonth) return;
      setState((prev) => {
        if (selecting === "start" || (prev.startDate && prev.endDate)) {
          setSelecting("end");
          return { ...prev, startDate: day, endDate: null };
        } else {
          setSelecting("start");
          const [s, e] = [prev.startDate!, day].sort(
            (a, b) => a.getTime() - b.getTime(),
          );
          return { ...prev, startDate: s, endDate: e };
        }
      });
    },
    [selecting],
  );

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

  const getRangeWrapClass = (
    day: Date,
    isCurrentMonth: boolean,
    colIdx: number,
  ): string => {
    if (!isCurrentMonth || !state.startDate || !state.endDate) return "";
    const inRange = isInRange(day, state.startDate, state.endDate);
    const isStart = isSameDay(day, state.startDate);
    const isEnd = isSameDay(day, state.endDate);
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

        <div
          className="relative w-full overflow-hidden"
          style={{ height: "260px" }}
        >
          <img
            src={heroImg}
            alt={MONTH_NAMES[viewMonth]}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ objectPosition: "center 40%" }}
          />
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 0 90px 200px",
              borderColor: "transparent transparent #1a6bbf transparent",
            }}
          />
          <div className="absolute bottom-3 right-4 text-right text-white leading-tight z-10">
            <div className="text-sm font-light opacity-90 tracking-widest">
              {viewYear}
            </div>
            <div className="text-2xl font-bold tracking-[0.15em]">
              {MONTH_NAMES[viewMonth]}
            </div>
          </div>

          <button
            onClick={prevMonth}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10 text-sm"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10 text-sm"
          >
            ›
          </button>
        </div>

        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-36 border-b sm:border-b-0 sm:border-r border-gray-200 p-4 flex-shrink-0 bg-[#fafafa]">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Notes
            </div>

            <textarea
              value={state.generalNote}
              onChange={(e) =>
                setState((prev) => ({ ...prev, generalNote: e.target.value }))
              }
              placeholder="Monthly memo…"
              className="w-full text-[11px] text-gray-600 bg-transparent resize-none outline-none placeholder:text-gray-300"
              style={{
                lineHeight: "1.8",
                height: "80px",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 26px, #e5e7eb 26px, #e5e7eb 27px)",
                backgroundSize: "100% 27px",
              }}
            />

            {(state.startDate || state.endDate) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">
                  Selection
                </div>
                <div className="text-[10px] text-[#1a6bbf] font-medium leading-snug">
                  {rangeLabel()}
                </div>
                {state.startDate && state.endDate && (
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        startDate: null,
                        endDate: null,
                      }))
                    }
                    className="mt-1 text-[9px] text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
            {activeNoteDay && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">
                  Note for{" "}
                  {new Date(activeNoteDay).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full text-[10px] border border-gray-200 rounded p-1 outline-none focus:border-[#1a6bbf] resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={saveNote}
                    className="text-[9px] bg-[#1a6bbf] text-white px-2 py-0.5 rounded hover:bg-[#155fa0] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setActiveNoteDay(null);
                      setNoteInput("");
                    }}
                    className="text-[9px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-4">
            <div className="grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map((d) => (
                <div
                  key={d}
                  className={`text-center text-[9px] font-bold tracking-widest pb-1 ${d === "SAT" || d === "SUN" ? "text-[#1a6bbf]" : "text-gray-400"}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {grid.map((row, ri) => (
              <div key={ri} className="grid grid-cols-7">
                {row.map((day, ci) => {
                  if (!day) return <div key={ci} />;
                  const isCurrentMonth = day.getMonth() === viewMonth;
                  const key = dateKey(day);
                  return (
                    <div
                      key={ci}
                      className={`flex items-center justify-center py-[3px] ${getRangeWrapClass(day, isCurrentMonth, ci)}`}
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
        </div>
        <div className="bg-[#1a6bbf] h-1.5 w-full" />
      </div>
    </div>
  );
}
