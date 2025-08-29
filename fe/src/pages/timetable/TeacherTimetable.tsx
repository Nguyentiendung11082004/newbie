import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { Calendar, Presentation, BookOpen, Clock } from "lucide-react";

export default function TeacherTimetable() {
  // Fake data lịch dạy giảng viên
  const events = useMemo(
    () => [
      {
        id: "1",
        title: "Frontend Framework 1 (WEB2025)",
        start: "2025-08-22T08:00:00",
        end: "2025-08-22T10:00:00",
        extendedProps: {
          class: "WEB2025",
          subject: "Frontend Framework 1",
        },
      },
      {
        id: "2",
        title: "Cơ sở dữ liệu (DB2025)",
        start: "2025-08-23T13:30:00",
        end: "2025-08-23T15:30:00",
        extendedProps: {
          class: "DB2025",
          subject: "Cơ sở dữ liệu",
        },
      },
      {
        id: "3",
        title: "Java OOP (JAVA2025)",
        start: "2025-08-24T15:30:00",
        end: "2025-08-24T17:30:00",
        extendedProps: {
          class: "JAVA2025",
          subject: "Lập trình hướng đối tượng Java",
        },
      },
    ],
    []
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-7 h-7 text-blue-500" />
        <Presentation className="w-7 h-7 text-green-500" />
        <BookOpen className="w-7 h-7 text-purple-500" />
        <Clock className="w-7 h-7 text-orange-500" />
        <h1 className="text-xl font-bold">Lịch giảng dạy của giảng viên</h1>
      </div>

      {/* FullCalendar */}
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={viLocale}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="80vh"
        eventClassNames={() =>
          "bg-blue-500 text-white rounded-md shadow p-1 text-sm"
        }
      />
    </div>
  );
}
