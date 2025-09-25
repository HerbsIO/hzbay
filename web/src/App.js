import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import './App.css'; // Ensure this includes your font styles
import Cart from './Components/cart/Cart';
import { CartProvider, useCart } from './Components/cart/CartContext';
import ProductPage from './Components/ProductPage';
import Navigation from './Components/Nav';
import { Product } from './Components/ProductPage';
import ProductView from './Components/ProductView';
import SearchResults from './Components/SearchResults';
import { SearchProvider } from './Components/SearchContext';
import { useSearch } from './Components/SearchContext';
import SearchBar from './Components/SearchBar';
import OrderComplete from './Components/OrderComplete';
import { AppAppBar } from './Components/AppBar/AppAppBar'
import { StyledInputBase } from './Components/AppBar/AppAppBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchAppBar from './Components/SearchAppBar';
import SearchIcon from '@mui/icons-material/Search'
import { Search, SearchIconWrapper } from './Components/AppBar/AppAppBar';
import { Container, Grid, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import WelcomeCard from './Components/WelcomeCard';

const theme = createTheme({
  palette: {
    searchbars: '#212121',
    primary: {
      main: '#0d6efd',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#ff4400',
    },
    background: {
      default: '#fff',
    },
  },
});

const AppContent = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  const [listings, setListings] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check elements position for fade-in animation
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
  async function checkElements() {
    const elements = document.querySelectorAll('.fade-in-target');
  
    for (const el of elements) {
      // Check if element is in viewport and has not been animated yet
      if (isElementInViewport(el) && !el.classList.contains('animated')) {
        el.classList.add('fade-in-forward', 'animated');
        el.classList.remove('fade-in-target');
        

        await new Promise((res) => setTimeout(res, 150));
      }
    }
  }
  
  // Check elements on scroll, resize, load, popstate, and hashchange
  useEffect(() => {
    window.addEventListener('scroll', checkElements);
    window.addEventListener('resize', checkElements);
    window.addEventListener('load', checkElements);
    window.addEventListener('popstate', checkElements);
    window.addEventListener('hashchange', checkElements);

    // Initial check in case elements are already in view
    document.addEventListener('DOMContentLoaded', checkElements);
    checkElements();

    return () => {
      window.removeEventListener('scroll', checkElements);
      window.removeEventListener('resize', checkElements);
      window.removeEventListener('load', checkElements);
      window.removeEventListener('popstate', checkElements);
      window.removeEventListener('hashchange', checkElements);

    }
  }, []);

  useEffect(() => {
    checkElements();
  }, [location.pathname])


  // Fetch product listings on component mount
  useEffect(() => {
    fetch('/products.json')
      .then(response => response.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product listings:', error);
        setLoading(false);
      });
  }, []);

  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);

  const handleProductClick = (product) => {
    navigate(`/product/${product.title.length > 20 ? `${product.title.substring(0, 20).replace('/', '%2f')}` : product.title}`);
    checkElements();
  };

  const { searchQuery } = useSearch();

  const handleBackToProducts = () => {
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    } else {
      navigate('/products');
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading products... 🛒</p>;
  }

  return (
    <>

      <AppAppBar handleViewCart={handleOpenCart} />
      <div className="App">
        <Cart isOpen={isCartOpen} onClose={handleCloseCart} />

        <Routes>
          <Route
            path="/product/:title"
            element={<ProductDetail onBack={handleBackToProducts} listings={listings} />}
          />
          <Route
            path="/search"
            element={<SearchResults listings={listings} />}
          />
          <Route
            path="/"
            element={
              <>
                <div className="bg-header text-white py-5">
                  <div className="container py-5">
                    <div className="row align-items-center">
                      <div className="col-lg-6 fade-in-target">
                        <h2 className="mb-4">⚡ Elevate Your Tech Game Today with Hz-bay ⚡</h2>
                        <h4>Trendy products, great prices. 💻✨</h4>
                        <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginBottom: "1em" }}>
                          Browse Products
                        </button>
                      </div>
                      <div className="col-lg-6 fade-in-target">
                        <Search>
                          <SearchIconWrapper>
                            <SearchIcon />
                          </SearchIconWrapper>
                          <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                          />
                        </Search>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="display-4 text-center mt-4 fade-in-target">🔥 Trending Tech 🔥</h1>

                <div className="container row mx-auto mt-4 fade-in-target">
                  {listings['Systems & Consoles'] && listings['Systems & Consoles'].slice(0, 4).map((product, index) => (
                    <div>
                      <Product key={index} product={product} onClick={() => handleProductClick(product)} />
                    </div>
                  ))}
                  {listings['Accessories'] && listings['Accessories'].slice(0, 4).map((product, index) => (
                    <div>
                      <Product key={index} product={product} onClick={() => handleProductClick(product)} />
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3 fade-in-target">
                  <button className="btn btn-primary" onClick={() => navigate('/products')}>
                    View More Products
                  </button>
                </div>

                <WelcomeCard />
              </>
            }
          />
          <Route path="/products/:category" element={<ProductPage handleProductClick={handleProductClick} />} />
          <Route path="/products" element={<ProductPage handleProductClick={handleProductClick} />} />
          <Route path="/order" element={<OrderComplete />} />
        </Routes>
      </div>
    </>
  );
};

const ProductDetail = ({ listings, onBack }) => {
  const { title } = useParams();
  const truncatedTitle = title.length > 20 ? `${title.substring(0, 20).replace('/', '%2F')}` : title;

  const product = Object.values(listings).flat().find(p => p.title.includes(truncatedTitle));

  if (!product) {
    return <p className="text-center mt-5">Product not found. 😢</p>;
  }

  return (
    <ProductView
      product={product}
      onBack={onBack}
      listings={listings}
    />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <SearchProvider>
          <Router>
            <AppContent />
          </Router>
        </SearchProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
