import React, { useEffect, useState } from 'react'
import { TeacherServices } from '../../../services/student.services'
import { useAppSelector } from '../../../redux/hook';
import { Button, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';

type Props = {}
const { Title } = Typography;
const TeacherClass = (props: Props) => {
  const user = useAppSelector((state) => state.user.userInfo);
  const [data, setData] = useState([])
  const getData = async (id: string) => {
    let res = await TeacherServices.GetClassesByTeacher({
      teacher_id: id
    });
    setData(res.data)
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
          {_value?.subject_id?.name}
        </div>
      }
    },
    {
      title: 'Tên lớp học',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <div>
          {_value?.class_id?.ClassName}
        </div>
      }
    },
    {
      title: 'Thời gian',
      dataIndex: '',
      render: (_: any, record: any) =>
        record.weeklySchedule.map(
          (s: any) => `${s.dayOfWeek} (${s.startTime} - ${s.endTime})`
        ).join(", "),
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      render: (_value, _record, index) => {
        return <Button type="primary" size="small">
          Xem chi tiết
        </Button>

      }
    },
  ]

  useEffect(() => {
    getData(user.student._id)
  }, [])
  return (
    <>
      <div className='flex justify-between items-center'>
        <Title level={4}>Lớp giảng dạy</Title>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
      />
    </>
  )
}

export default TeacherClass