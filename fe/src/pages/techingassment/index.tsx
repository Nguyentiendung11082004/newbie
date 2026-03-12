import React, { useEffect, useState } from 'react'
import { TechingAssignmentServices } from '../../services/student.services'
import { Button, Popconfirm, Table, Typography } from 'antd'
import DialogTechngassment from './dialogtechingassment';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
type Props = {}
const { Title } = Typography;
const TechingAssignment = (props: Props) => {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false);
  const [dataEdit,setDataEdit] = useState({})
  const getData = async () => {
    let res = await TechingAssignmentServices.GetList();
    setData(res.data)
  }
  const handleOk = () => {

  }
  const columns: any = [
    {
      title: 'STT',
      dataIndex: 'STT',
      render: (_value: any, _record: any, index: any) => index + 1,
    },
    {
      title: 'Kỳ',
      render: (_value: any, _record: any, index: any) => _record.semester_id?.name,
    },
    {
      title: 'Giảng viên',
      render: (_value: any, _record: any, index: any) => _record?.teacher_id?.name,
    },
    {
      title: 'Lớp học',
      render: (_value: any, _record: any, index: any) => _record.class_id.ClassName,
    },
    {
      title: 'Môn học',
      render: (_value: any, _record: any, index: any) => _record.subject_id.name,
    },
    {
      title: 'Thao tác',
      render: (_value: any, _record: any, index: any) => <>
        <Popconfirm
          title="Xoá"
          description="Bạn có chắc chắn muốn xoá?"
          okText="Có"
          cancelText="Huỷ"
          onConfirm={() => handleDelete(_record)}
          onCancel={() => { }}
        >
          <Button ><DeleteOutlined /></Button>
        </Popconfirm>
        <Button onClick={()=> handleEdit(_record)}><EditOutlined /></Button>
        <Button><EyeOutlined /></Button>
      </>,
    },
  ]
  const handleAdd = () => {
    setVisible(true)
  }
  const handleEdit = (value:any) => {
    setDataEdit(value)
    setVisible(true)
  }
  const handleDelete = async (value: any) => {
    let res = await TechingAssignmentServices.Delete(value._id);
    getData();
  }
  useEffect(() => {
    if (visible === false) {
      getData();
    }
  }, [visible])
  return (
    <>

      <div className='flex justify-between items-center'>
        <Title level={4}>Lịch dạy</Title>
        <Button type='primary' onClick={handleAdd}>Phân công lịch dạy</Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
      // pagination={{
      //   current: filter.CurrentPage,
      //   pageSize: filter.PageSize,
      //   total: filter.totalDocs,
      //   onChange: handlePageChange
      // }}
      />
      {
        visible && <DialogTechngassment isModalOpen={visible} setVisible={setVisible} dataEdit={dataEdit} setDataEdit={setDataEdit} />
      }
    </>
  )
}

export default TechingAssignment