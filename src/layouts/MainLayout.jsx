import { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Панель управления</Link>,
    },
    {
      key: '/suppliers',
      icon: <ShopOutlined />,
      label: <Link to="/suppliers">Поставщики</Link>,
    },
    {
      key: '/products',
      icon: <InboxOutlined />,
      label: <Link to="/products">Товары</Link>,
    },
    {
      key: '/purchase-orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/purchase-orders">Заказы закупок</Link>,
    },
    {
      key: '/deliveries',
      icon: <TruckOutlined />,
      label: <Link to="/deliveries">Поставки</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: collapsed ? '14px' : '16px',
        }}>
          {collapsed ? 'УПЗ' : 'Управление'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{
            paddingLeft: 24,
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            Система управления поставками и закупками
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;