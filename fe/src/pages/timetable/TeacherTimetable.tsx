import { Button, DatePicker, Select, Space, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { TimetableServices } from "../../services/student.services";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { formatDateStringGMT } from "../../common/helpfunction";
import { GetDataClass } from "../../redux/slices/classSlice";
import { GetDataSubject } from "../../redux/slices/subjectSlice";
import dayjs from 'dayjs';

const TeacherTimetable: React.FC = () => {
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState<any>({
    subjectId: "",
    classId: "",
    fromDate: "",
    toDate: "",
  });
  const format = 'HH:mm';
  const [data, setData] = useState<any[]>([]);
  const listSearch = useAppSelector((state: any) => state);
  const getData = async (pay) => {
    const res = await TimetableServices.GetTeacherTimeTable(pay);
    setData(res?.data || []);
  };
  useEffect(() => {
    getData(filter);
  }, []);
  const getActualDate = (dayOfWeekStr: string) => {
    const dayMap: { [key: string]: number } = {
      "Thứ 2": 1, "Thứ 3": 2, "Thứ 4": 3, "Thứ 5": 4, "Thứ 6": 5, "Thứ 7": 6, "Chủ Nhật": 0
    };

    const now = new Date();
    const currentDay = now.getDay();
    const targetDay = dayMap[dayOfWeekStr];

    const diff = targetDay - (currentDay === 0 ? 7 : currentDay);
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);

    return targetDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const days = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      item.weeklySchedule?.forEach((s: any) => {
        set.add(s.dayOfWeek);
      });
    });

    const order = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    return Array.from(set)
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((d) => ({
        label: (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-xs font-normal text-gray-500 uppercase tracking-tighter">
              {d.split(' ')[0]} {d.split(' ')[1]}
            </span>
            <span className="text-sm font-bold text-blue-600">
              {getActualDate(d)}
            </span>
          </div>
        ),
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

  const findSchedules = (day: string, start: string, end: string) => {
    const results: any[] = [];

    for (const item of data) {
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

  const handleFilter = async () => {
    const params: any = {};
    if (filter.subjectId) params.subjectId = filter.subjectId;
    if (filter.classId) params.classId = filter.classId;
    if (filter.fromDate) params.fromDate = filter.fromDate;
    if (filter.toDate) params.toDate = filter.toDate;

    const res = await TimetableServices.GetTeacherTimeTable(params);
    setData(res?.data || []);
  };
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
  const dataSource = timeSlots.map((t, idx) => ({
    key: idx,
    time: `${t.start} - ${t.end}`,
    start: t.start,
    end: t.end,
  }));
  useEffect(() => {
    dispatch(GetDataClass())
    dispatch(GetDataSubject());

  }, [])
  return (
    <>
      <div
        style={{
          marginBottom: 24,
          padding: 24,
          background: "#f5f7fa",
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginBottom: 16, fontWeight: 600 }}>🔍 Lọc thời khoá biểu</h2>

        <Space style={{ flexWrap: "wrap", gap: 16 }}>
          {/* Subject */}
          <Select
            style={{ width: 200 }}
            placeholder="Chọn môn học"
            value={filter.subjectId || undefined}
            onChange={(value) => setFilter({ ...filter, subjectId: value })}
            allowClear
          >
            {listSearch?.subject?.data?.map((sub) => (
              <Select.Option key={sub._id} value={sub._id}>
                {sub.name}
              </Select.Option>
            ))}
          </Select>

          {/* Class */}
          <Select
            style={{ width: 200 }}
            placeholder="Chọn lớp"
            value={filter.classId || undefined}
            onChange={(value) => setFilter({ ...filter, classId: value })}  
            allowClear
          >
            {listSearch?.class?.data?.map((cl) => (
              <Select.Option key={cl._id} value={cl._id}>
                {cl.ClassName}
              </Select.Option>
            ))}
          </Select>

          {/* From - To Date */}
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Từ ngày"
            onChange={(date) => setFilter({ ...filter, fromDate: date.format("YYYY-MM-DD") })}
            picker={'date'}
            value={filter?.fromDate ? dayjs(filter.fromDate) : null}
            format="DD/MM/YYYY"
          />
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Đến ngày"
            onChange={(date) => setFilter({ ...filter, toDate: date.format("YYYY-MM-DD") })}
            picker={'date'}
            value={filter?.toDate ? dayjs(filter.toDate) : null}
            format="DD/MM/YYYY"
          />

          {/* Button Lọc */}
          <Button
            type="primary"
            onClick={() => handleFilter()}
          >
            Lọc
          </Button>
          <Button
            onClick={() => {
              const resetFilter = { subjectId: "", classId: "", fromDate: "", toDate: "" };
              setFilter(resetFilter); 
              getData(resetFilter);  
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
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
