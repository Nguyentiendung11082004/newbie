import {
  BookOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Card, Col, DatePicker, Row, Select, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { formatDateStringGMT } from "../../common/helpfunction";
import { TimetableServices } from "../../services/student.services";
const { RangePicker } = DatePicker;
const ScheduleTable = ({ data }: any) => {
  const sortedData = [...data].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const groupedByDate = sortedData.reduce((acc: any, item: any) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const tableData = Object.keys(groupedByDate).map(date => ({
    date,
    dayOfWeek: groupedByDate[date][0].dayOfWeek,
    subjects: groupedByDate[date]
  }));

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "date",
      width: 200,
      render: (date: string, record: any) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
            {record.dayOfWeek}
          </div>
          <div style={{ color: '#8c8c8c' }}>
            {formatDateStringGMT(date, 'dd/mm/yyyy')}
          </div>
        </div>
      ),
    },
    {
      title: "Chi tiết môn học",
      dataIndex: "subjects",
      render: (subjects: any[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {subjects.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#f0f5ff',
                borderLeft: '4px solid #1890ff',
                minWidth: '250px',
                flex: 1
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                {item.subject}
              </div>
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: '#595959' }}>Lớp:</span> {item.class}
                {/* <span style={{ color: '#595959' }}> Phòng:</span> {item.room || 'Online'} */}
              </div>
              <div style={{ marginTop: '4px', fontWeight: 500, color: '#cf1322' }}>
                <span style={{ color: '#595959' }}>Thời gian:</span>{item.startTime} - {item.endTime}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={false}
      bordered={false}
      className="custom-schedule-table"
    />
  );
};

export default function StudentTimetable() {
  const [data, setData] = useState<any[]>([]);

  const [filter, setFilter] = useState({
    fromDate: "",
    toDate: "",
    subjects: "",
    classes: "",
    rooms: ""
  })

  const getData = async (pay) => {
    let res = await TimetableServices.GetStudentTimetable(pay);
    if (res) {
      setData(res?.data)
    }
  }
  const subjectOptions = [
    ...new Map(data.map((i) => [i.subject, { label: i.subject, value: i.subject }])).values(),
  ];

  const classOptions = [
    ...new Map(data.map((i) => [i.class, { label: i.class, value: i.class }])).values(),
  ];

  const roomOptions = [
    ...new Map(data.map((i) => [i.room, { label: i.room, value: i.room }])).values(),
  ];
  useEffect(() => {
    getData(filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg flex items-center justify-center">
              <CalendarOutlined className="text-white text-xl" />
            </div>
            <Title level={2} style={{ margin: 0 }} className="!text-gray-800">
              Lịch Học Sinh Viên
            </Title>
          </div>
          <span className="text-gray-500 ml-12 block mt-1">
            Chào Tiến Dũng, hãy kiểm tra lịch trình học tập tuần này của bạn.
          </span>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-700">{data?.length || 0} Buổi học</span>
          </div>
        </div>
      </div>

      <Card
        className="mb-8 border-none shadow-md rounded-2xl overflow-hidden"
        bodyStyle={{ padding: '24px' }}
      >
        <div className="flex items-center gap-2 mb-6 text-blue-600 border-b border-gray-100 pb-4">
          <FilterOutlined className="text-lg" />
          <span className="font-bold uppercase tracking-wider text-sm">Bộ lọc thông minh</span>
        </div>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={8}>
            <div className="space-y-2">
              <span className="text-gray-600 flex items-center gap-2">
                <CalendarOutlined className="text-[12px]" /> Khoảng thời gian
              </span>
              <RangePicker
                className="w-full h-10 rounded-lg hover:border-blue-400"
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={(dates) => {
                  setFilter({
                    ...filter,
                    fromDate: dates?.[0]?.format("YYYY-MM-DD") || "",
                    toDate: dates?.[1]?.format("YYYY-MM-DD") || "",
                  });
                }}
              />
            </div>
          </Col>

          <Col xs={24} sm={8} lg={5}>
            <div className="space-y-2">
              <span className="text-gray-600 flex items-center gap-2">
                <BookOutlined className="text-[12px]" /> Môn học
              </span>
              <Select
                className="w-full h-10"
                placeholder="Tất cả môn học"
                allowClear
                options={subjectOptions}
                onChange={(v) => setFilter({ ...filter, subjects: v || [] })}
              />
            </div>
          </Col>

          <Col xs={12} sm={8} lg={5}>
            <div className="space-y-2">
              <span className="text-gray-600 flex items-center gap-2">
                <TeamOutlined className="text-[12px]" /> Lớp học
              </span>
              <Select
                className="w-full h-10"
                placeholder="Chọn lớp"
                allowClear
                options={classOptions}
                onChange={(v) => setFilter({ ...filter, classes: v || [] })}
              />
            </div>
          </Col>

          <Col xs={12} sm={8} lg={6}>
            <div className="space-y-2">
              <span className="text-gray-600 flex items-center gap-2">
                <EnvironmentOutlined className="text-[12px]" /> Phòng học
              </span>
              <Select
                className="w-full h-10"
                placeholder="Chọn phòng"
                allowClear
                options={roomOptions}
                onChange={(v) => setFilter({ ...filter, rooms: v || [] })}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
        <ScheduleTable data={data} />
      </div>
    </div>
  );
}

