import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../engine/accountingEngine';

export const SAMPLE_BILLS_DATA = [
  {
    id: 'bill-1',
    vendor: 'Dell Technologies India',
    invoiceNo: 'DEL-INV-99214',
    date: '2026-05-15',
    itemDescription: 'Office Laptop (Dell XPS 15)',
    category: 'Office Equipment',
    baseAmount: 75000,
    gstRate: 18,
    cgst: 6750,
    sgst: 6750,
    igst: 0,
    total: 88500,
    taxNote: 'Eligible for 18% Input Tax Credit',
    confidence: 96
  },
  {
    id: 'bill-2',
    vendor: 'Harish Wholesalers',
    invoiceNo: 'HW-892',
    date: '2026-05-01',
    itemDescription: 'Commercial Stock (Purchased on credit)',
    category: 'Purchases (Supplier Credit)',
    baseAmount: 20000,
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    total: 20000,
    taxNote: 'Bill on 30-day credit from Harish',
    confidence: 98
  },
  {
    id: 'bill-3',
    vendor: 'Amazon Web Services (AWS)',
    invoiceNo: 'AWS-2026-88',
    date: '2026-05-20',
    itemDescription: 'Server & Cloud Hosting',
    category: 'Software & Cloud Services',
    baseAmount: 2881,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 519,
    total: 3400,
    taxNote: 'Inter-state IGST eligible for tax credit',
    confidence: 99
  }
];

export function BillScannerTab({ onPostProposedEntry }) {
  const [selectedBill, setSelectedBill] = useState(SAMPLE_BILLS_DATA[0]);
  const [isPosted, setIsPosted] = useState(false);

  const handleSelectSample = (bill) => {
    setSelectedBill(bill);
    setIsPosted(false);
  };

  const handlePostJournal = () => {
    if (!selectedBill) return;

    let lines = [];
    if (selectedBill.id === 'bill-1') {
      lines = [
        { accountName: 'Office Equipment A/c', lf: '104', debit: selectedBill.baseAmount, credit: 0, isDr: true },
        { accountName: 'Input CGST A/c', lf: '105', debit: selectedBill.cgst, credit: 0, isDr: true },
        { accountName: 'Input SGST A/c', lf: '106', debit: selectedBill.sgst, credit: 0, isDr: true },
        { accountName: 'Bank A/c (HDFC)', lf: '102', debit: 0, credit: selectedBill.total, isDr: false }
      ];
    } else if (selectedBill.id === 'bill-2') {
      lines = [
        { accountName: 'Purchases A/c', lf: '501', debit: selectedBill.total, credit: 0, isDr: true },
        { accountName: "Harish's A/c", lf: '201', debit: 0, credit: selectedBill.total, isDr: false, partyRole: 'Sundry Creditor' }
      ];
    } else {
      lines = [
        { accountName: 'Software & Cloud Services A/c', lf: '503', debit: selectedBill.baseAmount, credit: 0, isDr: true },
        { accountName: 'Input IGST A/c', lf: '107', debit: selectedBill.igst, credit: 0, isDr: true },
        { accountName: 'Bank A/c (HDFC)', lf: '102', debit: 0, credit: selectedBill.total, isDr: false }
      ];
    }

    const entry = {
      id: 'JE-OCR-' + Date.now(),
      date: selectedBill.date,
      formattedDate: selectedBill.date,
      lines,
      narration: `(Bill Scanned: ${selectedBill.itemDescription} from ${selectedBill.vendor})`,
      category: selectedBill.category.includes('Equipment') ? 'Fixed Asset' : selectedBill.category.includes('Purchases') ? 'Purchases' : 'Office Expense',
      source: `Scanned Bill #${selectedBill.invoiceNo}`,
      aiConfidence: selectedBill.confidence,
      requiresCaReview: selectedBill.total > 50000,
      supportingDoc: `${selectedBill.invoiceNo}.pdf`
    };

    onPostProposedEntry(entry);
    setIsPosted(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
          Upload a Bill or Receipt
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Just snap a photo of any receipt or bill. The system reads the vendor, amount, and taxes, and creates the journal entry for you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: Upload Box & Sample Selection */}
        <div>
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: '#ffffff',
            cursor: 'pointer'
          }}>
            <UploadCloud size={36} color="#0284c7" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
              Tap to upload a photo of your bill
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
              Supports photos, PDFs, or phone camera snapshots
            </p>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
              Or click a sample bill to test:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SAMPLE_BILLS_DATA.map(bill => (
                <div 
                  key={bill.id}
                  onClick={() => handleSelectSample(bill)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: selectedBill.id === bill.id ? '#f0f9ff' : '#ffffff',
                    border: `1px solid ${selectedBill.id === bill.id ? '#0284c7' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{bill.vendor}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{bill.itemDescription}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: '#0284c7' }}>
                    {formatINR(bill.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Clean Extracted Summary */}
        <div className="clean-card" style={{ marginBottom: 0 }}>
          <h3 className="card-title">Information Read from Bill</h3>
          <p className="card-desc">Here is what the system extracted from the bill:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>Vendor / Seller:</span>
              <span style={{ fontWeight: 600 }}>{selectedBill.vendor}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>Bill / Invoice No:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedBill.invoiceNo}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>Bill Date:</span>
              <span>{selectedBill.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>Base Amount:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(selectedBill.baseAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>GST Tax:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(selectedBill.total - selectedBill.baseAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', paddingTop: '0.25rem' }}>
              <span>Total Bill:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{formatINR(selectedBill.total)}</span>
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '0.75rem',
            marginTop: '1rem',
            fontSize: '0.82rem',
            color: '#334155'
          }}>
            💡 {selectedBill.taxNote}
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            {isPosted ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', color: '#16a34a', fontWeight: 600 }}>
                <CheckCircle size={16} />
                <span>Written in Journal Book!</span>
              </div>
            ) : (
              <button 
                className="btn-primary"
                onClick={handlePostJournal}
              >
                <Check size={14} />
                <span>Add this to my Accounts</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
