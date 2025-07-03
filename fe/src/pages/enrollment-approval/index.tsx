import { Button, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { initFilter } from '../../common/helpfunction';
import { StudentSubjectServices } from '../../services/student.services';
import { useAppSelector } from '../../redux/hook';
import { ColumnType } from 'antd/es/table';
const { Title } = Typography;
type Props = {}

const EnrollmentApproval = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState(initFilter);
  const user = useAppSelector((state) => state.user.userInfo?.student);
  const [payload, setPayload] = useState({
    teacher_id: user?._id,
    status: "Approved"
    // Approved
  })
  const getData = async (pay: { teacher_id: string; status: string; }) => {
    let res = await StudentSubjectServices.GetEnrollmentByTeacher(pay)
    setData(res?.data?.data)
    setFilter((prev) => ({
      ...prev,
      CurrentPage: res.data?.pagination?.page,
      PageSize: res.data?.pagination?.limit,
      TotalDocs: res.data?.pagination?.total
    }))
  }
  const columns: ColumnType<any>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'code',
      render: (_value, _record, index) => _record.student_id?.name,
    },
    {
      title: 'Email',
      dataIndex: 'code',
      render: (_value, _record, index) => _record.student_id?.email,
    },
    {
      title: 'Môn học',
      dataIndex: 'code',
      render: (_value, _record, index) => _record.teaching_assignment_id?.subject_id?.name,
    },
    {
      title: 'Lớp học',
      dataIndex: 'code'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status'
    },
    {
      title: 'Thao tác',
      dataIndex: 'code',
      render: (_value, _record, index) => {
        return <div className='flex gap-4 !important'>
          <Button onClick={() => { }}>Duyệt</Button>
          <Button>Huỷ</Button>
        </div>

      },
    },
  ]
  console.log("data", data)
  const handlePageChange = () => {

  }
  useEffect(() => {
    getData(payload)
  }, [])
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Duyệt môn học</Title>
        {/* <Button type='primary' onClick={handleAdd}>Thêm môn học</Button> */}
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          current: filter.CurrentPage,
          pageSize: filter.PageSize,
          total: data.length,
          onChange: handlePageChange
        }}
      />
    </>
  )
}

export default EnrollmentApproval
// STT
// Tên sinh viên
// Email
// Môn học
// Lớp học
// Trạng thái (Pending)
// Nút [✅ Duyệt] và [❌ Từ chối]