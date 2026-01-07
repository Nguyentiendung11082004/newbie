import React, { useEffect, useState } from 'react';
import { Table, Typography, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { HistoryServices } from '../../services/student.services';
import { useAppSelector } from '../../redux/hook';

const { Title } = Typography;
const { RangePicker } = DatePicker;

type AttendanceRow = {
  key: string;       // unique key
  date: string;
  studentName: string;
  status: string;
  note?: string;
  attendances: any;
};

const History = () => {
  const { id } = useParams();
  const [data, setData] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<[string, string]>(() => {
    const today = dayjs();
    return [
      today.subtract(14, 'day').format('YYYY-MM-DD'),
      today.format('YYYY-MM-DD'),
    ];
  });

  const getData = async (id: string, from: string, to: string) => {
    if (!id) return message.error('Không có teaching_assignment_id');
    setLoading(true);
    try {
      const res = await HistoryServices.GetAttendanceHistory(id, from, to);
      setData(res?.data);
    } catch (err) {
      message.error('Lỗi khi tải lịch sử điểm danh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getData(id, range[0], range[1]);
    }
  }, [id, range]);

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_v, _r, i) => i + 1,
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Tên sinh viên',
      dataIndex: ['student', 'name'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <span style={{ color: status === 'present' ? 'green' : 'red' }}>
          {status === 'present' ? 'Có mặt' : 'Vắng mặt'}
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
  ];
  console.log("data", data)
  const flatData = data.flatMap((attendance) => {
    return attendance.attendances.map((a) => ({
      date: attendance.date,
      student: a.student,
      status: a.status,
      note: a.note,
    }));
  });
  console.log("flatData", flatData)

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Lịch sử điểm danh</Title>
        <RangePicker
          format="YYYY-MM-DD"
          defaultValue={[dayjs(range[0]), dayjs(range[1])]}
          onChange={(dates, dateStrings) => {
            if (dateStrings[0] && dateStrings[1]) {
              setRange([dateStrings[0], dateStrings[1]]);
            }
          }}
        />
      </div>

      <Table
        rowKey="key"
        loading={loading}
        columns={columns}
        dataSource={flatData}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default History;
