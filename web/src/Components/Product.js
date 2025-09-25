import React from 'react';
import { useCart } from './cart/CartContext';

const Product = ({ imgSrc, title, price, id, onClick }) => {
  const { cartItems, addToCart } = useCart();

  // Function to check if a product is already in the cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Function to handle adding a product to the cart
  const handleAddToCart = () => {
    // Check if the product is already in the cart
    if (isInCart(id)) {
      // If yes, update the quantity of the existing item
      const updatedCartItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      addToCart(updatedCartItems); // Update cart with new array
    } else {
      // If no, add the new item to the cart
      addToCart([...cartItems, { id, title, price, imgSrc, quantity: 1 }]);
    }
  };

  return (
    <div className="col-lg-3 col-md-6 col-sm-6 d-flex" onClick={onClick}>
      <div className="card w-100 my-2 shadow-2-strong">
        <img
          src={imgSrc}
          className="card-img-top img-fluid"
          alt={title}
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <div className="card-body text-center">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{price}</p>
          <div className="card-footer">
            <button onClick={handleAddToCart} className="btn btn-primary shadow-0 me-1">
              {isInCart(id) ? 'Add More' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
