import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Tag, Typography } from 'antd';
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ProfileUser = ({ data }) => {

  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Dung";

  return (
    <div className="max-w-5xl mx-auto">
      <Row gutter={24}>

        <Col xs={24} md={7}>
          <Card className="text-center shadow-sm">
            <Avatar
              size={120}
              src={data?.avatar || defaultAvatar}
              icon={<UserOutlined />}
            />

            <Title level={4} className="mt-4">
              {data?.name}
            </Title>

            <Text type="secondary">{data?.StudentCode}</Text>

            <div className="mt-3">
              <Tag color="green">Đang học</Tag>
            </div>
          </Card>
        </Col>


        <Col xs={24} md={17}>
          <Card title="Thông tin cá nhân" className="shadow-sm">

            <Row gutter={[16, 16]}>

              <Col span={12}>
                <Text type="secondary">Ngày sinh</Text>
                <div>{dayjs(data?.dob).format("DD/MM/YYYY")}</div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Giới tính</Text>
                <div>{data?.gender}</div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Email</Text>
                <div>{data?.email}</div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Số điện thoại</Text>
                <div>{data?.phone}</div>
              </Col>

              <Col span={24}>
                <Text type="secondary">Địa chỉ</Text>
                <div>{data?.address}</div>
              </Col>

              <Col span={24}>
                <Text type="secondary">Ngày tạo</Text>
                <div>{dayjs(data?.createdAt).format("HH:mm DD/MM/YYYY")}</div>
              </Col>

            </Row>

          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default ProfileUser;