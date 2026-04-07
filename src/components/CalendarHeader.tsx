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

export default function CalendarHeader({
  viewMonth,
  viewYear,
  heroImg,
  prevMonth,
  nextMonth,
}: {
  viewMonth: number;
  viewYear: number;
  heroImg: string;
  prevMonth: () => void;
  nextMonth: () => void;
}) {
  return (
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
  );
}
