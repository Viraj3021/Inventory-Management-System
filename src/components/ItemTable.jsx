import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

export default function ItemTable() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from('items').select('*');
    if (error) toast.error('Failed to fetch items');
    else setItems(data);
  };

  const handleDelete = async (itemId) => {
    const { error } = await supabase.from('items').delete().eq('itemid', itemId);
    if (error) toast.error('❌ Failed to delete');
    else {
      toast.success('🗑️ Deleted successfully');
      fetchItems();
    }
  };

  const handleEdit = (item) => setEditItem(item);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('items')
      .update({
        name: editItem.name,
        price: editItem.price,
      })
      .eq('itemid', editItem.itemid);

    if (error) toast.error('❌ Update failed');
    else toast.success('✅ Updated successfully');

    setEditItem(null);
    fetchItems();
  };

  return (
    <div>
      <h3>📦 Item List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Item Type ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) =>
            editItem && editItem.itemid === item.itemid ? (
              <tr key={item.itemid}>
                <td>
                  <input
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={editItem.price}
                    onChange={(e) =>
                      setEditItem({ ...editItem, price: e.target.value })
                    }
                  />
                </td>
                <td>{item.itemtypeid}</td>
                <td>
                  <button onClick={handleUpdate}>💾 Save</button>
                  <button onClick={() => setEditItem(null)}>❌ Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={item.itemid}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.itemtypeid}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(item.itemid)}>🗑️ Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
