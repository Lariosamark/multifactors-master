// PrintableQuotation.tsx
'use client';

import Image from 'next/image';

type QuotationItem = {
  qty?: number;
  description?: string;
  unitPrice: number | string;
  total: number | string;
};

type Quotation = {
  refNo: string;
  date: string;
  name: string;
  position?: string;
  address?: string;
  through?: string;
  subject?: string;
  description?: string;
  items?: QuotationItem[];
  totalPrice: number | string;
  vat: number | string;
  grandTotal: number | string;
};

type Props = {
  quotation: Quotation;
};

export default function PrintableQuotation({ quotation }: Props) {
  const q = quotation;

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return `₱ ${num.toFixed(2)}`;
  };

  return (
    <div
      className="text-sm text-black w-[210mm] min-h-[297mm] px-10 py-8 bg-white"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <style jsx global>{`
        @media print {
          .customer-ref-container {
            display: flex !important;
            justify-content: space-between !important;
          }
          .ref-info {
            text-align: right !important;
            float: none !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Centered Logo */}
      <div className="mx-auto mb-6 text-center">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={800}
          height={450}
          style={{
            height: 'auto',
            maxHeight: '450px',
            display: 'block',
          }}
          priority
        />
      </div>

      <div className="ref-section mb-4">
        <p>
          <strong>Reference No:</strong> {q.refNo}
        </p>
        <p>
          <strong>Date:</strong> {q.date}
        </p>
      </div>

      {/* Customer Details */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p>
            <strong>Customer Name:</strong> {q.name}
          </p>
          {q.position && (
            <p>
              <strong>Position:</strong> {q.position}
            </p>
          )}
          {q.address && (
            <p>
              <strong>Address:</strong> {q.address}
            </p>
          )}
          {q.through && (
            <p>
              <strong>Through:</strong> {q.through}
            </p>
          )}
        </div>
      </div>

      {/* Subject and Description */}
      <div className="mb-4">
        {q.subject && (
          <p>
            <strong>Subject:</strong> {q.subject}
          </p>
        )}
        {q.description && (
          <p className="mt-2 whitespace-pre-line">
            <strong>Description:</strong>
            <br />
            {q.description}
          </p>
        )}
      </div>

      {/* Items Table */}
      {q.items && q.items.length > 0 && q.items.some((item) => item.description) && (
        <table className="w-full text-sm border border-gray-300 mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border text-right">Unit Price</th>
              <th className="p-2 border text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {q.items.map(
              (item, i) =>
                item.description && (
                  <tr key={i}>
                    <td className="p-2 border text-center">{item.qty ?? '-'}</td>
                    <td className="p-2 border">{item.description}</td>
                    <td className="p-2 border text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2 border text-right">{formatCurrency(item.total)}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}

      {/* Totals */}
      <div className="text-right space-y-1 mt-8">
        <p>
          <strong>Total:</strong> {formatCurrency(q.totalPrice)}
        </p>
        <p>
          <strong>VAT (12%):</strong> {formatCurrency(q.vat)}
        </p>
        <p className="text-lg font-bold">
          Grand Total: {formatCurrency(q.grandTotal)}
        </p>
      </div>

      {/* Signature */}
      <div className="signature mt-16 flex justify-between">
        <div className="signature-line w-1/3 text-center">
          <div className="border-t border-black mt-12 pt-1">Prepared by</div>
        </div>
        <div className="signature-line w-1/3 text-center">
          <div className="border-t border-black mt-12 pt-1">Approved by</div>
        </div>
      </div>
    </div>
  );
}
