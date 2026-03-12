import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Modal, theme } from 'antd';
import React, { useState } from 'react';
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { persistor } from '../redux';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { clearUser } from '../redux/slices/userSlice';
import { AuthServices } from '../services/auth.services';
import ProfileUser from '../pages/profile';
import { Modal as AntModal } from "antd"
const { Header, Sider, Content } = Layout;
const LayoutDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.userInfo.user);
  const infoUser = useAppSelector((state) => state.user.userInfo);
  const location = useLocation();
  const token = useAppSelector((state) => state.user.accessToken);
  const menuItems = [
    // Admin Menu
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
      url: '/admin/dashboard',
      permission: ['admin'],
    },
    {
      key: 'feednotification',
      icon: <NotificationOutlined />,
      label: 'Thông báo và tin tức',
      url: '/feednotification',
      permission: ['admin', 'student', 'teacher'],
    },
    {
      key: 'notification',
      icon: <BellOutlined />,
      label: 'Quản lý thông báo',
      url: '/notification',
      permission: ['admin', 'teacher'],
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
    // {
    //   key: 'major',
    //   icon: <SolutionOutlined />,
    //   label: 'Quản lý ngành học',
    //   url: '/admin/classes',
    //   permission: ['admin'],  // Chỉ có admin mới được truy cập
    // },
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
    // {
    //   key: 'admissions',
    //   icon: <FileDoneOutlined />,
    //   label: 'Tuyển sinh',
    //   url: '/admin/admissions',
    //   permission: ['admin'],  // Chỉ có admin mới được truy cập
    // },
    // {
    //   key: 'reports',
    //   icon: <BarChartOutlined />,
    //   label: 'Thống kê báo cáo',
    //   url: '/admin/reports',
    //   permission: ['admin'],  // Chỉ có admin mới được truy cập
    // },

    // Teacher Menu
    {
      key: 'teacherClasses',
      icon: <SolutionOutlined />,
      label: 'Lớp giảng dạy',
      url: '/teacher/classes',
      permission: ['teacher'],  // Chỉ giảng viên có thể truy cập
    },
    {
      key: 'teacherTimeTable',
      icon: <BookOutlined />,
      label: 'Lịch dạy',
      url: '/teacher/timetable',
      permission: ['teacher'],  // Chỉ sinh viên có thể truy cập
    },
    // {
    //   key: 'teacherEnrollmentApproval',
    //   icon: <CheckCircleOutlined />,
    //   label: 'Duyệt ghi danh',
    //   url: '/teacher/enrollment-approval',
    //   permission: ['teacher', 'admin'],
    // },
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
      key: 'studentTimeTable',
      icon: <BookOutlined />,
      label: 'Lịch học',
      url: '/student/timetable',
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
          permission: ['student'],
        },
        {
          key: 'tuition',
          label: 'Quản lý học phí',
          url: 'admin/services/tuition',
          permission: ['admin'],
        },
        {
          key: 'transaction-history',
          label: 'Lịch sử giao dịch',
          url: 'admin/services/transaction-history',
          permission: ['admin'],
        },
        {
          key: 'debt',
          label: 'Công nợ',
          url: '/services/debt',
          permission: ['student'],
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
    // {
    //   key: 'test',
    //   icon: <FileDoneOutlined />,
    //   label: 'Test',
    //   url: '/admin/test',
    //   permission: ['teacher', 'student', 'admin'],  // Chỉ sinh viên có thể truy cập
    // },
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
      persistor.purge();
      navigate("/login");
    }
  }
  const handleAvatarClick = () => {
    setIsModalOpen(true)
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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
            <div className="flex items-center gap-2 mx-4">
              <Dropdown overlay={menu} trigger={['click']}>
                <span className="cursor-pointer hover:text-blue-600 transition-colors font-medium">
                  {infoUser?.profile?.name ?? infoUser?.user?.email}
                </span>
              </Dropdown>

              <Avatar
                size="large"
                className="cursor-pointer hover:scale-110 transition-transform bg-blue-500 shadow-sm"
                src={infoUser?.profile?.avatar}
                icon={<UserOutlined />}
                onClick={handleAvatarClick}
              />
            </div>
          </div>
        </Header>
        <AntModal
          title="Thông tin người dùng"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={700}
          centered
          destroyOnClose
        >
          <ProfileUser data={infoUser.profile} />
        </AntModal>

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
