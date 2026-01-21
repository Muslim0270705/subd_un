import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import PurchaseOrders from './pages/PurchaseOrders';
import Deliveries from './pages/Deliveries';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="products" element={<Products />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="deliveries" element={<Deliveries />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
