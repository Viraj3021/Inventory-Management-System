import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

export default function AddInventoryForm() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemid: '', stockavailable: '' });

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase.from('items').select('itemid, name');
      if (error) toast.error('Failed to fetch items');
      else setItems(data);
    }
    fetchItems();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: existing } = await supabase
      .from('inventory')
      .select('*')
      .eq('itemid', form.itemid)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('inventory')
        .update({
          stockavailable: parseInt(existing.stockavailable) + parseInt(form.stockavailable),
        })
        .eq('itemid', form.itemid);

      if (error) toast.error('❌ Failed to update inventory');
      else toast.success('✅ Inventory updated!');
    } else {
      const { error } = await supabase.from('inventory').insert({
        itemid: form.itemid,
        stockavailable: form.stockavailable,
      });

      if (error) toast.error('❌ Failed to add inventory');
      else toast.success('✅ Inventory added!');
    }

    setForm({ itemid: '', stockavailable: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add to Inventory</h3>
      <select name="itemid" value={form.itemid} onChange={handleChange} required>
        <option value="">Select Item</option>
        {items.map((item) => (
          <option key={item.itemid} value={item.itemid}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        name="stockavailable"
        type="number"
        placeholder="Quantity"
        value={form.stockavailable}
        onChange={handleChange}
        required
      />

      <button type="submit">Add Stock</button>
    </form>
  );
}