'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';

export default function PurchaseOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = searchParams.get('projectId');
  const refNo = searchParams.get('refNo');

  const [poData, setPoData] = useState({
    refNo: refNo || '',
    poNumber: '',
    supplier: '',
    total: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPoNumber, setIsLoadingPoNumber] = useState(true);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  // Fetch suppliers from Firestore
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'suppliers'));
        const supplierList = querySnapshot.docs.map((doc) => doc.data().name);
        setSuppliers(supplierList);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  // Generate default PO number
  useEffect(() => {
    const generatePoNumber = async () => {
      try {
        const today = new Date();
        const datePrefix = `${today.getFullYear()}${(today.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

        const q = query(
          collection(db, 'purchaseOrders'),
          where('poNumber', '>=', `${datePrefix}-001`),
          where('poNumber', '<', `${datePrefix}-999`),
          orderBy('poNumber', 'desc')
        );

        const querySnapshot = await getDocs(q);
        let nextNumber = 1;

        if (!querySnapshot.empty) {
          const latestPo = querySnapshot.docs[0].data();
          const lastNumber = parseInt(latestPo.poNumber.split('-')[1]) || 0;
          nextNumber = lastNumber + 1;
        }

        const newPoNumber = `${datePrefix}-${nextNumber
          .toString()
          .padStart(3, '0')}`;

        setPoData((prev) => ({
          ...prev,
          poNumber: newPoNumber
        }));
      } catch (error) {
        console.error('Error generating PO number:', error);
        const timestamp = Date.now().toString().slice(-6);
        setPoData((prev) => ({
          ...prev,
          poNumber: `PO-${timestamp}`
        }));
      } finally {
        setIsLoadingPoNumber(false);
      }
    };

    generatePoNumber();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setPoData({ ...poData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'purchaseOrders'), {
        ...poData,
        projectId,
        createdAt: serverTimestamp()
      });
      alert('Purchase Order saved successfully!');
      router.push(`/preview?projectId=${projectId}&refNo=${refNo}`);
    } catch (error) {
      console.error('Error saving Purchase Order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Document Information
          </h3>
          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
            {refNo}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Purchase Order Details
          </h2>

          <div className="grid gap-6">
            {/* PO Number */}
            <div>
              <label
                htmlFor="poNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Purchase Order Number
              </label>
              <input
                type="text"
                id="poNumber"
                name="poNumber"
                placeholder={
                  isLoadingPoNumber
                    ? 'Generating PO Number...'
                    : 'Enter PO Number'
                }
                value={poData.poNumber}
                onChange={handleChange}
                disabled={isLoadingPoNumber}
                required
                className="block w-full border border-gray-300 rounded-lg p-3"
              />
            </div>

            {/* Supplier Name (Dropdown) */}
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Supplier Name
              </label>
              <select
                id="supplier"
                name="supplier"
                value={poData.supplier}
                onChange={handleChange}
                required
                className="block w-full border border-gray-300 rounded-lg p-3"
              >
                <option value="">Select a supplier</option>
                {suppliers.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Amount */}
            <div>
              <label
                htmlFor="total"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Amount
              </label>
              <input
                type="number"
                id="total"
                name="total"
                placeholder="0.00"
                value={poData.total}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="block w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              {isSubmitting ? 'Processing...' : 'Save Purchase Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
