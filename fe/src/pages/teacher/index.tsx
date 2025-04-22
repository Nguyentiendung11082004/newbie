import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { GetDataTeacher } from '../../redux/slices/teacherSlice'
import { Button, Table, Typography } from 'antd'
import { formatDateStringGMT } from '../../common/helpfunction'
import { ColumnType } from 'antd/es/table'
import { ITeacher } from '../../types/teacher'

type Props = {}
const { Title } = Typography;
const Teacher = (props: Props) => {
  const dispatch = useAppDispatch()
  const { data, filter } = useAppSelector((state: any) => state.teacher);
  const handleAdd = () => {

  }
  const columns: ColumnType<ITeacher>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'name'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      render: (value, record, index) => {
        return formatDateStringGMT(record.dob, "dd/mm/yyyy")
      }
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone'
    },
  ]
  const handlePageChange = () => {

  }
  useEffect(() => {
    dispatch(GetDataTeacher());
  }, [open]);
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Danh sách giảng viên</Title>
        {/* <Button type='primary' onClick={handleAdd}>Thêm gi</Button> */}
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data?.data}
        pagination={{
          current: filter.CurrentPage,
          pageSize: filter.PageSize,
          total: filter.totalDocs,
          onChange: handlePageChange
        }}
      />
    </>
  )
}

export default Teacher