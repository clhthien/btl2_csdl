import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePackage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [pkg, setPkg] = useState({
    Ma_kih: '',
    Kich_thuoc: '',
    Loai_hang: '',
    Can_nang: '',
    Gt_kien_hang: '',
    Ma_ddh: '',
    Ma_kho: ''
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/kienhang/' + id)
      .then((response) => response.json())
      .then((data) => setPkg(data))
      .catch((error) => console.error('Error fetching package:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkg({
      ...pkg,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pkg.Ma_kih || !pkg.Kich_thuoc || !pkg.Loai_hang || !pkg.Can_nang || !pkg.Gt_kien_hang || !pkg.Ma_ddh || !pkg.Ma_kho) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/kienhang/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pkg),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Package updated successfully!');
        navigate('/packages'); // Navigate to the package list after updating
      } else {
        alert(data.message || 'An error occurred while updating the package.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Could not connect to the server.');
    }
  };

  const handleCancel = () => {
    navigate('/packages'); // Navigate to the package list without making changes
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4" style={{ width: '600px' }}>
        <h2 className="text-center mb-4">Update Package Information</h2>
        {/* Package information form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="packageId" className="col-sm-4 col-form-label">Package ID:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="packageId"
                name="Ma_kih"
                value={pkg.Ma_kih}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="size" className="col-sm-4 col-form-label">Size:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="size"
                name="Kich_thuoc"
                value={pkg.Kich_thuoc}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="type" className="col-sm-4 col-form-label">Type:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="type"
                name="Loai_hang"
                value={pkg.Loai_hang}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="weight" className="col-sm-4 col-form-label">Weight:</label>
            <div className="col-sm-8">
              <input
                type="number"
                className="form-control"
                id="weight"
                name="Can_nang"
                value={pkg.Can_nang}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="unitPrice" className="col-sm-4 col-form-label">Unit Price:</label>
            <div className="col-sm-8">
              <input
                type="number"
                className="form-control"
                id="unitPrice"
                name="Gt_kien_hang"
                value={pkg.Gt_kien_hang}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="orderId" className="col-sm-4 col-form-label">Order ID:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="orderId"
                name="Ma_ddh"
                value={pkg.Ma_ddh}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="warehouseId" className="col-sm-4 col-form-label">Warehouse ID:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="warehouseId"
                name="Ma_kho"
                value={pkg.Ma_kho}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary me-2">
              Update Package
            </button>
            <button
              type="submit"
              className="btn btn-secondary ms-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePackage;
