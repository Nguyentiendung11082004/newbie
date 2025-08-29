import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { Calendar as CalendarIcon, List as ListIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { TimetableServices } from "../../services/student.services";
function startOfWeek(date = new Date(), weekStartsOn = 1) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function atTime(base: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m ?? 0, 0, 0);
  return d;
}

// Types
type TTEvent = {
  id: string;
  title: string; // Subject
  classNameText: string; // Class e.g. WEB2025
  lecturer: string;
  room?: string;
  note?: string;
  start: Date;
  end: Date;
  color?: string;
  dayOfWeek: number; // 1..7 Monday..Sunday
  subject?: string;
  class?: string
};

// Generate weekly fake data based on Monday of current week
function useFakeEvents(currentMonday: Date) {
  return useMemo<TTEvent[]>(() => {
    // You can change this list to match your real subjects/classes.
    const base = currentMonday; // Monday

    const make = (
      idx: number,
      dow: number,
      startTime: string,
      endTime: string,
      subject: string,
      classNameText: string,
      lecturer: string,
      room: string,
      note?: string
    ): TTEvent => {
      const dayDate = addDays(base, dow - 1); // dow: 1..7
      return {
        id: String(idx),
        title: subject,
        classNameText,
        lecturer,
        room,
        note,
        start: atTime(dayDate, startTime),
        end: atTime(dayDate, endTime),
        dayOfWeek: dow,
      };
    };

    return [
      make(1, 1, "08:00", "10:00", "Frontend Framework 1", "WEB2025", "Nguyễn Văn A", "A101"),
      make(2, 1, "13:30", "15:30", "Database Systems", "DB2025", "Trần Thị B", "B202"),
      make(3, 2, "09:00", "11:00", "Algorithms", "ALGO201", "Phạm C", "C303", "Tuần này kiểm tra giữa kỳ"),
      make(4, 3, "07:30", "09:00", "English Speaking", "ENG102", "Mr. John", "D404"),
      make(5, 4, "10:00", "12:00", "Operating Systems", "OS301", "Nguyễn D", "Lab-01"),
      make(6, 5, "14:00", "16:00", "Mobile Development", "MOB401", "Lê E", "A203"),
      make(7, 6, "08:00", "10:30", "Computer Networks", "NET202", "Vũ F", "NetLab"),
    ];
  }, [currentMonday]);
}

function dayName(dow: number) {
  const map = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
  return map[dow] ?? "";
}

