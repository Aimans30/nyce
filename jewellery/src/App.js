import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ReviewDialog from './components/ReviewDialog';
import './App.css';

function App() {
  const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleAddReview = () => {
    setReviewDialogOpen(true);
  };

  return (
    <Router>
      <div className="App">
        <Navbar onAddReview={handleAddReview} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
        <ReviewDialog 
          open={isReviewDialogOpen} 
          onClose={() => setReviewDialogOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
