import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataSubject } from '../../redux/slices/subjectSlice';
import Table, { ColumnType } from 'antd/es/table';
import { Button, Typography } from 'antd';

const { Title } = Typography;
type Props = {}

const Subject = (props: Props) => {
  const dispatch = useAppDispatch();
  const { data, filter, setFilter } = useAppSelector((state: any) => state.subject);
  const columns: ColumnType<any>[] = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value, _record, index) => (filter.CurrentPage - 1) * filter.PageSize + index + 1,
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
      title: 'Kỳ học',
      dataIndex: 'semester',
    },
  ];
  useEffect(() => {
    dispatch(GetDataSubject());
  }, []);
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Danh sách môn học</Title>
        <Button type='primary'>Thêm môn học</Button>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          current: filter.CurrentPage,
          pageSize: filter.PageSize,
          total: data.length,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setFilter({
              ...filter,
              CurrentPage: page,
              PageSize: pageSize,
            });
          }
        }}
      />
    </>
  )
}

export default Subject