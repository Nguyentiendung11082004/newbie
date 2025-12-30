import { Button, Popconfirm, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/hook';
import { StudentSubjectServices } from '../../services/student.services';
import { initFilter } from '../../common/helpfunction';
import { ColumnType } from 'antd/es/table';
import DialogSubject from './dialogstudentsubject';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type Props = {}

interface SubjectStudent {
  _id: string;
  status: string;
  teaching_assignment_id: {
    _id: string;
    subject_id: {
      name: string;
      credits: number;
    };
    class_id: {
      ClassName: string;
    }
  };
}

const { Title } = Typography;

const SubjectStudent = (props: Props) => {
  const user = useAppSelector((state) => state.user.userInfo);
  console.log("user",user)
  const nav = useNavigate();
  const [filter, setFilter] = useState(initFilter);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<SubjectStudent[]>([]);
  const [dataEdit, setDataEdit] = useState({});

  const getData = async () => {
    const payload = { student_id: user?._id };
    const res = await StudentSubjectServices.GetSubjectEnroll(payload);
    setData(res?.data || []);
  };

  const handle = () => {
    setIsOpen(true);
  };

  const huyDangKy = async (record: SubjectStudent) => {
    const res = await StudentSubjectServices.DeleteEnroll(record._id) as any;
    console.log("res",res)
    if (res) {
      toast.success(res.data.message);
      getData();
    } else {
      toast.error(res?.message)
    }
  };

  const handleChiTiet = (record: SubjectStudent) => {
    setIsOpen(true);
    setDataEdit(record);
  };

  const handlePayment = async (record: SubjectStudent) => {
    try {
      // const res = await StudentSubjectServices.PayEnroll(record._id);
      // if (res?.data?.message) {
      //   toast.success(res.data.message);
      //   getData();
      // }
    } catch (error) {
      toast.error("Thanh toán thất bại");
    }
  };

  const columns: ColumnType<SubjectStudent>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Tên môn học',
      render: (_, record) => (
        <div>{record?.teaching_assignment_id?.subject_id?.name}</div>
      )
    },
    {
      title: 'Số tín chỉ',
      render: (_, record) => (
        <div>{record?.teaching_assignment_id?.subject_id.credits}</div>
      )
    },
    {
      title: 'Lớp',
      render: (_, record) => (
        <div>{record?.teaching_assignment_id?.class_id?.ClassName}</div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space >
          <Button size="small" onClick={() => handleChiTiet(record)}>Chi tiết</Button>
          <Popconfirm
            title="Bạn có chắc muốn huỷ đăng ký môn học này không?"
            onConfirm={() => huyDangKy(record)}
          >
            <Button danger size="small">Huỷ</Button>
          </Popconfirm>

          <Button size="small" onClick={() => nav(`/history/${record.teaching_assignment_id._id}`)}>
            Lịch sử điểm danh
          </Button>
          {record.status === 'Pending' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handlePayment(record)}
            >
              Thanh toán
            </Button>
          )}
        </Space>
      )
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      getData();
    }
  }, [isOpen]);

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <Title level={4}>Danh sách môn học của tôi</Title>
        <Button type='primary' onClick={handle}>Đăng ký môn học</Button>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
      />
      <DialogSubject
        isModalOpen={isOpen}
        setIsOpen={setIsOpen}
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
      />
    </>
  );
};

export default SubjectStudent;
