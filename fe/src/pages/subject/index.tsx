import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataSubject, setFilter } from '../../redux/slices/subjectSlice';
import Table, { ColumnType } from 'antd/es/table';
import { Button, Typography } from 'antd';
import DialogSubject from './dialogsubject';

const { Title } = Typography;
type Props = {}

const Subject = (props: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false)
  const { data, filter } = useAppSelector((state: any) => state.subject);
  const store = useAppSelector((state) => state)
  const handleAdd = () => {
    setOpen(true)
  }
  const columns: ColumnType<any>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
    },
    {
      title: 'Mã môn học',
      dataIndex: 'code'
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name'
    },
    {
      title: 'Tín chỉ',
      dataIndex: 'credits',
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          <Button onClick={(e) => handleXoa(_record._id)}>Xoá</Button>
          <Button >Sửa</Button>
        </div>
      },
    },
  ];
  const handleXoa = (value: string) => {
  }
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(setFilter({
      CurrentPage: page,
      PageSize: pageSize,
    }));
    dispatch(GetDataSubject());
  };

  useEffect(() => {
    dispatch(GetDataSubject());
  }, [open]);
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Danh sách môn học</Title>
        <Button type='primary' onClick={handleAdd}>Thêm môn học</Button>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          current: filter.CurrentPage,
          pageSize: filter.PageSize,
          total: filter.totalDocs,
          onChange: handlePageChange
        }}
      />
      <DialogSubject isModalOpen={open} setOpen={setOpen} />
    </>
  )
}

export default Subject