import { Button, Select, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { TimetableServices } from "../../services/student.services";
const TeacherTimetable: React.FC = () => {
  const [filter, setFilter] = useState({
    subject: "",
    className: "",
  });
  const [data, setData] = useState<any[]>([]);
  const getData = async () => {
    const res = await TimetableServices.GetTeacherTimeTable();
    setData(res?.data || []);
  };
  useEffect(() => {
    getData();
  }, []);
  // ✅ FILTER DATA TỪ BE
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filter.subject && item.subject.name !== filter.subject) return false;
      if (filter.className && item.class.name !== filter.className) return false;
      return true;
    });
  }, [data, filter]);
  const days = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      item.weeklySchedule?.forEach((s: any) => {
        set.add(s.dayOfWeek);
      });
    });

    return Array.from(set).map((d) => ({
      label: d,
      value: d,
    }));
  }, [data]);
  const timeSlots = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      item.weeklySchedule?.forEach((s: any) => {
        set.add(`${s.startTime}-${s.endTime}`);
      });
    });
    return Array.from(set)
      .map((t) => {
        const [start, end] = t.split("-");
        return { start, end };
      })
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [data]);
  // ✅ FIND SCHEDULE TỪ DATA THẬT
  const findSchedules = (day: string, start: string, end: string) => {
    const results: any[] = [];

    for (const item of filteredData) {
      const matches = item.weeklySchedule?.filter(
        (s: any) =>
          s.dayOfWeek === day &&
          s.startTime === start &&
          s.endTime === end
      );

      if (matches?.length) {
        matches.forEach((m: any) => {
          results.push({
            subject: item.subject.name,
            className: item.class.name,
            room: item.room || "—",
          });
        });
      }
    }

    return results;
  };


  // ✅ OPTIONS FILTER (KHÔNG MOCK)
  const subjectOptions = useMemo(() => {
    return [...new Set(data.map((i) => i.subject.name))].map((s) => ({
      label: s,
      value: s,
    }));
  }, [data]);

  const classOptions = useMemo(() => {
    return [...new Set(data.map((i) => i.class.name))].map((c) => ({
      label: c,
      value: c,
    }));
  }, [data]);

  // ✅ COLUMNS
  const columns: any = [
    {
      title: "Ca học",
      dataIndex: "time",
      fixed: "left",
      width: 140,
      render: (v: string) => (
        <div style={{ fontWeight: 600 }}>{v}</div>
      ),
    },
    ...days.map((d) => ({
      title: d.label,
      dataIndex: d.value,
      render: (_: any, record: any) => {
        const schedules = findSchedules(d.value, record.start, record.end);
        if (!schedules.length) {
          return (
            <div
              style={{
                height: 90,
                background: "#fafafa",
                borderRadius: 8,
              }}
            />
          );
        }

        return (
          <div
            style={{
              minHeight: 90,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {schedules.map((sc, idx) => (
              <div
                key={idx}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontWeight: 600, color: "#1677ff" }}>
                  {sc.subject}
                </div>
                <div style={{ fontSize: 13 }}>{sc.className}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  Phòng {sc.room}
                </div>
              </div>
            ))}
          </div>
        );
      }
    })),
  ];
  // ✅ DATASOURCE = KHUNG GIỜ
  const dataSource = timeSlots.map((t, idx) => ({
    key: idx,
    time: `${t.start} - ${t.end}`,
    start: t.start,
    end: t.end,
  }));
  return (
    <>
      {/* TABLE */}
      <div
        style={{
          padding: 24,
          background: "#f5f7fa",
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginBottom: 16, fontWeight: 600 }}>
          📅 Thời khoá biểu giảng dạy
        </h2>

        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
        />
      </div>
    </>
  );
};

export default TeacherTimetable;
