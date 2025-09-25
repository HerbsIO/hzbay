import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchIcon from '@mui/icons-material/Search';

import { styled, alpha } from '@mui/material/styles';


import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { useCart } from '../cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../SearchContext';



export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.searchbars, 0.35),
  '&:hover': {
    backgroundColor: alpha(theme.palette.searchbars, 0.5),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));



export function AppAppBar({ mode, toggleColorMode, handleViewCart }) {
  const [open, setOpen] = React.useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  const itemsInCart = () => {
    if (cartItems.length > 0)
      return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    else {
      return '0'
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 2 }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'hsla(220, 60%, 99%, 0.6)',
            boxShadow:
              '0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)',
            ...theme.applyStyles('dark', {
              bgcolor: 'hsla(220, 0%, 0%, 0.7)',
              boxShadow:
                '0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)',
            }),
          })}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <div>
              <a href="/" target="_blank" rel="noopener noreferrer" className="navbar-brand">
                <img src="/Hz-bay (1).png" height="50" alt="logo" />
              </a>
            </div>
            <Box>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item" onClick={handleViewCart}  id="cart">
                  <a className="nav-link" style={{ color: '#014d00' }}>
                    <i className="fas fa-shopping-cart me-2"></i>
                    <span>Cart (${itemsInCart()})</span>
                  </a>
                </li>
              </ul>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            {cartItems.length > 0 ?
              <Button color="primary" variant="contained" size="small" onClick={handleViewCart}>
                Checkout
              </Button> : null}
            <form onSubmit={handleSearch}>
              <Search onSubmit={handleSearch}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                />
              </Search>
            </form>
          </Box>
          <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >

                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item navCart" onClick={handleViewCart}>
                    <a className="nav-link" style={{ color: '#014d00' }}>
                      <i className="fas fa-shopping-cart me-2"></i>
                      <span>Cart (${itemsInCart()})</span>
                    </a>
                  </li>
                </ul>
                {cartItems.length > 0 ?
                  <Button color="primary" variant="contained" size="small" onClick={handleViewCart} sx={{mb: 3}}>
                    Checkout
                  </Button> : null}

                <form onSubmit={handleSearch}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(e);
                        }
                      }}
                    />
                  </Search>
                </form>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};


