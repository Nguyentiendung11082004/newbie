import React from 'react';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { AuthServices } from '../../services/auth.services';
import { toast } from 'react-toastify';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { setAccessToken, setUser } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hook';

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
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("../../public/login.jpeg")' }}
    >
      <div className="bg-white px-10 py-12 rounded-2xl shadow-2xl w-1/3 ">
        <h2 className="text-3xl font-bold text-center mb-2 text-red-800">Đăng nhập</h2>
        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input className="h-10 rounded-lg border border-gray-300 px-3" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password className="h-10 rounded-lg border border-gray-300 px-3" />
          </Form.Item>
          <Link to="/register" >
            Đăng ký
          </Link>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200"
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
