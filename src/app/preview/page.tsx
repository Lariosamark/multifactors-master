'use client';

import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

interface Project {
  refNo: string;
  startDate: string;
  endDate: string;
  projectName: string;
  clientName: string;
  description: string;
}

interface QuotationItem {
  qty: number;
  description: string;
  unitPrice: number;
  total: number;
}

interface Quotation {
  refNo: string;
  name: string;
  position: string;
  date: string;
  address: string;
  description: string;
  items: QuotationItem[];
  totalPrice: number;
  vat: number;
  grandTotal: number;
  preparedBy: string;
  approvedBy: string;
}

interface PurchaseOrder {
  refNo: string;
  poNumber: string;
  supplier: string;
  total: number;
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [project, setProject] = useState<Project | null>(null);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      // Project
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) setProject(projectDoc.data() as Project);

      // Quotation
      const qSnap = await getDocs(
        query(collection(db, 'quotations'), where('projectId', '==', projectId))
      );
      if (!qSnap.empty) setQuotation(qSnap.docs[0].data() as Quotation);

      // Purchase Order
      const poSnap = await getDocs(
        query(collection(db, 'purchaseOrders'), where('projectId', '==', projectId))
      );
      if (!poSnap.empty) setPurchaseOrder(poSnap.docs[0].data() as PurchaseOrder);
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleDashboardClick = () => {
    if (userRole === 'admin') window.location.href = '/admin/dashboard';
    else if (userRole === 'Employee') window.location.href = '/employee/dashboard';
    else window.location.href = '/admin/dashboard';
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const LogoHeader = ({ refNo }: { refNo: string }) => (
    <div className="mb-6">
      <div className="flex justify-center">
        <img src="/logo.png" alt="Company Logo" />
      </div>
      <div className="flex justify-end mt-2">
        <div className="text-right">
          <p className="font-bold">Reference Number:</p>
          <p>{refNo}</p>
        </div>
      </div>
    </div>
  );

  if (!project || !quotation || !purchaseOrder) {
    return <p className="text-center mt-10">Loading Preview...</p>;
  }


  return (
  <div className="bg-gray-200 min-h-screen flex flex-col items-center p-4">
  <div className="flex gap-3 mb-4 print:hidden">
  <button
    onClick={() => window.history.back()}
    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back
  </button>
  
  <button
    onClick={handleDashboardClick}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
    {userRole === 'admin' ? '/admin/dashboard' : userRole === 'Employee' ? '/employee/dashboard' : 'Dashboard'}
  </button>
  
  <button
    onClick={() => window.print()}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
    Print All
  </button>
</div>

      {/* Project Form Preview */}
      <form>
        <LogoHeader refNo={project.refNo} />
        
        <div className="border-b-2 border-gray-900 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">PROJECT FORM</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 border-none pb-2 mb-6 uppercase tracking-wide">
            Project Information
          </h2>
          
          <div className="space-y-6">
            {/* Project Timeline */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Start Date:
                </dt>
                <dd className="text-base text-gray-900 font-medium border-none pb-2 min-h-[1.5rem]">
                  {project.startDate}
                </dd>
              </div>
              
              <div className="space-y-2">
                <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  End Date:
                </dt>
                <dd className="text-base text-gray-900 font-medium border-none pb-2 min-h-[1.5rem]">
                  {project.endDate}
                </dd>
              </div>
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Project Name:
              </dt>
              <dd className="text-base text-gray-900 font-medium border-none pb-2 min-h-[1.5rem]">
                {project.projectName}
              </dd>
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Client Name:
              </dt>
              <dd className="text-base text-gray-900 font-medium border-none pb-2 min-h-[1.5rem]">
                {project.clientName}
              </dd>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Project Description:
              </dt>
              <dd className="text-base text-gray-900 leading-relaxed p-1 bg-gray-50 border-none min-h-[2rem]">
                {project.description}
              </dd>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-12 pt-8 border-none">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-5">
              <div className="border-b-2 border-gray-900 h-30"></div>
              <p className="text-sm text-gray-700 text-center font-medium">Project Manager Signature</p>
            </div>
            
            <div className="space-y-4">
              <div className="border-b-2 border-gray-900 h-30"></div>
              <p className="text-sm text-gray-700 text-center font-medium">Client Signature</p>
            </div>
          </div>
        </div>
      </form>
      

      {/* Quotation Preview */}
      <form>
        <LogoHeader refNo={quotation.refNo} />
        
        <div className="border-b-2 border-gray-900 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">QUOTATION</h1>
        </div>

        {/* Customer Details */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 border-none pb-2 mb-6 uppercase tracking-wide">
            Customer Information
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Customer Name:</dt>
                <dd className="text-base text-gray-900 font-medium border-none pb-1 min-h-[1.5rem]">{quotation.name}</dd>
              </div>
              
              <div className="space-y-1">
                <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Position:</dt>
                <dd className="text-base text-gray-900 font-medium border-none pb-1 min-h-[1.5rem]">{quotation.position}</dd>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date:</dt>
                <dd className="text-base text-gray-900 font-medium border-none pb-1 min-h-[1.5rem]">{quotation.date}</dd>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-1">
            <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Address:</dt>
            <dd className="text-base text-gray-900 font-medium border-none pb-1 min-h-[1.5rem]">{quotation.address}</dd>
          </div>

          <div className="mt-4 space-y-1">
            <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description:</dt>
            <dd className="text-base text-gray-900 font-medium border-none-gray-400 pb-1 min-h-[1.5rem]">{quotation.description}</dd>
          </div>
        </div>

        {/* Items Table */}
       <div className="mb-6">
  <h2 className="text-sm font-bold text-gray-900 border-none pb-1 mb-3 uppercase tracking-wide">
    Items & Services
  </h2>
  
  <table className="w-full border border-gray-700 text-xs">
    <thead>
      <tr className="bg-gray-100 border-b border-gray-700">
        <th className="p-1.5 border-r border-gray-400 font-bold text-gray-900 uppercase tracking-wide text-center">Qty</th>
        <th className="p-1.5 border-r border-gray-400 font-bold text-gray-900 uppercase tracking-wide text-left">Description</th>
        <th className="p-1.5 border-r border-gray-400 font-bold text-gray-900 uppercase tracking-wide text-right">Unit Price</th>
        <th className="p-1.5 font-bold text-gray-900 uppercase tracking-wide text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      {quotation.items && quotation.items.length > 0 ? (
        quotation.items.map((item, index) => (
          <tr key={index} className="border-b border-gray-400">
            <td className="p-1.5 border-r border-gray-400 text-center">{item.qty}</td>
            <td className="p-1.5 border-r border-gray-400">{item.description}</td>
            <td className="p-1.5 border-r border-gray-400 text-right">{item.unitPrice}</td>
            <td className="p-1.5 text-right font-medium">{item.total}</td>
          </tr>
        ))
      ) : (
       <tr>
  <td colSpan={4} className="text-center p-3 text-gray-500 italic">
    No items added
  </td>
</tr>
      )}
    </tbody>
  </table>
</div>


        {/* Totals */}
        <div className="mb-4">
  <div className="flex justify-end">
    <div className="w-50"> {/* Reduced width */}
      <div className="border-1 border-gray-900 bg-gray-50 p-1"> {/* Smaller padding */}
        <div className="space-y-2">
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="text-xs font-semibold text-gray-700 uppercase">Total:</span>
            <span className="text-sm font-medium">{quotation.totalPrice}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="text-xs font-semibold text-gray-700 uppercase">VAT:</span>
            <span className="text-sm font-medium">{quotation.vat}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-900 pt-2">
            <span className="text-sm font-bold text-gray-900 uppercase">Grand Total:</span>
            <span className="text-sm font-bold">{quotation.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Signatures */}
        <div className="mt-12 pt-8 border-none-300">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="border-b-2 border-gray-900 h-20"></div>
              <div className="text-center">
                <p className="text-sm text-gray-700 font-medium">Prepared by</p>
                <p className="text-base font-semibold text-gray-900">{quotation.preparedBy}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b-2 border-gray-900 h-20"></div>
              <div className="text-center">
                <p className="text-sm text-gray-700 font-medium">Approved by</p>
                <p className="text-base font-semibold text-gray-900">{quotation.approvedBy}</p>
              </div>
            </div>
          </div>
        </div>
     </form>

      {/* Purchase Order Preview */}
     <form>
        <LogoHeader refNo={purchaseOrder.refNo} />
        
        <div className="border-b-2 border-gray-900 pb-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">PURCHASE ORDER</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 border-none pb-2 mb-6 uppercase tracking-wide">
            Order Details
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                PO Number:
              </dt>
              <dd className="text-base text-gray-900 font-medium border-none pb-2 min-h-[1.5rem]">
                {purchaseOrder.poNumber}
              </dd>
            </div>

            <div className="space-y-2">
              <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Supplier:
              </dt>
              <dd className="text-base text-gray-900 font-medium border-none pb-2 min-h-[1.5rem]">
                {purchaseOrder.supplier}
              </dd>
            </div>

            <div className="space-y-2">
              <dt className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Total:
              </dt>
              <dd className="text-xl text-gray-900 font-bold border-none pb-2 min-h-[1.5rem]">
                {purchaseOrder.total}
              </dd>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-12 pt-8 border-none">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="border-b-2 border-gray-900 h-35"></div>
              <p className="text-sm text-gray-700 text-center font-medium">Authorized Signature</p>
            </div>
            
            <div className="space-y-4">
              <div className="border-b-2 border-gray-900 h-35"></div>
              <p className="text-sm text-gray-700 text-center font-medium">Supplier Signature</p>
            </div>
          </div>
        </div>
     </form>
    </div>
  );
}