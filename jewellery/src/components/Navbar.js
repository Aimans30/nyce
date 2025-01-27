import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RateReviewIcon from '@mui/icons-material/RateReview';
import './Navbar.css';

const Navbar = ({ onAddReview }) => {
  const scrollToReviews = (e) => {
    e.preventDefault();
    const reviewsSection = document.getElementById('reviews-section');
    reviewsSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" className="logo-link" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>
            NYCE
          </Link>
        </Typography>
        
        <div className="nav-links">
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ color: 'var(--text-color)' }}
          >
            Collection
          </Button>
          <Button 
            color="inherit" 
            onClick={scrollToReviews}
            sx={{ color: 'var(--text-color)' }}
          >
            Reviews
          </Button>
          <Button
            color="inherit"
            onClick={onAddReview}
            startIcon={<RateReviewIcon />}
            sx={{ color: 'var(--text-color)' }}
          >
            Add Review
          </Button>
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/cart"
            sx={{ color: 'var(--primary-color)' }}
            className="cart-icon"
          >
            <Badge badgeContent={0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 