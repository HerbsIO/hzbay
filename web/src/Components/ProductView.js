import React, { useEffect, useRef, useState } from 'react';
import { useCart } from './cart/CartContext';
import DOMPurify from 'dompurify';
import './ProductView.css';
import ProductOptions from '../Components/ProductOptions'
import ViewSimilarItems from './ViewSimilarItems';

const ProductView = ({ product, onBack, listings }) => {
  const [cost, setCost] = useState(false)
  useEffect(() => {
    document.title = 'Hz-bay - ' + product.title;
    window.scrollTo(0, 0);
  }, []);
  const { cartItems, addToCart } = useCart();

  // Check if the product is already in the cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.title === productId);
  };

  // Handle adding product to cart
  const handleAddToCart = async (id, title, price, imgSrc) => {
    if (isInCart(title)) {
      const updatedCartItems = cartItems.map((item) =>
        item.title === title ? {...item, quantity: item.quantity + 1 } : item
      );
      addToCart(updatedCartItems);
    } else {
      
      addToCart([...cartItems, { id, title, price, imgSrc, quantity: 1 }]);
    }
  };

  // Sanitize HTML to prevent XSS attacks
  const sanitizeHtml = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // Calculate the estimated delivery date range
  const calculateDeliveryRange = () => {
    const today = new Date();
    const minDeliveryDate = new Date(today);
    const maxDeliveryDate = new Date(today);

    minDeliveryDate.setDate(today.getDate() + 2);
    maxDeliveryDate.setDate(today.getDate() + 4);

    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    return `${formatDate(minDeliveryDate)} - ${formatDate(maxDeliveryDate)}`;
  };

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="container mt-5 product-view-container" style={{marginTop: '100px'}}>

      <button onClick={onBack} className="btn btn-secondary mb-3">Back to Products</button>
      <div className="row fade-in-target">
        <div className="col-md-6">
          <div id="carouselExampleCaptions" className="carousel slide">
            <ol className="carousel-indicators">
              {product.images && product.images.map((_, index) => (
                <li
                  key={index}
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                ></li>
              ))}
            </ol>
            <div className="carousel-inner">
              {product.images && product.images.map((image, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                  <img style={{width: "22em"}} src={'/images/' + image} className="d-block m-auto" alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </div>
            <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </a>
          </div>
        </div>
        <div className="col-md-6">
          <div className="product-details">
            <h2 className="product-title">{product.title}</h2>
            <p className="product-price text-muted">{product.price}</p>
            {product.options && product.options.sizesPrices ? <ProductOptions product={product} setProductPrice={setCost}/>:null}
            <button
              type="button"
              className="btn btn-primary text-white"
              onClick={() =>
                handleAddToCart(
                  product.id,
                  product.title,
                  parseFloat(product.price.replace('US $', '')),
                  product.images[0]
                )
              }
              disabled={!product.inStock}
            >
              {isInCart(product.title) ? 'Add More' : 'Add to Cart'}
            </button>
            {/* Stock Status Indicator */}
            <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'} mt-3`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
            {/* Estimated Delivery Information */}
            <div className="delivery-info d-flex align-items-center mt-3">
              <div className="delivery-icon mr-2">
                <i className="fas fa-truck"></i>
              </div>
              <div className="delivery-text">
                Estimated Delivery: {calculateDeliveryRange()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
              <ViewSimilarItems product={product} listings={listings} />
          <div className="product-description" dangerouslySetInnerHTML={sanitizeHtml(product.description)}></div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
