import React, { useEffect } from 'react';

const OrderComplete = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card text-center border-0 shadow-lg">
            <div className="card-body">
              <i className="bi bi-check-circle-fill text-success mb-4" style={{ fontSize: '80px' }}></i>
              <h3 className="card-title mb-3">Order Complete!</h3>
              <p className="card-text text-muted mb-4">
                Thank you for your purchase. Your order has been successfully placed.
                You will receive an email confirmation shortly.
              </p>
              <a href="/" className="btn btn-primary btn-lg">Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
