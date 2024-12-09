import React, { useState } from 'react';

const AddPackage = () => {
  const [pkg, setPkg] = useState({
    Ma_kih: '',
    Kich_thuoc: '',
    Loai_hang: '',
    Can_nang: '',
    Gt_kien_hang: '',
    Ma_ddh: '',
    Ma_kho: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkg({
      ...pkg,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!pkg.Ma_kih || !pkg.Kich_thuoc || !pkg.Loai_hang || !pkg.Can_nang || !pkg.Gt_kien_hang || !pkg.Ma_ddh || !pkg.Ma_kho) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/kienhang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pkg),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Package added successfully!');
        setPkg({
          Ma_kih: '',
          Kich_thuoc: '',
          Loai_hang: '',
          Can_nang: '',
          Gt_kien_hang: '',
          Ma_ddh: '',
          Ma_kho: ''
        });
      } else {
        alert(data.message || 'Error occurred while adding the package.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Unable to connect to the server.');
    }
  };

  return (
    <div className="container-fluid" style={{marginTop: '-50px'}}>
      <h2 className="text-center mb-4">Add Package</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded border">
            <div className="form-group row mb-3">
              <label htmlFor="Ma_kih" className="col-md-4 col-form-label">Package ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_kih"
                  name="Ma_kih"
                  value={pkg.Ma_kih}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Kich_thuoc" className="col-md-4 col-form-label">Size:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Kich_thuoc"
                  name="Kich_thuoc"
                  value={pkg.Kich_thuoc}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Loai_hang" className="col-md-4 col-form-label">Product Type:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Loai_hang"
                  name="Loai_hang"
                  value={pkg.Loai_hang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Can_nang" className="col-md-4 col-form-label">Weight:</label>
              <div className="col-md-8">
                <input
                  type="number"
                  className="form-control"
                  id="Can_nang"
                  name="Can_nang"
                  value={pkg.Can_nang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Gt_kien_hang" className="col-md-4 col-form-label">Package Value:</label>
              <div className="col-md-8">
                <input
                  type="number"
                  className="form-control"
                  id="Gt_kien_hang"
                  name="Gt_kien_hang"
                  value={pkg.Gt_kien_hang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Ma_ddh" className="col-md-4 col-form-label">Order ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_ddh"
                  name="Ma_ddh"
                  value={pkg.Ma_ddh}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Ma_kho" className="col-md-4 col-form-label">Warehouse ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_kho"
                  name="Ma_kho"
                  value={pkg.Ma_kho}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-4">Add Package</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
