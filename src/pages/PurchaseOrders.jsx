import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, Popconfirm, message, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'PO-2024-001',
      supplier: 'ООО "Поставщик-1"',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-25',
      status: 'pending',
      totalAmount: 255000,
      items: [
        { product: 'Ноутбук Dell XPS 15', quantity: 3, price: 85000 }
      ]
    },
    {
      id: 2,
      orderNumber: 'PO-2024-002',
      supplier: 'ООО "Поставщик-2"',
      orderDate: '2024-01-16',
      deliveryDate: '2024-01-20',
      status: 'approved',
      totalAmount: 562500,
      items: [
        { product: 'Офисное кресло Comfort Pro', quantity: 45, price: 12500 }
      ]
    },
    {
      id: 3,
      orderNumber: 'PO-2024-003',
      supplier: 'ИП Сидоров',
      orderDate: '2024-01-17',
      deliveryDate: '2024-01-22',
      status: 'delivered',
      totalAmount: 87500,
      items: [
        { product: 'Бумага А4, 500 листов', quantity: 250, price: 350 }
      ]
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [form] = Form.useForm();

  const suppliers = ['ООО "Поставщик-1"', 'ООО "Поставщик-2"', 'ИП Сидоров'];
  const products = ['Ноутбук Dell XPS 15', 'Офисное кресло Comfort Pro', 'Бумага А4, 500 листов', 'Монитор LG 27"', 'Стол офисный 120x60'];

  const statusConfig = {
    pending: { text: 'Ожидает', color: 'warning' },
    approved: { text: 'Одобрен', color: 'processing' },
    delivered: { text: 'Доставлен', color: 'success' },
    cancelled: { text: 'Отменен', color: 'error' },
  };

  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Поставщик',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Дата заказа',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => dayjs(date).format('DD.MM.YYYY'),
    },
    {
      title: 'Дата доставки',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      render: (date) => dayjs(date).format('DD.MM.YYYY'),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount.toLocaleString()} ₽`,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Удалить заказ?"
            description="Вы уверены, что хотите удалить этот заказ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    form.setFieldsValue({
      ...order,
      orderDate: dayjs(order.orderDate),
      deliveryDate: dayjs(order.deliveryDate),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setOrders(orders.filter(o => o.id !== id));
    message.success('Заказ удален');
  };

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        orderDate: values.orderDate.format('YYYY-MM-DD'),
        deliveryDate: values.deliveryDate.format('YYYY-MM-DD'),
      };

      if (editingOrder) {
        setOrders(orders.map(o =>
          o.id === editingOrder.id ? { ...o, ...formattedValues } : o
        ));
        message.success('Заказ обновлен');
      } else {
        const newOrder = {
          id: Math.max(...orders.map(o => o.id)) + 1,
          orderNumber: `PO-2024-${String(orders.length + 1).padStart(3, '0')}`,
          items: [],
          ...formattedValues,
        };
        setOrders([...orders, newOrder]);
        message.success('Заказ добавлен');
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Заказы закупок</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Создать заказ
        </Button>
      </div>

      <Table columns={columns} dataSource={orders} rowKey="id" />

      <Modal
        title={editingOrder ? 'Редактировать заказ' : 'Создать заказ'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="supplier"
            label="Поставщик"
            rules={[{ required: true, message: 'Выберите поставщика' }]}
          >
            <Select>
              {suppliers.map(supplier => (
                <Select.Option key={supplier} value={supplier}>{supplier}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="orderDate"
            label="Дата заказа"
            rules={[{ required: true, message: 'Выберите дату заказа' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="deliveryDate"
            label="Дата доставки"
            rules={[{ required: true, message: 'Выберите дату доставки' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: 'Выберите статус' }]}
          >
            <Select>
              {Object.entries(statusConfig).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="Общая сумма"
            rules={[{ required: true, message: 'Введите сумму' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              addonAfter="₽"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Детали заказа"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Закрыть
          </Button>
        ]}
        width={700}
      >
        {viewingOrder && (
          <Card>
            <p><strong>Номер заказа:</strong> {viewingOrder.orderNumber}</p>
            <p><strong>Поставщик:</strong> {viewingOrder.supplier}</p>
            <p><strong>Дата заказа:</strong> {dayjs(viewingOrder.orderDate).format('DD.MM.YYYY')}</p>
            <p><strong>Дата доставки:</strong> {dayjs(viewingOrder.deliveryDate).format('DD.MM.YYYY')}</p>
            <p><strong>Статус:</strong> <Tag color={statusConfig[viewingOrder.status].color}>{statusConfig[viewingOrder.status].text}</Tag></p>
            <p><strong>Общая сумма:</strong> {viewingOrder.totalAmount.toLocaleString()} ₽</p>
            <div style={{ marginTop: 16 }}>
              <strong>Товары:</strong>
              {viewingOrder.items && viewingOrder.items.length > 0 ? (
                <ul>
                  {viewingOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.product} - {item.quantity} шт. × {item.price.toLocaleString()} ₽ = {(item.quantity * item.price).toLocaleString()} ₽
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Нет товаров</p>
              )}
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrders;
