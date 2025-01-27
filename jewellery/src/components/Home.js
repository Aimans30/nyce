import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Slider
} from '@mui/material';
import './Home.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useInView } from 'react-intersection-observer';
import logo from '../images/Logo.png';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 250],
    sortBy: 'default'
  });
  const [openFilters, setOpenFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await fetch(`${API_URL}/products`);
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log('Products data:', data);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const addToCart = (product) => {
    try {
      const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      localStorage.setItem('cartItems', JSON.stringify([...existingItems, product]));
      setSnackbar({
        open: true,
        message: 'Product added to cart!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add product to cart',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFilteredProducts = () => {
    console.log('All products:', products);
    const filtered = products.filter(product => {
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      console.log(`Product: ${product.name}, Category: ${product.category}, Price: ${product.price}`);
      console.log(`Matches Category: ${matchesCategory}, Matches Price: ${matchesPrice}`);
      return matchesCategory && matchesPrice;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'priceLowToHigh':
          return a.price - b.price;
        case 'priceHighToLow':
          return b.price - a.price;
        default:
          return 0;
      }
    });
    console.log('Filtered products:', filtered);
    return filtered;
  };

  const handleOpenFilters = () => setOpenFilters(true);
  const handleCloseFilters = () => setOpenFilters(false);

  const ProductCard = ({ product, index }) => {
    const { ref, inView } = useInView({
      threshold: 0.2,
      triggerOnce: true,
      delay: index * 100
    });

    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
      // Set a fallback image if the original fails to load
      return true;
    };

    return (
      <Grid item key={product._id} xs={12} sm={6} md={4}>
        <div ref={ref} className={`reveal-item ${inView ? 'revealed' : ''}`}>
          <Card className="product-card">
            <div className="product-image-container">
              <CardMedia
                component="img"
                height="300"
                image={product.image}
                alt={product.name}
                className={`product-image ${imageError ? 'error' : ''}`}
                onError={handleImageError}
              />
            </div>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h3">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description}
              </Typography>
              <Typography variant="h6" className="product-price">
                ₹{product.price.toFixed(2)}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </Grid>
    );
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-logo-container">
          <img src={logo} alt="NYCE by Navya" className="hero-logo" />
        </div>
        <Typography variant="h5" className="hero-subtitle">
          Turning outfits into statements, one accessory at a time
        </Typography>
      </div>

      <Container maxWidth="lg" className="featured-section">
        <Typography variant="h4" component="h2" gutterBottom align="center" className="section-title">
          Our Collection
        </Typography>
        
        {/* Desktop Filters */}
        <Box className="filters-section desktop-filters">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="Bow">Bows</MenuItem>
                  <MenuItem value="Scrunchie">Scrunchies</MenuItem>
                  <MenuItem value="Bracelet">Bracelets</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => setFilters({ ...filters, priceRange: newValue })}
                valueLabelDisplay="auto"
                min={0}
                max={250}
              />
              <div className="price-range-label">
                <Typography variant="caption">₹{filters.priceRange[0]}</Typography>
                <Typography variant="caption">₹{filters.priceRange[1]}</Typography>
              </div>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4} className="featured-grid">
            {getFilteredProducts().map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </Grid>
        )}

        {/* Mobile Filter Button */}
        <Button
          className="mobile-filter-btn"
          startIcon={<FilterListIcon />}
          onClick={handleOpenFilters}
          variant="contained"
        >
          Filters
        </Button>

        {/* Mobile Filter Dialog */}
        <Dialog
          open={openFilters}
          onClose={handleCloseFilters}
          fullWidth
          className="filter-dialog"
        >
          <DialogTitle>
            Filters
            <IconButton
              onClick={handleCloseFilters}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box className="filters-section mobile-filters">
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      label="Category"
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      <MenuItem value="Bow">Bows</MenuItem>
                      <MenuItem value="Scrunchie">Scrunchies</MenuItem>
                      <MenuItem value="Bracelet">Bracelets</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      label="Sort By"
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    >
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                      <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography gutterBottom>Price Range</Typography>
                  <Slider
                    value={filters.priceRange}
                    onChange={(e, newValue) => setFilters({ ...filters, priceRange: newValue })}
                    valueLabelDisplay="auto"
                    min={0}
                    max={250}
                    sx={{ color: 'var(--primary-color)' }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">₹{filters.priceRange[0]}</Typography>
                    <Typography variant="caption">₹{filters.priceRange[1]}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFilters} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleCloseFilters} 
              variant="contained"
              sx={{ bgcolor: 'var(--primary-color)' }}
            >
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        <Container maxWidth="lg" className="reviews-section" id="reviews-section">
          <Typography variant="h4" component="h2" gutterBottom align="center" className="section-title">
            Customer Reviews
          </Typography>
          {reviews.length > 0 ? (
            <Grid container spacing={4}>
              {reviews.map((review) => (
                <Grid item key={review._id} xs={12} sm={6} md={4}>
                  <Card className="review-card">
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {review.userName}
                      </Typography>
                      <Rating value={review.rating} readOnly precision={0.5} />
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                        Verified Purchase: {review.productId?.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary">
              No reviews yet. Be the first to review our products!
            </Typography>
          )}
        </Container>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default Home; 