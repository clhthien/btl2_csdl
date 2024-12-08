import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const WarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/khohang')
      .then((response) => response.json())
      .then((data) => {
        setWarehouses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching warehouses:', error);
        setLoading(false);
      });
  }, []);

  const deleteWarehouse = (id) => {
    fetch(process.env.REACT_APP_API_URL + 'khohang/' + id, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
        setWarehouses(warehouses.filter(wh => wh.Ma_kho !== id));
      })
      .catch((error) => console.error('Error deleting warehouse:', error));
  };

  const updateWarehouse = (id) => {
    navigate(`/warehouses/update/${id}`);
  };

  return (
    <div className="container mt-5">
      <h1>Danh sách Kho Hàng</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Mã Kho</th>
              <th>Địa Chỉ</th>
              <th>Sức Chứa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td colSpan="4">Không có kho hàng nào.</td>
              </tr>
            ) : (
              warehouses.map((wh) => (
                <tr key={wh.Ma_kho}>
                  <td>{wh.Ma_kho}</td>
                  <td>{wh.Dia_chi}</td>
                  <td>{wh.Suc_chua}</td>
                  <td>
                    <button className="btn btn-warning mr-2" onClick={() => updateWarehouse(wh.Ma_kho)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteWarehouse(wh.Ma_kho)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WarehousesList;
