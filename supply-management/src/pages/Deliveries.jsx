import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm, message, Tag, Card, Timeline } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      deliveryNumber: 'DEL-2024-001',
      orderNumber: 'PO-2024-001',
      supplier: 'ООО "Поставщик-1"',
      shippedDate: '2024-01-20',
      estimatedArrival: '2024-01-25',
      actualArrival: null,
      status: 'in_transit',
      trackingNumber: 'TR123456789',
      carrier: 'DHL',
      notes: 'Хрупкий груз',
    },
    {
      id: 2,
      deliveryNumber: 'DEL-2024-002',
      orderNumber: 'PO-2024-002',
      supplier: 'ООО "Поставщик-2"',
      shippedDate: '2024-01-18',
      estimatedArrival: '2024-01-22',
      actualArrival: '2024-01-22',
      status: 'delivered',
      trackingNumber: 'TR987654321',
      carrier: 'СДЭК',
      notes: 'Доставлено в срок',
    },
    {
      id: 3,
      deliveryNumber: 'DEL-2024-003',
      orderNumber: 'PO-2024-003',
      supplier: 'ИП Сидоров',
      shippedDate: '2024-01-19',
      estimatedArrival: '2024-01-23',
      actualArrival: null,
      status: 'pending',
      trackingNumber: 'TR555666777',
      carrier: 'Почта России',
      notes: '',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [viewingDelivery, setViewingDelivery] = useState(null);
  const [form] = Form.useForm();

  const orderNumbers = ['PO-2024-001', 'PO-2024-002', 'PO-2024-003'];
  const suppliers = ['ООО "Поставщик-1"', 'ООО "Поставщик-2"', 'ИП Сидоров'];
  const carriers = ['DHL', 'СДЭК', 'Почта России', 'Деловые Линии', 'ПЭК'];

  const statusConfig = {
    pending: { text: 'Ожидает отправки', color: 'default' },
    in_transit: { text: 'В пути', color: 'processing' },
    delivered: { text: 'Доставлено', color: 'success' },
    delayed: { text: 'Задержка', color: 'warning' },
    cancelled: { text: 'Отменено', color: 'error' },
  };

  const columns = [
    {
      title: 'Номер поставки',
      dataIndex: 'deliveryNumber',
      key: 'deliveryNumber',
    },
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
      title: 'Перевозчик',
      dataIndex: 'carrier',
      key: 'carrier',
    },
    {
      title: 'Дата отправки',
      dataIndex: 'shippedDate',
      key: 'shippedDate',
      render: (date) => dayjs(date).format('DD.MM.YYYY'),
    },
    {
      title: 'Ожидаемое прибытие',
      dataIndex: 'estimatedArrival',
      key: 'estimatedArrival',
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
            title="Удалить поставку?"
            description="Вы уверены, что хотите удалить эту поставку?"
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

  const handleView = (delivery) => {
    setViewingDelivery(delivery);
    setIsViewModalOpen(true);
  };

  const handleEdit = (delivery) => {
    setEditingDelivery(delivery);
    form.setFieldsValue({
      ...delivery,
      shippedDate: dayjs(delivery.shippedDate),
      estimatedArrival: dayjs(delivery.estimatedArrival),
      actualArrival: delivery.actualArrival ? dayjs(delivery.actualArrival) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeliveries(deliveries.filter(d => d.id !== id));
    message.success('Поставка удалена');
  };

  const handleAdd = () => {
    setEditingDelivery(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        shippedDate: values.shippedDate.format('YYYY-MM-DD'),
        estimatedArrival: values.estimatedArrival.format('YYYY-MM-DD'),
        actualArrival: values.actualArrival ? values.actualArrival.format('YYYY-MM-DD') : null,
      };

      if (editingDelivery) {
        setDeliveries(deliveries.map(d =>
          d.id === editingDelivery.id ? { ...d, ...formattedValues } : d
        ));
        message.success('Поставка обновлена');
      } else {
        const newDelivery = {
          id: Math.max(...deliveries.map(d => d.id)) + 1,
          deliveryNumber: `DEL-2024-${String(deliveries.length + 1).padStart(3, '0')}`,
          ...formattedValues,
        };
        setDeliveries([...deliveries, newDelivery]);
        message.success('Поставка добавлена');
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
        <h1>Поставки</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить поставку
        </Button>
      </div>

      <Table columns={columns} dataSource={deliveries} rowKey="id" />

      <Modal
        title={editingDelivery ? 'Редактировать поставку' : 'Добавить поставку'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="orderNumber"
            label="Номер заказа"
            rules={[{ required: true, message: 'Выберите номер заказа' }]}
          >
            <Select>
              {orderNumbers.map(order => (
                <Select.Option key={order} value={order}>{order}</Select.Option>
              ))}
            </Select>
          </Form.Item>
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
            name="carrier"
            label="Перевозчик"
            rules={[{ required: true, message: 'Выберите перевозчика' }]}
          >
            <Select>
              {carriers.map(carrier => (
                <Select.Option key={carrier} value={carrier}>{carrier}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="trackingNumber"
            label="Трек-номер"
            rules={[{ required: true, message: 'Введите трек-номер' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shippedDate"
            label="Дата отправки"
            rules={[{ required: true, message: 'Выберите дату отправки' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="estimatedArrival"
            label="Ожидаемое прибытие"
            rules={[{ required: true, message: 'Выберите дату прибытия' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="actualArrival"
            label="Фактическое прибытие"
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
            name="notes"
            label="Примечания"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Детали поставки"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Закрыть
          </Button>
        ]}
        width={700}
      >
        {viewingDelivery && (
          <Card>
            <p><strong>Номер поставки:</strong> {viewingDelivery.deliveryNumber}</p>
            <p><strong>Номер заказа:</strong> {viewingDelivery.orderNumber}</p>
            <p><strong>Поставщик:</strong> {viewingDelivery.supplier}</p>
            <p><strong>Перевозчик:</strong> {viewingDelivery.carrier}</p>
            <p><strong>Трек-номер:</strong> {viewingDelivery.trackingNumber}</p>
            <p><strong>Статус:</strong> <Tag color={statusConfig[viewingDelivery.status].color}>{statusConfig[viewingDelivery.status].text}</Tag></p>

            <div style={{ marginTop: 20, marginBottom: 10 }}>
              <strong>Временная шкала:</strong>
            </div>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: `Дата отправки: ${dayjs(viewingDelivery.shippedDate).format('DD.MM.YYYY')}`,
                },
                {
                  color: viewingDelivery.actualArrival ? 'green' : 'blue',
                  children: `Ожидаемое прибытие: ${dayjs(viewingDelivery.estimatedArrival).format('DD.MM.YYYY')}`,
                },
                viewingDelivery.actualArrival && {
                  color: 'green',
                  children: `Фактическое прибытие: ${dayjs(viewingDelivery.actualArrival).format('DD.MM.YYYY')}`,
                },
              ].filter(Boolean)}
            />

            {viewingDelivery.notes && (
              <div style={{ marginTop: 16 }}>
                <strong>Примечания:</strong>
                <p>{viewingDelivery.notes}</p>
              </div>
            )}
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default Deliveries;
