import {
  BarChartOutlined,
  BookOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { clearUser } from '../redux/slices/userSlice';
import { AuthServices } from '../services/auth.services';
import { toast } from 'react-toastify';
import React from 'react';
const { Header, Sider, Content } = Layout;



const LayoutDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.userInfo?.user);
  const location = useLocation();
  const token = useAppSelector((state) => state.user.userInfo?.token);
  const student = useAppSelector((state) => state.user.userInfo);
  const menuItems = [
    // Admin Menu
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      url: '/admin/dashboard',
      permission: ['admin', 'teacher', 'student'],
    },
    {
      key: 'history',
      icon: <UserSwitchOutlined />,
      label: 'Lịch sử điểm danh',
      url: '/history',
      permission: ['admin', 'teacher', 'student'],
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: 'Quản lý sinh viên',
      url: '/admin/students',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },
    {
      key: 'teachers',
      icon: <UserOutlined />,
      label: 'Quản lý giảng viên',
      url: '/admin/teachers',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },
    {
      key: 'classes',
      icon: <SolutionOutlined />,
      label: 'Quản lý lớp học',
      url: '/admin/classes',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },
    {
      key: 'subjects',
      icon: <BookOutlined />,
      label: 'Quản lý môn học',
      url: '/admin/subjects',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },
    {
      key: 'assign',
      icon: <FormOutlined />,
      label: 'Phân công giảng dạy',
      url: '/admin/teaching-assignment',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },
    {
      key: 'admissions',
      icon: <FileDoneOutlined />,
      label: 'Tuyển sinh',
      url: '/admin/admissions',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Thống kê báo cáo',
      url: '/admin/reports',
      permission: ['admin'],  // Chỉ có admin mới được truy cập
    },

    // Teacher Menu
    {
      key: 'teacherDashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard Giảng viên',
      url: '/teacher/dashboard',
      permission: ['teacher'],  // Chỉ giảng viên có thể truy cập
    },
    {
      key: 'teacherClasses',
      icon: <SolutionOutlined />,
      label: 'Lớp giảng dạy',
      url: '/teacher/classes',
      permission: ['teacher'],  // Chỉ giảng viên có thể truy cập
    },
    {
      key: 'teacherEnrollmentApproval',
      icon: <CheckCircleOutlined />,
      label: 'Duyệt ghi danh',
      url: '/teacher/enrollment-approval',
      permission: ['teacher'],
    },
    {
      key: 'teacherGrade',
      icon: <FileDoneOutlined />,
      label: 'Nhập điểm',
      url: '/teacher/grade',
      permission: ['teacher'],  // Chỉ giảng viên có thể truy cập
    },

    // Student Menu
    {
      key: 'studentDashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard Sinh viên',
      url: '/student/dashboard',
      permission: ['student'],  // Chỉ sinh viên có thể truy cập
    },
    {
      key: 'studentSubjects',
      icon: <BookOutlined />,
      label: 'Môn học của tôi',
      url: '/student/subjects',
      permission: ['student'],  // Chỉ sinh viên có thể truy cập
    },
    {
      key: 'studentEnroll',
      icon: <FormOutlined />,
      label: 'Ghi danh môn học',
      url: '/student/enroll',
      permission: ['student'],  // Chỉ sinh viên có thể truy cập
    },
    {
      key: 'studentResult',
      icon: <FileDoneOutlined />,
      label: 'Kết quả học tập',
      url: '/student/grade',
      permission: ['student'],  // Chỉ sinh viên có thể truy cập
    },
    {
      key: 'test',
      icon: <FileDoneOutlined />,
      label: 'Test',
      url: '/admin/test',
      permission: ['teacher', 'student', 'admin'],  // Chỉ sinh viên có thể truy cập
    },
  ];
  const menu = (
    <Menu
      items={[
        {
          key: 'logout',
          label: 'Đăng xuất',
          onClick: () => handleLogout(),
        },
      ]}
    />
  );
  const handleLogout = async () => {
    let res = await AuthServices.Logout(token);
    if (res.data.StatusCodes == 200) {
      toast.success('Đăng xuất thành công')
      dispatch(clearUser());
      navigate("/login");
      localStorage.removeItem("token");
    }
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const matchMenuKey = (pathname: string) => {
    const matchedItem = menuItems.find(item => {
      if (!item.url) return false;
      // Nếu item có path động thì dùng matchPath
      if (item.url.includes(':')) {
        return matchPath({ path: item.url, end: true }, pathname);
      }
      // Còn lại thì match chính xác
      return pathname === item.url;
    });
    return matchedItem?.key;
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div style={{ height: 64, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 8 }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={menuItems
            .filter(item => matchPath({ path: item.url, end: false }, location.pathname))
            .map(item => item.key)}
          // items={menuItems.map(({ key, icon, label, url }) => ({
          //     key,
          //     icon,
          //     label,
          //     onClick: () => navigate(url),
          // }))}
          items={menuItems.filter(item => item.permission.includes(user?.role)) // 👈 lọc theo role
            .map(({ key, icon, label, url }) => ({
              key,
              icon,
              label,
              onClick: () => navigate(url),
            }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div>
            <Dropdown overlay={menu} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <span>{student?.student?.name || student?.user?.email}</span>
                <Avatar
                  style={{
                    margin: '0px 10px',
                    backgroundColor: '#1890ff',
                  }}
                  icon={<UserOutlined />}
                />
              </div>
            </Dropdown>
          </div>

        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: 8,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout >
  );
}
export default LayoutDashboard
