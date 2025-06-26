import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, BookOutlined, TeamOutlined, ApartmentOutlined, FileDoneOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { StaticServices } from '../../services/static.services';
type Props = {}
type AdminSumary = {
  student: number;
  teacher: number;
  subject: number;
  class: number;
  enrollment: number;
}
const AdminSumary = (props: Props) => {
  const [data, setData] = useState<AdminSumary>()
  const getData = async () => {
    let res = await StaticServices.GetAdminSumary();
    setData(res.data)
  }
  const items = [
    { title: 'Sinh viên', value: data?.student, icon: <UserOutlined />, bgColor: '#1890ff' },
    { title: 'Giảng viên', value: data?.teacher, icon: <TeamOutlined />, bgColor: '#52c41a' },
    { title: 'Môn học', value: data?.subject, icon: <BookOutlined />, bgColor: '#faad14' },
    { title: 'Lớp học', value: data?.class, icon: <ApartmentOutlined />, bgColor: '#eb2f96' },
    { title: 'Ghi danh', value: data?.enrollment, icon: <FileDoneOutlined />, bgColor: '#722ed1' },
  ];
  useEffect(() => {
    getData()
  }, [])
  return (
    <Row gutter={[24, 24]}>
      {items.map((item) => (
        <Col key={item.title} xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            hoverable
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: item.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              {item.icon && React.cloneElement(item.icon, { style: { color: '#fff', fontSize: 28 } })}
            </div>
            <div style={{ fontSize: 16, color: '#666', marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#111' }}>{item.value}</div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default AdminSumary