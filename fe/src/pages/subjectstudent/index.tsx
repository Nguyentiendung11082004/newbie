import { Button, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/hook';
import { StudentSubjectServices } from '../../services/student.services';
import { initFilter } from '../../common/helpfunction';
import { ColumnType } from 'antd/es/table';
import DialogSubject from './dialogstudentsubject';

type Props = {}
const { Title } = Typography;
const SubjectStudent = (props: Props) => {
  const user = useAppSelector((state) => state.user.userInfo);
  const [filter, setFilter] = useState(initFilter);
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState([])
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
          {_value?.subject_id.name}
        </div>
      }
    },
    {
      title: 'Số tín chỉ',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          {_value?.subject_id.credit}
        </div>
      }
    },
    {
      title: 'Kỳ',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          {_value?.subject_id.semester}
        </div>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
  ]
  useEffect(() => {
    getData()
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
      <DialogSubject isModalOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default SubjectStudent