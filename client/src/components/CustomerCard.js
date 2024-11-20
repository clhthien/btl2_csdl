import React from 'react';

const CustomerCard = ({ customer }) => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">{customer.name}</h5>
        <p className="card-text">{customer.email}</p>
        <p className="card-text">{customer.phone}</p>
      </div>
    </div>
  );
};

export default CustomerCard;
