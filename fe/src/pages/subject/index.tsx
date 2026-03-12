import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { GetDataSubject, setFilter } from '../../redux/slices/subjectSlice';
import Table, { ColumnType } from 'antd/es/table';
import { Typography } from 'antd';
import DialogSubject from './dialogsubject';
import { Button } from '../../components/Button';
import { SubjectServices } from '../../services/student.services';
import { toast } from 'react-toastify';
const { Title } = Typography;
type Props = {}

const Subject = (props: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false)
  const { data, filter } = useAppSelector((state: any) => state.subject);
  const store = useAppSelector((state) => state)
  const [dataEdit, setDataEdit] = useState()
  const handleAdd = () => {
    setOpen(true)
  }
  const columns: ColumnType<any>[] = [
    {

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
        return <div className='flex gap-2'>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleXoa(_record._id)}>Xoá</Button>
          <Button className="bg-amber-400 hover:bg-amber-500 text-white" onClick={() => handleEdit(_record)} >Sửa</Button>
        </div>
      },
    },
  ];
  const handleXoa = async (id: string) => {
    try {
      await SubjectServices.Delete(id)
      toast.success('Xoá thành công')
      dispatch(GetDataSubject());
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleEdit = (value) => {
    setDataEdit(value)
    setOpen(true)
  }
  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(setFilter({
      CurrentPage: page,
      PageSize: pageSize,
    }));
    dispatch(GetDataSubject());
  };

  useEffect(() => {
    if (!open) {
      dispatch(GetDataSubject());
    }
  }, [open]);
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Danh sách môn học</Title>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAdd}>Thêm môn học</Button>
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
      {
        open && <DialogSubject isModalOpen={open} setOpen={setOpen} data={data} dataEdit={dataEdit} setDataEdit={setDataEdit} />
      }

    </>
  )
}

export default Subject