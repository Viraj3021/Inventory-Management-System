import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">🛍️ Inventory Management System</h1>

      <div className="nav-grid">
        <Link to="/add-item" className="nav-block blue">➕ Add Item</Link>
        <Link to="/add-inventory" className="nav-block green">📦 Add Inventory</Link>
        <Link to="/items" className="nav-block purple">📃 View Items</Link>
        <Link to="/purchase" className="nav-block orange">🛒 Make Purchase</Link>
        <Link to="/history" className="nav-block dark">📚 Purchase History</Link>
      </div>
    </div>
  );
}
