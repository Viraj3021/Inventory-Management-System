import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import AddItemForm from './components/AddItemForm';
import AddInventoryForm from './components/AddInventoryForm';
import PurchaseForm from './components/PurchaseForm';
import ItemTable from './components/ItemTable';
import PurchaseHistoryTable from './components/PurchaseHistoryTable';
import './App.css';
import './index.css'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add-item" element={<AddItemForm />} />
        <Route path="/add-inventory" element={<AddInventoryForm />} />
        <Route path="/purchase" element={<PurchaseForm />} />
        <Route path="/items" element={<ItemTable />} />
        <Route path="/history" element={<PurchaseHistoryTable />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000}  theme='colored' />
    </BrowserRouter>
  </React.StrictMode>
);
