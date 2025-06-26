import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

export default function AddItemForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    itemTypeId: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      itemTypeId: parseInt(form.itemTypeId),
    };

    const { error } = await supabase.from('items').insert([dataToSend]);

    if (error) {
      toast.error('❌ Failed to add item');
    } else {
      toast.success('✅ Item added successfully!');
      setForm({ name: '', price: '', itemTypeId: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
  <h3>➕ Add New Item</h3>

  <label>Item Name</label>
  <input
    name="name"
    placeholder="Enter item name"
    value={form.name}
    onChange={handleChange}
    required
  />

  <label>Price (₹)</label>
  <input
    name="price"
    type="number"
    placeholder="Enter price"
    value={form.price}
    onChange={handleChange}
    min="0"
    step="0.01"
    required
  />

  <label>Item Type ID</label>
  <input
    name="itemTypeId"
    type="number"
    placeholder="Enter item type ID"
    value={form.itemTypeId}
    onChange={handleChange}
    min="1"
    required
  />

  <button type="submit">✅ Add Item</button>
</form>
  );
}