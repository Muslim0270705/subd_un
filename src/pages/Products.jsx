import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Ноутбук Dell XPS 15', sku: 'DELL-XPS-15', category: 'Электроника', price: 85000, stock: 15, unit: 'шт' },
    { id: 2, name: 'Офисное кресло Comfort Pro', sku: 'CHAIR-CP-001', category: 'Мебель', price: 12500, stock: 45, unit: 'шт' },
    { id: 3, name: 'Бумага А4, 500 листов', sku: 'PAPER-A4-500', category: 'Канцтовары', price: 350, stock: 250, unit: 'уп' },
    { id: 4, name: 'Монитор LG 27"', sku: 'LG-MON-27', category: 'Электроника', price: 25000, stock: 30, unit: 'шт' },
    { id: 5, name: 'Стол офисный 120x60', sku: 'DESK-120-60', category: 'Мебель', price: 8500, stock: 20, unit: 'шт' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const categories = ['Электроника', 'Мебель', 'Канцтовары', 'Оборудование', 'Расходные материалы'];
  const units = ['шт', 'уп', 'кг', 'л', 'м'];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Артикул',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const colors = {
          'Электроника': 'blue',
          'Мебель': 'green',
          'Канцтовары': 'orange',
          'Оборудование': 'purple',
          'Расходные материалы': 'cyan'
        };
        return <Tag color={colors[category]}>{category}</Tag>;
      },
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} ₽`,
    },
    {
      title: 'Остаток',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock, record) => `${stock} ${record.unit}`,
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
            title="Удалить товар?"
            description="Вы уверены, что хотите удалить этот товар?"
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

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    message.success('Товар удален');
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        setProducts(products.map(p =>
          p.id === editingProduct.id ? { ...p, ...values } : p
        ));
        message.success('Товар обновлен');
      } else {
        const newProduct = {
          id: Math.max(...products.map(p => p.id)) + 1,
          ...values,
        };
        setProducts([...products, newProduct]);
        message.success('Товар добавлен');
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
        <h1>Товары</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить товар
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" />

      <Modal
        title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="sku"
            label="Артикул"
            rules={[{ required: true, message: 'Введите артикул' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select>
              {categories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              addonAfter="₽"
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Остаток"
            rules={[{ required: true, message: 'Введите остаток' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Единица измерения"
            rules={[{ required: true, message: 'Выберите единицу измерения' }]}
          >
            <Select>
              {units.map(unit => (
                <Select.Option key={unit} value={unit}>{unit}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
