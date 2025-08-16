'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

// Define item and form types
interface Item {
  qty: string;
  description: string;
  unitPrice: string;
  total: string;
}

interface FormData {
  name: string;
  position: string;
  address: string;
  through: string;
  subject: string;
  description: string;
  items: Item[];
  totalPrice: string;
  vat: string;
  grandTotal: string;
  date: string;
}

export default function QuotationPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const refNoFromParams = searchParams.get('refNo');
  const router = useRouter();

  const [refNo, setRefNo] = useState(refNoFromParams || '');
  const [isRefNoEditable, setIsRefNoEditable] = useState(false);
  const [useItems, setUseItems] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    address: '',
    through: '',
    subject: '',
    description: '',
    items: [{ qty: '', description: '', unitPrice: '', total: '' }],
    totalPrice: '',
    vat: '',
    grandTotal: '',
    date: '',
  });

  // Auto-generate refNo if not provided in params
  useEffect(() => {
    const now = new Date();
    const today = now.toLocaleDateString('en-CA');

    if (refNoFromParams) {
      setRefNo(refNoFromParams);
      setFormData((prev) => ({ ...prev, date: today }));
      return;
    }

    const generateRefNo = async () => {
      const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const qRef = query(
        collection(db, 'quotations'),
        where('refNo', '>=', `${yyyymm}-000`),
        where('refNo', '<', `${yyyymm}-999`),
      );
      const snapshot = await getDocs(qRef);
      const count = snapshot.size + 1;
      const newRefNo = `Q-${yyyymm}-${String(count).padStart(3, '0')}`;
      setRefNo(newRefNo);
      setFormData((prev) => ({ ...prev, date: today }));
    };

    generateRefNo();
  }, [refNoFromParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRefNo(e.target.value);
  };

  const toggleRefNoEdit = () => {
    setIsRefNoEditable(!isRefNoEditable);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    if (field === 'qty' || field === 'unitPrice') {
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const price = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].total = (qty * price).toFixed(2);
    }
    const totalPrice = updatedItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const vat = totalPrice * 0.12;
    const grandTotal = totalPrice + vat;
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalPrice: totalPrice.toFixed(2),
      vat: vat.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { qty: '', description: '', unitPrice: '', total: '' }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const updated = formData.items.filter((_, i) => i !== index);
    const totalPrice = updated.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const vat = totalPrice * 0.12;
    const grandTotal = totalPrice + vat;
    setFormData((prev) => ({
      ...prev,
      items: updated,
      totalPrice: totalPrice.toFixed(2),
      vat: vat.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    }));
  };

  const handleTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const num = parseFloat(value) || 0;
    if (name === 'totalPrice') {
      const vat = num * 0.12;
      setFormData((prev) => ({
        ...prev,
        totalPrice: value,
        vat: vat.toFixed(2),
        grandTotal: (num + vat).toFixed(2),
      }));
    }
  };

  const toggleItemsSection = () => {
    setUseItems(!useItems);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(db, 'quotations'), {
      ...formData,
      projectId,
      refNo,
      items: useItems ? formData.items : [],
      createdAt: Timestamp.now(),
    });
    router.push(`/purchase-order?projectId=${projectId}&refNo=${refNo}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Basic Info */}
          <h2 className="text-xl font-bold mb-4">Quotation Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference No.</label>
                <input
                  type="text"
                  value={refNo}
                  onChange={handleRefNoChange}
                  disabled={!isRefNoEditable}
                  className={`w-full border p-2 rounded ${
                    isRefNoEditable 
                      ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'bg-gray-100 border-gray-300'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={toggleRefNoEdit}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  isRefNoEditable
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isRefNoEditable ? 'Lock' : 'Edit'}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                value={formData.date}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="through"
              placeholder="Through"
              value={formData.through}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />
            <textarea 
              name="description" 
              placeholder="Describe the project requirements and objectives" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none col-span-2"
              style={{ textAlign: 'justify' }}
              required 
            />
          </div>

          {/* Toggle Items */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={useItems} onChange={toggleItemsSection} />
              Include Items Section
            </label>
          </div>

          {/* Items Table */}
          {useItems && (
            <div className="mb-8">
              {formData.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={item.total}
                    readOnly
                    className="border p-2 rounded bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Item
              </button>
            </div>
          )}

          {/* Totals */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              name="totalPrice"
              placeholder="Total Price"
              value={formData.totalPrice}
              onChange={handleTotalChange}
              readOnly={useItems}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="vat"
              placeholder="VAT"
              value={formData.vat}
              readOnly
              className="border p-2 rounded bg-gray-100"
            />
            <input
              type="text"
              name="grandTotal"
              placeholder="Grand Total"
              value={formData.grandTotal}
              readOnly
              className="border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/component/quotation-list')}
              className="px-6 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Save & Go to Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}