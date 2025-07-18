import React from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { AuthServices } from '../../services/auth.services';
const { Option } = Select;
type RegisterUser = {
  email: string;
  password: string;
  name: string;
  dob: Dayjs;
  gender: 'Nam' | 'Nữ' | 'Khác';
  phone: string;
  address: string;
  role: 'student' | 'teacher' | 'admin';

}
const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: RegisterUser) => {
    const payload = {
      ...values,
      dob: values.dob.format('YYYY-MM-DD'), // Convert ngày về dạng string
    };
    const res = await AuthServices.Register(payload)
    if (res) {
      message.success('Đăng ký thành công!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white px-10 py-12 rounded-2xl shadow-2xl w-1/3 ">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ role: 'student' }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              label="Tên đầy đủ"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select>
                <Option value="student">Sinh viên</Option>
                <Option value="teacher">Giảng viên</Option>
                <Option value="admin">Quản trị viên</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Đăng ký
              </Button>
            </Form.Item>

            <p className="text-center">
              Đã có tài khoản?{' '}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </span>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
