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
  UserSwitchOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { clearUser } from '../redux/slices/userSlice';
import { AuthServices } from '../services/auth.services';
import { toast } from 'react-toastify';
import React from 'react';
import { useSSE } from '../common/hooks/useSSE';
const { Header, Sider, Content } = Layout;
const LayoutDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.userInfo.user);
  const location = useLocation();
  const token = useAppSelector((state) => state.user.userInfo.token);
  const student = useAppSelector((state) => state.user.userInfo);
  const value = useAppSelector((state) => state);
  const menuItems = [
    // Admin Menu
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      url: '/admin/dashboard',
      permission: ['admin', 'teacher', 'student'],
    },
    // {
    //   key: 'history',
    //   icon: <UserSwitchOutlined />,
    //   label: 'Lịch sử điểm danh',
    //   url: '/history',
    //   permission: ['admin', 'teacher', 'student'],
    // },
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
      key: 'studentSubjects',
      icon: <BookOutlined />,
      label: 'Môn học của tôi',
      url: '/student/subjects',
      permission: ['student'],  // Chỉ sinh viên có thể truy cập
    },
    {
      key: 'services',
      icon: <AppstoreOutlined />,
      label: 'Dịch vụ',
      permission: ['student', 'teacher', 'admin'],
      children: [
        {
          key: 'leaveRequest',
          label: 'Đăng ký nghỉ',
          url: '/leave-request',
          permission: ['student'],
        },
        {
          key: 'reviewLeaveRequest',
          label: 'Duyệt đơn nghỉ',
          url: '/leave-request/review',
          permission: ['teacher'],
        },
        {
          key: 'tuition',
          label: 'Quản lý học phí',
          url: '/services/tuition',
          permission: ['student', 'admin'],
        },
        {
          key: 'debt',
          label: 'Công nợ',
          url: '/services/debt',
          permission: ['student'],
        },
        {
          key: 'notification',
          label: 'Thông báo',
          url: '/services/notification',
          permission: ['admin', 'teacher'],
        },
      ]
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


  const renderMenuItems = (items) => {
    return items
      .filter(item => item.permission.includes(user?.role))
      .map(item => {
        if (item.children && item.children.length > 0) {
          const childrenItems = renderMenuItems(item.children);
          if (childrenItems.length === 0) return null; // Nếu tất cả menu con bị filter hết theo role
          return {
            key: item.key,
            icon: item.icon,
            label: item.label,
            children: childrenItems,
          };
        }

        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => navigate(item.url),
        };
      }).filter(Boolean);
  };



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
        }}
      >
        <div style={{ height: 64, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 8 }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={menuItems
            .flatMap(item => item.children ? item.children : item)
            .filter(item => matchPath({ path: item.url, end: false }, location.pathname))
            .map(item => item.key)}
          items={renderMenuItems(menuItems)}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            position: 'fixed',
            top: 0,
            zIndex: 1,
            width: `calc(100% - ${collapsed ? 80 : 250}px)`,
          }}
        >
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

        <Content
          style={{
            margin: '88px 16px 24px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>

  );
}
export default LayoutDashboard
