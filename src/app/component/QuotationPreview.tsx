'use client';

import { useRef } from 'react';
import PrintableQuotation from '@/app/component/PrintableQuotation';

type QuotationItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Quotation = {
  refNo: string;
  date: string;
  customerName: string;
  items: QuotationItem[];
  totalAmount: number;
  [key: string]: string | number | QuotationItem[]; // for optional extra fields
};

type Props = {
  quotation: Quotation;
  onBack?: () => void;
};

export default function QuotationPreview({ quotation, onBack }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quotation ${quotation.refNo}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
              }
              @page { 
                size: A4; 
                margin: 10mm; 
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
              }
              .signature { 
                margin-top: 60px; 
                display: flex; 
                justify-content: space-between; 
              }
              .signature-line { 
                border-top: 1px solid #000; 
                width: 200px; 
                text-align: center; 
              }
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
              }
              .logo-section {
                width: 100px;
              }
              .logo-img {
                width: 200px;
                height: auto;
              }
              .ref-section {
                text-align: right;
              }
              @media print {
                .header-container {
                  display: flex !important;
                  justify-content: space-between !important;
                }
                .ref-section {
                  text-align: right !important;
                }
              }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 200);
    } else {
      window.print();
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🖨 Print
        </button>
      </div>
      <div ref={printRef}>
      </div>
    </div>
  );
}
