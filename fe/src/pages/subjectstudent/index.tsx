import { Button, Popconfirm, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/hook';
import { StudentSubjectServices } from '../../services/student.services';
import { initFilter } from '../../common/helpfunction';
import { ColumnType } from 'antd/es/table';
import DialogSubject from './dialogstudentsubject';
import { toast } from 'react-toastify';

type Props = {}
const { Title } = Typography;
const SubjectStudent = (props: Props) => {
  const user = useAppSelector((state) => state.user.userInfo);
  const [filter, setFilter] = useState(initFilter);
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState([])
  const [dataEdit, setDataEdit] = useState({})
  const getData = async () => {
    let pay = {
      student_id: user.student._id
    }
    let res = await StudentSubjectServices.GetSubjectEnroll(pay);
    setData(res?.data)
  }
  const handle = () => {
    setIsOpen(true)
  }
  const huyDangKy = async (value: any) => {
    let res = await StudentSubjectServices.DeleteEnroll(value._id);
    if (res) {
      toast.success(res.data.message)
      getData()
    }
  }
  const handleChiTiet = (value: any) => {
    setIsOpen(true)
    setDataEdit(value)
  }
  const handleUpdate = (value: any) => {

  }
  const columns: ColumnType<any[]>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Tên môn học',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          {_value?.teaching_assignment_id?.subject_id.name}
        </div>
      }
    },
    {
      title: 'Số tín chỉ',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          {_value?.teaching_assignment_id?.subject_id.credit}
        </div>
      }
    },
    {
      title: 'Kỳ',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          {_value?.teaching_assignment_id?.semester}
        </div>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleChiTiet(record)}>Chi tiết</Button>
          {/* <Button size="small" onClick={() => handleUpdate(record)}>Sửa</Button> */}
          <Popconfirm
            title="Bạn có chắc muốn huỷ đăng ký môn học này không?"
            onConfirm={() => huyDangKy(record)}
          >
            <Button danger size="small">Huỷ</Button>
          </Popconfirm>
        </Space>
      )

    }
  ]
  useEffect(() => {
    if (isOpen === false) {
      getData()
    }
  }, [isOpen])
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Danh sách môn học của tôi</Title>
        <Button type='primary' onClick={handle}>Đăng ký môn học</Button>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
      // pagination={{
      //   current: filter.CurrentPage,
      //   pageSize: filter.PageSize,
      //   total: data.length,
      //   showSizeChanger: true,
      //   onChange: (page, pageSize) => {
      //     setFilter({
      //       ...filter,
      //       CurrentPage: page,
      //       PageSize: pageSize,
      //     });
      //   }
      // }}
      />
      <DialogSubject isModalOpen={isOpen} setIsOpen={setIsOpen} dataEdit={dataEdit} setDataEdit={setDataEdit} />
    </>
  )
}

export default SubjectStudent