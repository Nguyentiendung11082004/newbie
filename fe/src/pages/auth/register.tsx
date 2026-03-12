import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { AuthServices } from '../../services/auth.services';
import bgLogin from '../../../public/bglogin.jpg'
import { MajorServices } from '../../services/student.services';
import { toast } from 'react-toastify';

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
  const [listMajor, setListMajor] = useState<any[]>([])
  const getNganhHoc = async () => {
    let res = await MajorServices.GetList();
    setListMajor(res.data)
  }
  const onFinish = async (values: RegisterUser) => {
    try {
      const payload = {
        ...values,
        dob: values.dob.format('YYYY-MM-DD'),
      };
      const res = await AuthServices.Register(payload)
      toast.success('Đăng ký thành công!');
    } catch (error) {
      toast.error(error.message)
    }
  };
  useEffect(() => {
    getNganhHoc()
  }, [])
  return (
    <div className="relative flex min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgLogin})` }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative w-full max-w-4xl mx-auto my-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 z-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Đăng ký tài khoản
        </h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: 'student' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
            >
              <Input
                placeholder="Nhập email"
                className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>

            <Form.Item
              label="Mã sinh viên"
              name="StudentCode"
              rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
            >
              <Input
                placeholder="Nhập mã sinh viên"
                className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>
            <Form.Item
              label="Ngành học"
              name="major_id"
              rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
            >
              <Select
                placeholder="Chọn môn học tiên quyết"
                className="w-full"
                // value={payload.MajorId}
                // onChange={(e) => setPayload((prev) => ({ ...prev, MajorId: e }))}
                options={listMajor.map((e: any) => ({
                  value: e._id,
                  label: e.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Tên đầy đủ"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input
                placeholder="Nhập họ và tên"
                className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input
                placeholder="Nhập địa chỉ"
                className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select
                placeholder="Chọn giới tính"
                className="h-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              >
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </Form.Item>


            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select
                className="h-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={true}
              >
                <Select.Option value="student">Sinh viên</Select.Option>
                {/* <Select.Option value="teacher">Giảng viên</Select.Option>
                <Select.Option value="admin">Quản trị viên</Select.Option> */}
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="mt-20">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-24 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg font-medium transition duration-200"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <p className="text-center text-gray-700 mt-4">
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


  );
};

export default Register;
