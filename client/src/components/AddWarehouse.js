import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './AddWarehouse.css'; // Link to the CSS file for styling (optional)

const AddWarehouse = () => {
  const [warehouse, setWarehouse] = useState({
    Ma_kho: '',
    Dia_chi: '',
    Suc_chua_toi_da: '',
    So_luong_kien_hang: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse({
      ...warehouse,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation to ensure all fields are filled
    if (!warehouse.Ma_kho || !warehouse.Dia_chi || !warehouse.Suc_chua_toi_da || !warehouse.So_luong_kien_hang) {
      alert('Please fill out all the information.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/khohang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouse),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Warehouse created successfully!');
        navigate('/warehouses');
      } else {
        alert(data.message || 'Error occurred while creating the warehouse.');
      }
    } catch (error) {
      console.error('Error when creating warehouse:', error);
      alert('Unable to connect to the server.');
    }
  };

  return (
    <div className="container-fluid mt-3">
      <h2 className="text-center mb-4">Add Warehouse</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded border">
            <div className="form-group row mb-3">
              <label htmlFor="Ma_kho" className="col-md-4 col-form-label">Warehouse ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_kho"
                  name="Ma_kho"
                  value={warehouse.Ma_kho}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="Dia_chi" className="col-md-4 col-form-label">Address:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Dia_chi"
                  name="Dia_chi"
                  value={warehouse.Dia_chi}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="Suc_chua_toi_da" className="col-md-4 col-form-label">Storage Capacity::</label>
              <div className="col-md-8">
                <input
                  type="number"
                  className="form-control"
                  id="Suc_chua_toi_da"
                  name="Suc_chua_toi_da"
                  value={warehouse.Suc_chua_toi_da}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="So_luong_kien_hang" className="col-md-4 col-form-label">Number of Packages:</label>
              <div className="col-md-8">
                <input
                  type="number"
                  className="form-control"
                  id="So_luong_kien_hang"
                  name="So_luong_kien_hang"
                  value={warehouse.So_luong_kien_hang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Add Warehouse:</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouse;
