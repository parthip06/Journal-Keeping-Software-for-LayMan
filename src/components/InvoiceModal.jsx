import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Send, 
  Check, 
  Sparkles,
  Building,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../engine/accountingEngine';

export function InvoiceModal({ isOpen, onClose, onPostInvoiceEntry, profile }) {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('Rahul Enterprises');
  const [clientGstin, setClientGstin] = useState('32AAECR9981K1ZP');
  const [serviceDescription, setServiceDescription] = useState('Full-Stack Web & Mobile App Development Services');
  const [amount, setAmount] = useState(25000);
  const [isInterState, setIsInterState] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  const taxRate = 18;
  const taxableAmount = Number(amount) || 0;
  const cgst = !isInterState ? Math.round(taxableAmount * 0.09) : 0;
  const sgst = !isInterState ? Math.round(taxableAmount * 0.09) : 0;
  const igst = isInterState ? Math.round(taxableAmount * 0.18) : 0;
  const totalTax = cgst + sgst + igst;
  const grandTotal = taxableAmount + totalTax;

  const handleSubmit = (e) => {
    e.preventDefault();

    const todayStr = invoiceDate;
    const invId = 'INV-' + Date.now().toString().slice(-4);

    const lines = [
      { accountName: `${clientName} A/c`, lf: '103', debit: grandTotal, credit: 0, isDr: true, partyRole: 'Sundry Debtor' },
      { accountName: 'Sales / Service Revenue A/c', lf: '401', debit: 0, credit: taxableAmount, isDr: false }
    ];

    if (!isInterState) {
      lines.push({ accountName: 'Output CGST A/c', lf: '203', debit: 0, credit: cgst, isDr: false });
      lines.push({ accountName: 'Output SGST A/c', lf: '204', debit: 0, credit: sgst, isDr: false });
    } else {
      lines.push({ accountName: 'Output IGST A/c', lf: '205', debit: 0, credit: igst, isDr: false });
    }

    const entry = {
      id: 'JE-' + invId,
      date: todayStr,
      formattedDate: todayStr,
      lines,
      narration: `(Being tax invoice #${invId} raised on ${clientName} for ${serviceDescription})`,
      category: 'Sales',
      source: `Tax Invoice #${invId}`,
      aiConfidence: 99,
      requiresCaReview: false,
      supportingDoc: `${invId}.pdf`
    };

    onPostInvoiceEntry(entry);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Create Indian GST Tax Invoice</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
              Client / Debtor Name
            </label>
            <input 
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                Client GSTIN
              </label>
              <input 
                type="text"
                value={clientGstin}
                onChange={(e) => setClientGstin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                Invoice Date
              </label>
              <input 
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
              Service Description (HSN/SAC: 998314)
            </label>
            <input 
              type="text"
              required
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                Taxable Amount (₹)
              </label>
              <input 
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600
                }}
              />
            </div>

            <div style={{ paddingTop: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input 
                  type="checkbox"
                  checked={isInterState}
                  onChange={(e) => setIsInterState(e.target.checked)}
                />
                <span>Inter-State Supply (IGST 18%)</span>
              </label>
            </div>
          </div>

          {/* Tax Calculation Preview */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Base Taxable Amount:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(taxableAmount)}</span>
            </div>
            {!isInterState ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>CGST @ 9%:</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(cgst)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>SGST @ 9%:</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(sgst)}</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>IGST @ 18%:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(igst)}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#60a5fa',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '0.5rem'
            }}>
              <span>Grand Total (Receivable):</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatINR(grandTotal)}</span>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="button"
              className="btn-small btn-outline-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-small btn-primary-sm"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            >
              <Check size={16} />
              <span>Generate & Post to Journal Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
