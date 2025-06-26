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
    <form onSubmit={handleSubmit}>
      <h3>Add Item</h3>
      <input name="name" placeholder="Item Name" value={form.name} onChange={handleChange} /><br />
      <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} /><br />
      <input name="itemTypeId" placeholder="Item Type ID" type="number" value={form.itemTypeId} onChange={handleChange} /><br />
      <button type="submit">Add</button>
    </form>
  );
}