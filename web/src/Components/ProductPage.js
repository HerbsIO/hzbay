import React, { useEffect, useState, useRef } from 'react';
import { useCart } from './cart/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
const CategorySelector = ({ categories, selectedCategory }) => {
  const sliderRef = useRef(null);
  const buttonRefs = useRef([]);
  const navigate = useNavigate(); // Use navigate to update the URL

  useEffect(() => {
    if (selectedCategory && sliderRef.current && buttonRefs.current.length) {
      const activeButton = buttonRefs.current[categories.indexOf(selectedCategory)];
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton;
        sliderRef.current.style.left = `${offsetLeft}px`;
        sliderRef.current.style.width = `${offsetWidth}px`;
      }
    } else if (sliderRef.current) {
      sliderRef.current.style.width = '0';
    }
  }, [selectedCategory, categories]);

  const handleClick = (category) => {
    navigate(`/products/${category}`); // Update the URL
  };

  return (
    <div className="category-selector mb-3 position-relative d-flex flex-wrap justify-content-center">
      <div className="category-slider position-absolute bg-primary" ref={sliderRef}></div>
      {categories.map((category, index) => (
        <button
          key={category}
          ref={(el) => (buttonRefs.current[index] = el)}
          className={`btn btn-outline-primary mx-1 my-1 ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => handleClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};


export const Product = ({ product, isLoading, onClick }) => {
  const { cartItems, addToCart } = useCart();

  const isInCart = (productId) => {
    return cartItems.some((item) => item.title === productId);
  };

  const handleAddToCart = async (id, title, price, imgSrc) => {
    if (isInCart(title)) {
      const updatedCartItems = cartItems.map((item) =>
        item.title === title ? { ...item, quantity: item.quantity + 1 } : item
      );
      addToCart(updatedCartItems);
    } else {
      addToCart([...cartItems, { id, title, price, imgSrc, quantity: 1 }]);
    }
  };

  if (!product || !product.title) {
    return null;
  }

  return (
    <div className="product-card fade-in-target" onClick={onClick}>
      <img src={'https://www.hz-bay.com/images' + product.images[0]} className="product-image" alt={product.title} />
      <div className="product-details">
        <h5 className="product-title"><a className="title-link" href={"/product/" + product.id} onClick={(e) => e.preventDefault()}>{product.title}</a></h5>
        {product.options && product.options.sizesPrices ? (
  <p>
    {Object.keys(product.options.sizesPrices)[0]} - {Object.keys(product.options.sizesPrices)[Object.keys(product.options.sizesPrices).length - 1]}
  </p>
) : null}        <p className="product-price">{product.price}</p>
        <button
          type="button"
          className="btn btn-primary text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(
              product.id,
              product.title,
              parseFloat(product.price.replace('US $', '')),
              product.images[0]
            );
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="spinner-border text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : isInCart(product.title) ? (
            'Add More'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

let productsData = {};
fetch('/products.json')
  .then(response => response.json())
  .then(data => {
    productsData = data;
  })
  .catch(error => {
    console.error('Error fetching product listings:', error);
  });

const ProductPage = ({ handleProductClick }) => {
  const { category } = useParams(); // Get category from URL params
  const decodedCategory = decodeURIComponent(category);

  const navigate = useNavigate(); // Use navigate to update the URL
  const { cartItems, addToCart } = useCart();
  const categories = [
    'Accessories',
    'Systems & Consoles',
    'PC Components',
    'Displays',
    'Drones',
    'Cables & Adapters',
    'Cameras & Microphones'
  ];
  const [selectedCategory, setSelectedCategory] = useState(category || 'Accessories');
  const [isLoading, setIsLoading] = useState(false);
  const checkEls = async () => {
    const elements = document.querySelectorAll('.fade-in-target');
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  
      // Adjust visibility threshold to 10%
      const threshold = 0.1;
  
      return (
        (rect.top + rect.height * threshold) <= viewportHeight &&
        (rect.bottom - rect.height * threshold) >= 0 &&
        (rect.left + rect.width * threshold) <= viewportWidth &&
        (rect.right - rect.width * threshold) >= 0
      );
    }
    for (const el of elements) {
      // Check if element is in viewport and has not been animated yet
      if (isElementInViewport(el) && !el.classList.contains('animated')) {
        el.classList.add('fade-in-forward', 'animated');
        el.classList.remove('fade-in-target');
        

        await new Promise((res) => setTimeout(res, 150));
      }
    }
  }

  useEffect(() => {
    // Update state when URL parameter changes
    if (category) {
      setSelectedCategory(decodedCategory);
    }
  }, [category]);

  useEffect(() => {
    checkEls();
  }, [selectedCategory])
  useEffect(() => {
    document.title = 'Hz-bay - Computers | Electronics | Accessories | Components | Controllers';


    checkEls();
  }, []);

  const handleSelectCategory = (category) => {
    window.scrollTo(0, 0);

    setSelectedCategory(decodedCategory);
    navigate(`/products/${category}`); // Update the URL
  };

  const filteredProducts = selectedCategory
    ? productsData[selectedCategory] || []
    : Object.values(productsData).flat();

  const isInCart = (productId) => {
    return cartItems.some((item) => item.title === productId);
  };

  const handleAddToCart = async (id, title, price, imgSrc) => {
    if (isInCart(title)) {
      const updatedCartItems = cartItems.map((item) =>
        item.title === title ? { ...item, quantity: item.quantity + 1 } : item
      );
      addToCart(updatedCartItems);
    } else {
      addToCart([...cartItems, { id, title, price, imgSrc, quantity: 1 }]);
    }

  };

  return (
    <div className="container" style={{marginTop: "100px"}}>
      <div className="bg-primary text-white" style={{paddingTop: "14px"}}>
        <h1>All Products</h1>
        <div className="container">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col">
        {filteredProducts.map((product) => (
          !product.inStock ? null :
          <div key={product.id}>
            <Product product={product} onClick={() => { handleProductClick(product); }} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProductPage;
