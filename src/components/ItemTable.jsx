import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

export default function ItemTable() {
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch item types first
        const { data: types, error: typesError } = await supabase
          .from('itemtypes')
          .select('itemtypeid, typename')  
          .order('typename', { ascending: true });

        if (typesError) throw typesError;
        setItemTypes(types);

        // Then fetch items
        await fetchItems();
      } catch (error) {
        toast.error(`Initialization failed: ${error.message}`);
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('itemid', { ascending: true });

      if (error) throw error;
      setItems(data);
    } catch (error) {
      toast.error(`Failed to fetch items: ${error.message}`);
      console.error('Fetch error:', error);
    }
  };

  const handleDelete = async (itemid) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('itemid', itemid);

      if (error) throw error;
      toast.success('Item deleted successfully');
      await fetchItems();
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    // Validation
    if (!editItem.name?.trim()) {
      toast.error('Item name is required');
      return;
    }

    const price = parseFloat(editItem.price);
    if (isNaN(price) || price < 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    // Verify item type exists if provided
    if (editItem.itemtypeid && !itemTypes.some(t => t.itemtypeid === editItem.itemtypeid)) {
      toast.error('Invalid item type selected');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('items')
        .update({
          name: editItem.name.trim(),
          price: price,
          itemtypeid: editItem.itemtypeid || null  // Using correct column name
        })
        .eq('itemid', editItem.itemid);

      if (error) throw error;
      toast.success('Item updated successfully');
      setEditItem(null);
      await fetchItems();
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && items.length === 0) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="item-management">
      <h2>📦 Item Inventory</h2>
      
      {items.length === 0 && !isLoading ? (
        <p>No items found</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.itemid}>
                {editItem?.itemid === item.itemid ? (
                  <>
                    <td>{item.itemid}</td>
                    <td>
                      <input
                        value={editItem.name}
                        onChange={(e) => 
                          setEditItem({ ...editItem, name: e.target.value })
                        }
                        placeholder="Item name"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editItem.price}
                        onChange={(e) => 
                          setEditItem({ ...editItem, price: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </td>
                    <td>
                      <select
                        value={editItem.itemtypeid || ''}
                        onChange={(e) => 
                          setEditItem({ 
                            ...editItem, 
                            itemtypeid: e.target.value ? parseInt(e.target.value) : null 
                          })
                        }
                        disabled={isLoading}
                      >
                        <option value="">-- No Type --</option>
                        {itemTypes.map(type => (
                          <option key={type.itemtypeid} value={type.itemtypeid}>
                            {type.typename}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="actions">
                      <button onClick={handleUpdate} disabled={isLoading}>
                        💾 Save
                      </button>
                      <button 
                        onClick={() => setEditItem(null)} 
                        disabled={isLoading}
                      >
                        ❌ Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.itemid}</td>
                    <td>{item.name}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      {itemTypes.find(t => t.itemtypeid === item.itemtypeid)?.typename || '-'}
                    </td>
                    <td className="actions">
                      <button 
                        onClick={() => setEditItem({ ...item })}
                        disabled={isLoading}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.itemid)}
                        disabled={isLoading}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}