// ---- Main Component ----
export default function StudentTimetable() {
  const [filter, setFilter] = useState({
    fromDate: "",
    toDate: "",
    subjects: "",
    classes: "",
    rooms: ""
  })
  const todayMonday = startOfWeek(new Date(), 1);
  const [weekOffset, setWeekOffset] = useState(0);
  const currentMonday = useMemo(() => addDays(todayMonday, weekOffset * 7), [todayMonday, weekOffset]);
  const events = useFakeEvents(currentMonday);
  const [data, setData] = useState<any[]>([]);
  const getData = async (pay) => {
    let res = await TimetableServices.GetStudentTimetable(pay);
    if (res) {
      setData(res?.data)
    }
  }

  const [view, setView] = useState<"week" | "list">("week");
  const [keyword, setKeyword] = useState("");
  const filtered = useMemo(() => {
    // const k = keyword.trim().toLowerCase();
    // if (!k) return events;
    return data.filter((e) =>
      [e.title, e.classNameText, e.lecturer, e.room, e.note]
      // [e.subject]
      //   .filter(Boolean)
      // .some((x) => String(x).toLowerCase().includes(k))
    );
  }, [data]);
  function fmtDate(d: Date) {
    return d.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  }
  const weekLabel = `${fmtDate(currentMonday)} → ${fmtDate(addDays(currentMonday, 6))}`;
  function fmtDateISO(d: Date) {
    return d.toISOString().split("T")[0];
  }
  console.log("currentMonday", currentMonday)
  // useEffect(() => {
  //   const fromDate = fmtDateISO(currentMonday);
  //   const toDate = fmtDateISO(addDays(currentMonday, 6));
  //   const newFilter = {
  //     ...filter,
  //     fromDate,
  //     toDate,
  //   };
  //   setFilter(newFilter);
  //   // getData(newFilter);
  // }, [currentMonday]);
  console.log("filter",filter)
  useEffect(() => {
    getData(filter);
  }, [])
  return (
    <div className="w-full mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm hover:bg-gray-50"
            onClick={() => setWeekOffset((v) => v - 1)}
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
            Trước
          </button>
          <div className="font-medium">{weekLabel}</div>
          <button
            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm hover:bg-gray-50"
            onClick={() => setWeekOffset((v) => v + 1)}
            aria-label="Next week"
          >
            Sau
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            className="ml-2 rounded-2xl border px-3 py-2 shadow-sm hover:bg-gray-50"
            onClick={() => setWeekOffset(0)}
          >
            Hôm nay
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-2xl border overflow-hidden">
            <button
              className={`px-3 py-2 flex items-center gap-2 ${view === "week" ? "bg-gray-100" : "bg-white"}`}
              onClick={() => setView("week")}
            >
              <CalendarIcon className="w-4 h-4" /> Tuần
            </button>
            <button
              className={`px-3 py-2 flex items-center gap-2 ${view === "list" ? "bg-gray-100" : "bg-white"}`}
              onClick={() => setView("list")}
            >
              <ListIcon className="w-4 h-4" /> Danh sách
            </button>
          </div>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo môn/lớp/phòng..."
            className="rounded-2xl border px-3 py-2 w-56 focus:outline-none focus:ring"
          />
        </div>
      </div>

      {view === "week" ? (
        <div className="rounded-2xl border shadow-sm p-2 bg-white">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locales={[viLocale]}
            locale="vi"
            slotMinTime="07:00:00"
            slotMaxTime="20:30:00"
            allDaySlot={false}
            height="auto"
            headerToolbar={false}
            firstDay={1}
            validRange={{ start: currentMonday, end: addDays(currentMonday, 7) }}
            initialDate={addDays(currentMonday, 1)}
            events={data.map((e) => {
              // console.log("e", e)
              const start = `${e.date}T${e.startTime}:00`;
              const end = `${e.date}T${e.endTime}:00`;
              return {
                id: e.id,
                title: `${e.subject} • ${e.classNameText}`,
                start: start,
                end: end,
                extendedProps: e,
              }
            })}
            eventContent={(arg) => {
              const ev = arg.event.extendedProps as TTEvent;
              console.log("ev", ev)
              return (
                <div className="text-[12px] leading-tight">
                  <div className="font-semibold">{ev.subject}</div>
                  <div className="opacity-80">Lớp: {ev.class}</div>
                  <div className="opacity-80">GV: {ev.lecturer}</div>
                  {ev.room && <div className="opacity-80">Phòng: {ev.room}</div>}
                  {ev.note && <div className="text-xs italic opacity-70">{ev.note}</div>}
                </div>
              );
            }}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 7 }).map((_, i) => {
            const dow = i + 1; // 1..7
            const dayDate = addDays(currentMonday, i);
            const dayEvents = filtered
              .filter((e) => e.dayOfWeek === dow)
              .sort((a, b) => a.start.getTime() - b.start.getTime());
            return (
              <div key={dow} className="rounded-2xl border shadow-sm p-4 bg-white">
                <div className="font-semibold mb-3 flex items-center justify-between">
                  <span>
                    {dayName(dow)} • {fmtDate(dayDate)}
                  </span>
                  <span className="text-xs opacity-70">{dayEvents.length} buổi</span>
                </div>
                <div className="space-y-3">
                  {dayEvents.length === 0 && (
                    <div className="text-sm opacity-60">Không có lịch học</div>
                  )}
                  {dayEvents.map((e) => (
                    <div key={e.id} className="rounded-xl border p-3 hover:bg-gray-50">
                      <div className="text-sm font-semibold">{e.title}</div>
                      <div className="text-sm opacity-80">Lớp: {e.classNameText} • GV: {e.lecturer}</div>
                      <div className="text-xs opacity-80">{e.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {e.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      {e.room && <div className="text-xs opacity-80">Phòng: {e.room}</div>}
                      {e.note && <div className="text-xs italic opacity-70">{e.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs opacity-60 text-center pt-2">
        * Đây là dữ liệu giả lập theo tuần hiện tại. Kết nối thật: map từ Enrollment (Approved) → TeachingAssignment.weeklySchedule.
      </div>
    </div>
  );
}
