import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import file CSS
import { FaUsers, FaListUl, FaBox, FaStoreAlt } from 'react-icons/fa'; // Import các icon cần sử dụng
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom

const Dashboard = () => {
  const [customers, setCustomers] = useState([]); // Lưu trữ danh sách khách hàng
  const [orders, setOrders] = useState([]); // Lưu trữ danh sách đơn đặt hàng
  const [items, setItems] = useState([]); // Lưu trữ danh sách kiện hàng
  const [warehouses, setWarehouses] = useState([]); // Lưu trữ danh sách kho hàng
  const [loading, setLoading] = useState(true); // Kiểm tra trạng thái loading

  // Hàm gọi API
  const fetchData = async () => {
    try {
      // Gọi API khách hàng
      const customersResponse = await fetch(`${process.env.REACT_APP_API_URL}/khachhang`);
      const customersData = await customersResponse.json();
      setCustomers(customersData);

      // Gọi API đơn đặt hàng
      const ordersResponse = await fetch(`${process.env.REACT_APP_API_URL}/dondathang`);
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      // Gọi API kiện hàng
      const itemsResponse = await fetch(`${process.env.REACT_APP_API_URL}/kienhang`);
      const itemsData = await itemsResponse.json();
      setItems(itemsData);

      // Gọi API kho hàng
      const warehousesResponse = await fetch(`${process.env.REACT_APP_API_URL}/khohang`);
      const warehousesData = await warehousesResponse.json();
      setWarehouses(warehousesData);

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false); // Đặt lại trạng thái loading
    }
  };

  useEffect(() => {
    fetchData(); // Gọi hàm fetch khi component được render
  }, []);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome to the Dashboard</h1>
        <p>Overview of your system.</p>
      </div>

      {/* Hiển thị loading nếu dữ liệu chưa tải xong */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {/* Hàng đầu tiên chứa Total Customers và Total Orders */}
          <div className="row dashboard-cards">
            {/* Card hiển thị số lượng khách hàng với link chuyển hướng */}
            <div className="col-md-4">
              <Link to="/customers" className="card-link">
                <div className="card hover-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <FaUsers /> Total Customers
                    </h5>
                    <p className="card-text" style={{ fontSize: '40px' }}>
                      {customers.length}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Card hiển thị số lượng đơn đặt hàng */}
            <div className="col-md-4">
              <Link to="/orders" className="card-link">
                <div className="card hover-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <FaListUl /> Total Orders
                    </h5>
                    <p className="card-text" style={{ fontSize: '40px' }}>
                      {orders.length}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Hàng thứ hai chứa Total Packages và Total Warehouses */}
          <div className="row" style={{ marginTop: '30px' }}>
            {/* Card hiển thị số lượng kiện hàng */}
            <div className="col-md-4">
              <Link to="/packages" className="card-link">
                <div className="card hover-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <FaBox /> Total Packages
                    </h5>
                    <p className="card-text" style={{ fontSize: '40px' }}>
                      {items.length}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Card hiển thị số lượng kho hàng */}
            <div className="col-md-4">
              <Link to="/warehouses" className="card-link">
                <div className="card hover-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <FaStoreAlt /> Total Warehouses
                    </h5>
                    <p className="card-text" style={{ fontSize: '40px' }}>
                      {warehouses.length}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>

  );
};

export default Dashboard;
