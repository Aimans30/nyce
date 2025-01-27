import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Group same items and add quantity
    const groupedItems = items.reduce((acc, item) => {
      const existingItem = acc.find(i => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
    setCartItems(groupedItems);
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item._id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      localStorage.setItem('cartItems', JSON.stringify(updatedItems.flatMap(item => 
        Array(item.quantity).fill({ ...item, quantity: undefined })
      )));

      return updatedItems;
    });
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems.flatMap(item => 
        Array(item.quantity).fill({ ...item, quantity: undefined })
      )));
      return updatedItems;
    });
  };

  const handleCheckoutClick = () => {
    setOpenCheckoutDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCheckoutDialog(false);
  };

  const handleGoToInstagram = () => {
    window.open("https://www.instagram.com/nycebynavya?igsh=MW5iMGx2dXkweDlncg==", "_blank");
    setOpenCheckoutDialog(false);
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, minHeight: '60vh' }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Your cart is empty. Start shopping to add items to your cart!
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="cart-container">
      <Typography variant="h4" component="h1" className="cart-title">
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item._id} className="cart-item">
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <CardContent className="cart-item-content">
                <Typography variant="h6" component="h2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" className="cart-item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
                <Box className="quantity-controls">
                  <IconButton onClick={() => updateQuantity(item._id, -1)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton onClick={() => updateQuantity(item._id, 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => removeItem(item._id)}
                    className="remove-button"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="cart-summary">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box className="summary-row">
                <Typography>Subtotal</Typography>
                <Typography>₹{total.toFixed(2)}</Typography>
              </Box>
              <Box className="summary-row">
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Box className="summary-row total">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">₹{total.toFixed(2)}</Typography>
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                className="checkout-button"
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={openCheckoutDialog}
        onClose={handleCloseDialog}
        aria-labelledby="checkout-dialog-title"
        aria-describedby="checkout-dialog-description"
      >
        <DialogTitle id="checkout-dialog-title">
          {"Order Through Instagram"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="checkout-dialog-description">
            Please place your order through our Instagram page. Click below to visit our Instagram profile.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Close
          </Button>
          <Button 
            onClick={handleGoToInstagram} 
            variant="contained"
            sx={{ bgcolor: 'var(--primary-color)' }}
          >
            Go to Instagram
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart; 