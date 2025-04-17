import React from 'react';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { AuthServices } from '../../services/aurh.services';
import { toast } from 'react-toastify';
import { useNavigate, useNavigation } from 'react-router-dom';
import { setUser } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hook';

type FieldType = {
  email?: string;
  password?: string;
};
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await AuthServices.Login(values);
    if (res.data.Status === 200) {
      dispatch(setUser(res.data.user)); 
      localStorage.setItem("User", JSON.stringify(res.data));
      toast.success(res.data.message);
      navigate('/admin/classes')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
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
            <Input className="h-10 rounded-md border border-gray-300 px-3" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password className="h-10 rounded-md border border-gray-300 px-3" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
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
