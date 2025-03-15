import React from 'react';
import CheckoutBtn from './CheckoutBtn';
import { useCart } from './cart/CartContext';
import SearchBar from './SearchBar';

const Navigation = ({ handleViewCart }) => {
  const cart = useCart();
  return (
    <div className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">
        <a href="/" target="_blank" rel="noopener noreferrer" className="navbar-brand">
          <img src="/Hz-bay (1).png" height="72" alt="logo" />
        </a>
  
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item" onClick={handleViewCart} id="cart">
              <a className="nav-link" href='/' onClick={(e) => e.preventDefault()}>
                <i className="fas fa-shopping-cart me-2"></i>
                <span>My cart</span>
              </a>
            </li>
          </ul>

          <SearchBar/>

          {/* Free US Delivery Message */}
          <div className="d-flex align-items-center text-primary">
            <i className="fas fa-truck me-2"></i>
            <span >Free US Delivery 🚚</span>
          </div>

          {cart !== undefined && cart['cartItems'].length > 0 ? 
            <div className="text-center mt-3">
              <CheckoutBtn handleViewCart={handleViewCart}/>
            </div>
          : null}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
