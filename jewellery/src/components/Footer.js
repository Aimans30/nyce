import React from 'react';
import { Container, Grid, Typography, Link, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-heading" gutterBottom>
              NYCE by Navya
            </Typography>
            <Typography variant="body2" className="footer-text">
              Elevate your style with our exquisite collection of hair accessories and jewelry pieces that combine elegance with modern design.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-heading" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" className="footer-text">
              Email: navyachhbra479@gmail.com<br />
              <br />
              Location: Delhi, India
            </Typography>
            <div className="social-icons">
              <IconButton 
                href="https://www.instagram.com/nycebynavya?igsh=MW5iMGx2dXkweDlncg==" 
                target="_blank" 
                className="social-icon"
              >
                <InstagramIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="footer-heading" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" className="footer-link">Home</Link>
            <Link href="#reviews-section" className="footer-link">Reviews</Link>
            <Link href="/cart" className="footer-link">Shopping Cart</Link>
          </Grid>
        </Grid>
        <div className="footer-bottom">
          <Typography variant="body2" align="center" className="copyright">
            © {new Date().getFullYear()} NYCE by Navya. All rights reserved.
          </Typography>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 