import React, { useState } from 'react';
import { Check, Copy, ArrowDownLeft, ArrowUpRight, Phone } from 'lucide-react';
import { formatINR } from '../engine/accountingEngine';

export function DebtLendTab({ 
  debtorsAndCreditors, 
  onRecordPaymentReceived, 
  onSettleCreditor 
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const { 
    debtors, 
    creditors, 
    totalReceivables, 
    totalPayables, 
    totalLenderDebt, 
    totalCapital 
  } = debtorsAndCreditors;

  const handleCopyReminder = (debtor) => {
    const text = `Hi ${debtor.name}, quick reminder from Apex Studio regarding the pending balance of ${formatINR(debtor.amount)}. Please let us know once paid. Thanks!`;
    navigator.clipboard.writeText(text);
    setCopiedId(debtor.id);
    setToastMessage(`Copied WhatsApp message for ${debtor.name}`);
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 2500);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
          Who Owes You &amp; Who You Owe
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          The AI figures this out automatically from your Journal entries. No manual math needed.
        </p>
      </div>

      {toastMessage && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#16a34a',
          padding: '0.65rem 1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {toastMessage}
        </div>
      )}

      <div className="two-column-board">
        {/* ========================================================
            COLUMN 1: PEOPLE WHO OWE YOU MONEY
            ======================================================== */}
        <div className="board-column" style={{ borderTop: '4px solid #0284c7' }}>
          <div className="board-header">
            <div>
              <div className="board-title" style={{ color: '#0284c7' }}>
                <ArrowDownLeft size={20} />
                <span>People Who Owe You</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Clients with unpaid invoices
              </div>
            </div>
            <div className="board-total" style={{ color: '#0284c7' }}>
              {formatINR(totalReceivables)}
            </div>
          </div>

          <div>
            {debtors.map((debtor) => (
              <div key={debtor.id} className="simple-party-card">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    {debtor.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '0.15rem' }}>
                    Due for 18 days &bull; Phone: {debtor.phone}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.15rem', color: '#0284c7', marginBottom: '0.35rem' }}>
                    {formatINR(debtor.amount)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => handleCopyReminder(debtor)}
                    >
                      {copiedId === debtor.id ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      <span>{copiedId === debtor.id ? 'Copied' : 'Reminder'}</span>
                    </button>

                    <button 
                      className="btn-action-green"
                      onClick={() => onRecordPaymentReceived(debtor)}
                    >
                      Got Paid
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {debtors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                🎉 Great news! Nobody owes you money right now.
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            COLUMN 2: PEOPLE YOU HAVE TO PAY
            ======================================================== */}
        <div className="board-column" style={{ borderTop: '4px solid #dc2626' }}>
          <div className="board-header">
            <div>
              <div className="board-title" style={{ color: '#dc2626' }}>
                <ArrowUpRight size={20} />
                <span>People You Have to Pay</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Suppliers, bills, and borrowed money
              </div>
            </div>
            <div className="board-total" style={{ color: '#dc2626' }}>
              {formatINR(totalPayables + totalLenderDebt)}
            </div>
          </div>

          <div>
            {creditors.map((creditor) => (
              <div key={creditor.id} className="simple-party-card">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    {creditor.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                    {creditor.partyType === 'Vendor / Supplier' 
                      ? 'Supplier (Goods on credit)' 
                      : creditor.partyType === 'Institutional Lender' 
                        ? 'Bank loan taken for business' 
                        : 'Money you (the owner) put in'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.15rem', color: '#dc2626', marginBottom: '0.35rem' }}>
                    {formatINR(creditor.amount)}
                  </div>

                  {creditor.partyType === 'Vendor / Supplier' && (
                    <button 
                      className="btn-action-amber"
                      onClick={() => onSettleCreditor(creditor)}
                    >
                      Pay Bill
                    </button>
                  )}
                  {creditor.partyType !== 'Vendor / Supplier' && (
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Long-term
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
