import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PurchaseHistoryTable() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase.rpc('get_purchase_history'); // We'll define this in Step 3

      if (error) {
        console.error('Error fetching history:', error.message);
        return;
      }
      setHistory(data);
    }

    fetchHistory();
  }, []);

  return (
    <div>
      <h3>🧾 Purchase History</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Item</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row, idx) => (
            <tr key={idx}>
              <td>{row.customername}</td>
              <td>{new Date(row.date).toLocaleString()}</td>
              <td>{row.itemname}</td>
              <td>{row.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}