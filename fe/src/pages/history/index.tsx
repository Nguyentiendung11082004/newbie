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
      console.log("res", res)
      setData(res?.data);
    } catch (err) {
      message.error('Lỗi khi tải lịch sử điểm danh');
    } finally {
      setLoading(false);
    }
  };

  console.log("data", data)
  useEffect(() => {
    if (id) {
      getData(id, range[0], range[1]);
    }
  }, [id, range]);

  const columns: ColumnsType<AttendanceRow> = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_v, _r, i) => i + 1,
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      render: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'studentName',
      render: (_v, _record: any) => <span>{_record.attendances[0].student.name}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_v, _record: any) => {
        return (
          <span style={{ color: _record.attendances[0].status === 'present' ? 'green' : 'red' }}>
            {_record.attendances[0].status === 'present' ? 'Có mặt' : 'Vắng mặt'}
          </span>
        )
      }

    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
  ];

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
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default History;
