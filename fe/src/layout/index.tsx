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
    UserOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const LayoutDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            url: '/admin/dashboard',
            permission: ['admin']
        },
        {
            key: 'students',
            icon: <TeamOutlined />,
            label: 'Quản lý sinh viên',
            url: '/admin/students',
            permission: ['admin']
        },
        {
            key: 'teachers',
            icon: <UserOutlined />,
            label: 'Quản lý giảng viên',
            url: '/admin/teachers',
            permission: ['admin']
        },
        {
            key: 'classes',
            icon: <SolutionOutlined />,
            label: 'Quản lý lớp học',
            url: '/admin/classes',
            permission: ['admin']
        },
        {
            key: 'subjects',
            icon: <BookOutlined />,
            label: 'Quản lý môn học',
            url: '/admin/subjects',
            permission: ['admin']
        },
        {
            key: 'assign',
            icon: <FormOutlined />,
            label: 'Phân công giảng dạy',
            url: '/admin/teaching-assignment',
            permission: ['admin']
        },
        {
            key: 'admissions',
            icon: <FileDoneOutlined />,
            label: 'Tuyển sinh',
            url: '/admin/admissions',
            permission: ['admin']
        },
        {
            key: 'reports',
            icon: <BarChartOutlined />,
            label: 'Thống kê báo cáo',
            url: '/admin/reports',
            permission: ['admin']
        },
    ];
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{ height: 64, margin: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 8 }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={menuItems
                        .filter(item => matchPath(location.pathname, item.url))
                        .map(item => item.key)}
                    items={menuItems.map(({ key, icon, label, url }) => ({
                        key,
                        icon,
                        label,
                        onClick: () => navigate(url),
                    }))}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
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
        </Layout>
    );
}
export default LayoutDashboard
