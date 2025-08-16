'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

export default function AdminSupplierCustomerPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [supplierName, setSupplierName] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Fetch data from Firestore
  const fetchData = async () => {
    const supplierSnap = await getDocs(collection(db, 'suppliers'));
    const customerSnap = await getDocs(collection(db, 'customers'));

    setSuppliers(supplierSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setCustomers(customerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Add new supplier
  const addSupplier = async (e) => {
    e.preventDefault();
    if (!supplierName.trim()) return;

    await addDoc(collection(db, 'suppliers'), {
      name: supplierName.trim(),
      createdAt: serverTimestamp()
    });
    setSupplierName('');
    fetchData();
  };

  // Add new customer
  const addCustomer = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    await addDoc(collection(db, 'customers'), {
      name: customerName.trim(),
      createdAt: serverTimestamp()
    });
    setCustomerName('');
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin: Manage Suppliers & Customers</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Supplier Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Suppliers</h2>

          <form onSubmit={addSupplier} className="flex mb-4 gap-2">
            <input
              type="text"
              placeholder="Supplier Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="border p-2 flex-1 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </form>

          <ul className="divide-y">
            {suppliers.map((s) => (
              <li key={s.id} className="py-2">{s.name}</li>
            ))}
          </ul>
        </div>

        {/* Customer Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>

          <form onSubmit={addCustomer} className="flex mb-4 gap-2">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border p-2 flex-1 rounded"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </form>

          <ul className="divide-y">
            {customers.map((c) => (
              <li key={c.id} className="py-2">{c.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
