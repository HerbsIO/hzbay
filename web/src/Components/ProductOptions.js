import { useState } from "react";

const ProductOptionsSelector = ({ product, setProductPrice }) => {
    // Extract colors and sizes from product options
    const { color, sizesPrices } = product.options;
    const sizes = Object.entries(sizesPrices).map(([size, price]) => ({ size, price }));
  
    // Initial state for selected options
    const [selectedColor, setSelectedColor] = useState(color);
    const [selectedSize, setSelectedSize] = useState(sizes[0].size);
    const [price, setPrice] = useState(sizes[0].price);
  
    // Handle color change
    const handleColorChange = (newColor) => {
      setSelectedColor(newColor);
      // You can handle additional logic related to color change here if needed
    };
  
    // Handle size change
    const handleSizeChange = (size) => {
      const selected = sizes.find(s => s.size === size);
      if (selected) {
        setSelectedSize(selected.size);
        setPrice(selected.price);
      }
    };
  
    return (
      <div className="container mt-4">
        <h2 className="mb-3">Product Options</h2>
        <p className="mb-3">Selected Color: <span className="font-weight-bold">{selectedColor}</span></p>
        <p className="mb-3">Price: <span className="font-weight-bold">${price.toFixed(2)}</span></p>
  
        <div className="mb-3">
          <label className="form-label">Select Color:</label>
          <div className="btn-group" role="group" aria-label="Color selection">
            <button
              type="button"
              className={`btn btn-outline-primary ${selectedColor === 'grey' ? 'active' : ''}`}
              onClick={() => handleColorChange('grey')}
            >
              Grey
            </button>
            {/* Add more color options as needed */}
          </div>
        </div>
  
        <div className="mb-3">
          <label className="form-label">Select Size:</label>
          <div className="btn-group" role="group" aria-label="Size selection">
            {sizes.map((size) => (
              <button
                key={size.size}
                type="button"
                className={`btn btn-outline-primary ${size.size === selectedSize ? 'active' : ''}`}
                onClick={() => handleSizeChange(size.size)}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>
  
        <div className="mt-4">
          <button className="btn btn-success">Add to Cart</button>
        </div>
      </div>
    );
  };

export default ProductOptionsSelector;