import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatINR } from '../engine/accountingEngine';

export function LedgerTrialBalanceTab({ ledgers, trialBalance }) {
  const [selectedAccountName, setSelectedAccountName] = useState('Harish\'s A/c');

  const selectedLedger = ledgers[selectedAccountName] || Object.values(ledgers)[0];

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
          General Ledgers & Trial Balance Verification
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Every single ledger account is derived from the Journal entries. The Trial Balance proves total debits equal total credits.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* ========================================================
            LEFT COLUMN: INDIVIDUAL LEDGER ACCOUNT (T-ACCOUNT)
            ======================================================== */}
        <div className="glass-panel">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <BookOpen size={18} color="#60a5fa" />
                <span>Individual Account Ledger (T-Account)</span>
              </h3>
              <p className="section-desc">Select any ledger to inspect its debits & credits</p>
            </div>

            <select 
              value={selectedAccountName}
              onChange={(e) => setSelectedAccountName(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            >
              {Object.keys(ledgers).map(accName => (
                <option key={accName} value={accName}>
                  {accName} ({ledgers[accName].balanceType} {formatINR(ledgers[accName].balance)})
                </option>
              ))}
            </select>
          </div>

          {/* T-Account Layout */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '2px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>{selectedLedger.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '0.5rem' }}>
                  Folio #{selectedLedger.code} &bull; {selectedLedger.type}
                </span>
              </div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: selectedLedger.balanceType === 'Dr' ? '#60a5fa' : '#fbbf24'
              }}>
                Net Balance: {selectedLedger.balanceType} {formatINR(selectedLedger.balance)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '260px' }}>
              {/* Debit Side (Left) */}
              <div style={{ borderRight: '1px solid var(--border-color)', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Dr. (Debits)
                </div>
                {selectedLedger.debitEntries.map((dr, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', marginRight: '0.4rem' }}>{dr.date.slice(5)}</span>
                      <span>To {dr.particulars}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatINR(dr.amount)}</span>
                  </div>
                ))}
                {selectedLedger.debitEntries.length === 0 && (
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem' }}>
                    No debit postings
                  </div>
                )}
              </div>

              {/* Credit Side (Right) */}
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Cr. (Credits)
                </div>
                {selectedLedger.creditEntries.map((cr, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', marginRight: '0.4rem' }}>{cr.date.slice(5)}</span>
                      <span>By {cr.particulars}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatINR(cr.amount)}</span>
                  </div>
                ))}
                {selectedLedger.creditEntries.length === 0 && (
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem' }}>
                    No credit postings
                  </div>
                )}
              </div>
            </div>

            <div style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <span>Total Debits: {formatINR(selectedLedger.totalDebit)}</span>
              <span>Total Credits: {formatINR(selectedLedger.totalCredit)}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: TRIAL BALANCE (Mathematical Proof)
            ======================================================== */}
        <div className="glass-panel">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Scale size={18} color="#10b981" />
                <span>Trial Balance as on Date</span>
              </h3>
              <p className="section-desc">Proof that all debits match all credits</p>
            </div>
            <div style={{
              background: trialBalance.isBalanced ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: trialBalance.isBalanced ? '#6ee7b7' : '#fca5a5',
              border: `1px solid ${trialBalance.isBalanced ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {trialBalance.isBalanced ? '✓ 100% Balanced' : '⚠️ Unbalanced'}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.6rem 0.85rem', textAlign: 'left', color: 'var(--text-muted)' }}>Particulars / Ledger</th>
                  <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right', color: 'var(--text-muted)' }}>Debit (₹)</th>
                  <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right', color: 'var(--text-muted)' }}>Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {trialBalance.rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '0.5rem 0.85rem', color: '#f1f5f9' }}>
                      {r.accountName}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '0.4rem' }}>({r.type})</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.85rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {r.debit > 0 ? r.debit.toLocaleString('en-IN') : '-'}
                    </td>
                    <td style={{ padding: '0.5rem 0.85rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {r.credit > 0 ? r.credit.toLocaleString('en-IN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderTop: '2px solid #334155', fontWeight: 700 }}>
                  <td style={{ padding: '0.75rem 0.85rem', color: '#38bdf8' }}>TOTAL PROOF</td>
                  <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    ₹{trialBalance.totalDebit.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    ₹{trialBalance.totalCredit.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
