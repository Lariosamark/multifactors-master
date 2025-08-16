'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  [key: string]: any;
}

interface FormData {
  projectName: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function ProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    clientName: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [refNo, setRefNo] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customClient, setCustomClient] = useState('');

  // Fetch customers list
  useEffect(() => {
    const fetchCustomers = async () => {
      const snapshot = await getDocs(collection(db, 'customers'));
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
    };
    fetchCustomers();
  }, []);

  // Generate project reference number
  useEffect(() => {
    const generateRefNo = async () => {
      const now = new Date();
      const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

      const q = query(
        collection(db, 'projects'),
        where('refNo', '>=', `P-${yyyymm}`),
        where('refNo', '<=', `P-${yyyymm}-999`),
        orderBy('refNo', 'desc'),
        limit(1)
      );

      const querySnap = await getDocs(q);
      let nextNumber = 1;
      if (!querySnap.empty) {
        const lastRef = querySnap.docs[0].data().refNo as string;
        const lastNum = parseInt(lastRef.split('-')[2], 10);
        nextNumber = lastNum + 1;
      }

      setRefNo(`P-${yyyymm}-${String(nextNumber).padStart(3, '0')}`);
    };

    generateRefNo();
  }, []);

  // Handle field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle client selection
  const handleClientChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'other') {
      setFormData({ ...formData, clientName: '' });
    } else {
      setFormData({ ...formData, clientName: value });
      setCustomClient('');
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalClientName = formData.clientName || customClient;

    try {
      // If new client entered, save to customers list
      if (formData.clientName === '' && customClient) {
        await addDoc(collection(db, 'customers'), {
          name: customClient,
          createdAt: serverTimestamp()
        });
      }

      // Save project
      const docRef = await addDoc(collection(db, 'projects'), {
        ...formData,
        clientName: finalClientName,
        refNo,
        createdAt: serverTimestamp(),
        status: 'New'
      });

      router.push(`/quotation?projectId=${docRef.id}&refNo=${refNo}`);
    } catch (error) {
      console.error('Error adding project: ', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">New Project</h2>
            <p className="text-gray-600 text-sm">Create a new project and generate quotation</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-md border shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference No.</span>
            <div className="text-lg font-mono font-bold text-blue-600">{refNo}</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Timeline */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Project Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Project Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Enter project name" className="w-full px-4 py-3 border rounded-lg" required />
            </div>

            {/* Client Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <select name="clientName" value={formData.clientName || (customClient ? 'other' : '')} onChange={handleClientChange} className="w-full px-4 py-3 border rounded-lg" required>
                <option value="">Select a client</option>
                {customers.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="other">Other (type manually)</option>
              </select>

              {formData.clientName === '' && (
                <input type="text" placeholder="Enter client name" value={customClient} onChange={(e) => setCustomClient(e.target.value)} className="w-full mt-2 px-4 py-3 border rounded-lg" required />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the project" rows={4} className="w-full px-4 py-3 border rounded-lg" required />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">Save & Go to Quotation</button>
        </div>
      </form>
    </div>
  );
}
