import { Card, Col, Row, Statistic } from 'antd';
import {
  ShopOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h1>Панель управления</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Всего поставщиков"
              value={12}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Товаров в каталоге"
              value={156}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Активных заказов"
              value={8}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Поставок в пути"
              value={5}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
