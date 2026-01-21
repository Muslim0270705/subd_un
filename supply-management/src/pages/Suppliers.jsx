import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'ООО "Поставщик-1"', contact: 'Иванов И.И.', phone: '+7 (999) 123-45-67', email: 'supplier1@example.com', address: 'г. Москва, ул. Ленина, 1' },
    { id: 2, name: 'ООО "Поставщик-2"', contact: 'Петров П.П.', phone: '+7 (999) 234-56-78', email: 'supplier2@example.com', address: 'г. Санкт-Петербург, ул. Невский, 50' },
    { id: 3, name: 'ИП Сидоров', contact: 'Сидоров С.С.', phone: '+7 (999) 345-67-89', email: 'sidorov@example.com', address: 'г. Казань, ул. Баумана, 25' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Контактное лицо',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Удалить поставщика?"
            description="Вы уверены, что хотите удалить этого поставщика?"
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

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    message.success('Поставщик удален');
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingSupplier) {
        setSuppliers(suppliers.map(s =>
          s.id === editingSupplier.id ? { ...s, ...values } : s
        ));
        message.success('Поставщик обновлен');
      } else {
        const newSupplier = {
          id: Math.max(...suppliers.map(s => s.id)) + 1,
          ...values,
        };
        setSuppliers([...suppliers, newSupplier]);
        message.success('Поставщик добавлен');
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
        <h1>Поставщики</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить поставщика
        </Button>
      </div>

      <Table columns={columns} dataSource={suppliers} rowKey="id" />

      <Modal
        title={editingSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Контактное лицо"
            rules={[{ required: true, message: 'Введите контактное лицо' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Телефон"
            rules={[{ required: true, message: 'Введите телефон' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Адрес"
            rules={[{ required: true, message: 'Введите адрес' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Suppliers;
