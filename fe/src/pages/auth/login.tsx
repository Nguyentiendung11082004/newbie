import React from 'react';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { AuthServices } from '../../services/auth.services';
import { toast } from 'react-toastify';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { setAccessToken, setUser } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hook';
import bgLogin from '../../../public/bglogin.jpg'
type FieldType = {
  email?: string;
  password?: string;
};
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const res = await AuthServices.Login(values);
      if (res.data.Status === 200) {
        const accessToken = res.data.accessToken;
        dispatch(setAccessToken(accessToken));
        dispatch(setUser(res.data));
        toast.success(res.data.message);
        if (res.data.user.role === "admin") {
          navigate('/admin/dashboard');
        } else {
          navigate('/feednotification');
        }
      }
    } catch (error) {
      toast.error(error.message[0])
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Overlay tối để chữ nổi bật */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 z-10">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
          Đăng nhập
        </h2>

        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input
              className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Nhập email"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              className="h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <div className="text-right mb-4">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Đăng ký
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg font-medium transition duration-200"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>

  );
};

export default Login;
