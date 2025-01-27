import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

const ReviewDialog = ({ open, onClose }) => {
  const [review, setReview] = useState({
    userName: '',
    rating: 5,
    comment: '',
    productId: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products when dialog opens
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!review.userName || !review.productId || !review.comment) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (response.ok) {
        // Reset form
        setReview({
          userName: '',
          rating: 5,
          comment: '',
          productId: ''
        });
        // Refresh the page to show new review
        window.location.reload();
        onClose();
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setReview({
      userName: '',
      rating: 5,
      comment: '',
      productId: ''
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Your Name"
            value={review.userName}
            onChange={(e) => setReview({ ...review, userName: e.target.value })}
            fullWidth
            required
          />
          
          <FormControl fullWidth required>
            <InputLabel>Select Product</InputLabel>
            {loading ? (
              <CircularProgress size={20} sx={{ mt: 2 }} />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Select
                value={review.productId}
                label="Select Product"
                onChange={(e) => setReview({ ...review, productId: e.target.value })}
              >
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>

          <Box>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={review.rating}
              onChange={(_, newValue) => setReview({ ...review, rating: newValue })}
              precision={0.5}
              size="large"
              sx={{ color: 'var(--primary-color)' }}
            />
          </Box>

          <TextField
            label="Your Review"
            multiline
            rows={4}
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            fullWidth
            required
            placeholder="Share your experience with this product..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{ 
            bgcolor: 'var(--primary-color)',
            '&:hover': {
              bgcolor: 'var(--hover-color)'
            }
          }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog; 