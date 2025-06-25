import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PurchaseForm() {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([{ itemid: '', quantity: '' }]);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase.from('items').select('itemid, name');
      setItems(data);
    }
    fetchItems();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...purchaseItems];
    updated[index][field] = value;
    setPurchaseItems(updated);
  };

  const addItemField = () => {
    setPurchaseItems([...purchaseItems, { itemid: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchase')
      .insert({ customername: customerName })
      .select()
      .single();

    if (purchaseError) {
      alert(purchaseError.message);
      return;
    }

    const purchaseId = purchaseData.purchaseid;

    for (const item of purchaseItems) {
      const itemId = item.itemid;
      const quantity = parseInt(item.quantity);

      // Check inventory
      const { data: inventory } = await supabase
        .from('inventory')
        .select('stockavailable')
        .eq('itemid', itemId)
        .single();

      if (!inventory || inventory.stockavailable < quantity) {
        alert('Insufficient stock for item ID ' + itemId);
        return;
      }

      // Update inventory
      await supabase
        .from('inventory')
        .update({ stockavailable: inventory.stockavailable - quantity })
        .eq('itemid', itemId);

      // Insert into purchaseitems
      await supabase.from('purchaseitems').insert({
        purchaseid: purchaseId,
        itemid: itemId,
        quantity: quantity,
      });
    }

    alert('Purchase completed!');
    setCustomerName('');
    setPurchaseItems([{ itemid: '', quantity: '' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Purchase</h3>
      <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />
      {purchaseItems.map((item, index) => (
        <div key={index}>
          <select
            value={item.itemid}
            onChange={(e) => handleItemChange(index, 'itemid', e.target.value)}
            required
          >
            <option value="">Select Item</option>
            {items.map((it) => (
              <option key={it.itemid} value={it.itemid}>
                {it.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addItemField}>
        ➕ Add Another Item
      </button>
      <button type="submit">✅ Place Order</button>
    </form>
  );
}
