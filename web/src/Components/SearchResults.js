// SearchResults.js
import React, { useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from './ProductPage';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = ({ listings }) => {
  const query = useQuery().get('q') || '';
  const [selectedFilters, setSelectedFilters] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Hz-bay - Search Results';
    window.scrollTo(0, 0);
  }, []);
  // Function to handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  // Function to filter products
  const filterProducts = (products) => {
    if (selectedFilters.length === 0) return products;

    return products.filter(product => 
      selectedFilters.some(filter => product.category === filter)
    );
  };

  // Enhanced search logic
  const searchProducts = (listings, query) => {
    if (!query) return [];

    const keywords = query.toLowerCase().split(' ').filter(word => word);

    return Object.values(listings).flat().filter(product => {
      const productData = `${product.title} ${product.description}`.toLowerCase();
      return keywords.every(keyword => productData.includes(keyword));
    });
  };

  const results = filterProducts(searchProducts(listings, query));

  const handleProductClick = (product) => {
    navigate(`/product/${product.title.length > 20 ? `${product.title.substring(0, 20).replace('/', '%2f')}` : product.title}`);
  };

  return (
    <div className="container">

        {/* <div className="col-md-4">
          <h4>Filters</h4>
          <div className="list-group">
            {['Electronics', 'Appliances', 'Furniture'].map(category => (
              <button
                key={category}
                className={`list-group-item list-group-item-action ${selectedFilters.includes(category) ? 'active' : ''}`}
                onClick={() => handleFilterChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div> */}
        <div className="col" style={{marginTop: "100px"}}>
          <h2 className="mb-4">Search Results for "{query}"</h2>
          {results.length > 0 ? (
            <div className="col">
              {results.map(product => (
                <div className="col">
                  <Product product={product} onClick={() => handleProductClick(product)} />
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>

    </div>
  );
};

export default SearchResults;
