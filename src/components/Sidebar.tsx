export default function Sidebar({
  state,
  setState,
  rangeLabel,
  activeNoteDay,
  setActiveNoteDay,
  noteInput,
  setNoteInput,
  saveNote,
}: any) {
  return (
    <div className="w-full sm:w-36 border-b sm:border-b-0 sm:border-r border-gray-200 p-4 flex-shrink-0 bg-[#fafafa]">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        Notes
      </div>

      <textarea
        value={state.generalNote}
        onChange={(e) =>
          setState((prev: any) => ({ ...prev, generalNote: e.target.value }))
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
                setState((prev: any) => ({
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
  );
}
