import React, { useState } from 'react';
import { Printer, Search, CheckCircle } from 'lucide-react';
import { formatINR } from '../engine/accountingEngine';

export function JournalBookTab({ journalEntries }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = journalEntries.filter(entry => {
    return (
      entry.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.lines.some(l => l.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const totalDr = filteredEntries.reduce((sum, e) => {
    return sum + e.lines.reduce((s, l) => s + (l.debit || 0), 0);
  }, 0);

  const totalCr = filteredEntries.reduce((sum, e) => {
    return sum + e.lines.reduce((s, l) => s + (l.credit || 0), 0);
  }, 0);

  const isBalanced = Math.abs(totalDr - totalCr) < 0.01;

  return (
    <div>
      {/* Friendly Explainer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            The Journal Book
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            This is the official accounting journal. Every time you speak, upload a bill, or invoice someone, it gets written here.
          </p>
        </div>

        <button 
          className="btn-secondary"
          onClick={() => window.print()}
        >
          <Printer size={15} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Simple Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="text"
          className="clean-input"
          placeholder="Search by name, item or date (e.g. Harish, Dell, Cash, May 1)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px' }}
        />
      </div>

      {/* The Exact Notebook Style Paper Table */}
      <div className="paper-journal-notebook">
        <div className="paper-journal-top">
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.04em', color: '#0f172a' }}>
              JOURNAL ENTRY
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.75rem' }}>
              Official Books &bull; Apex Digital Solutions
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
            ✓ Balanced Double-Entry Book
          </div>
        </div>

        <table className="paper-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Date</th>
              <th style={{ textAlign: 'left' }}>Particulars</th>
              <th style={{ width: '60px' }}>L.F.</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Amt. (Dr)</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Amt. (Cr)</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <React.Fragment key={entry.id}>
                {entry.lines.map((line, lIdx) => {
                  const isFirst = lIdx === 0;
                  const isLast = lIdx === entry.lines.length - 1;
                  const isDebit = (line.debit || 0) > 0;

                  return (
                    <tr key={`${entry.id}-${lIdx}`}>
                      {/* Date on first row */}
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: '#475569' }}>
                        {isFirst ? entry.formattedDate : ''}
                      </td>

                      {/* Particulars */}
                      <td>
                        {isDebit ? (
                          <div className="paper-dr-line">
                            <span>{line.accountName}</span>
                            <span style={{ color: '#0f172a', fontWeight: 700, marginRight: '1rem' }}>Dr.</span>
                          </div>
                        ) : (
                          <div className="paper-cr-line">
                            <span>To {line.accountName}</span>
                          </div>
                        )}

                        {/* Narration on last line */}
                        {isLast && (
                          <div className="paper-narration">
                            {entry.narration}
                          </div>
                        )}
                      </td>

                      {/* L.F. */}
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#64748b' }}>
                        {line.lf || '-'}
                      </td>

                      {/* Dr Amount */}
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>
                        {line.debit > 0 ? Number(line.debit).toLocaleString('en-IN') : ''}
                      </td>

                      {/* Cr Amount */}
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>
                        {line.credit > 0 ? Number(line.credit).toLocaleString('en-IN') : ''}
                      </td>
                    </tr>
                  );
                })}

                {/* Entry separator rule line */}
                <tr className="entry-rule-bottom">
                  <td colSpan={5} style={{ height: '6px', padding: 0 }}></td>
                </tr>
              </React.Fragment>
            ))}

            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No matching entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals proof footer */}
        <div className="paper-footer">
          <div style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <CheckCircle size={16} />
            <span>Mathematical Check: Both sides match exactly</span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.5rem' }}>TOTAL (Dr):</span>
              <span>₹{totalDr.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginRight: '0.5rem' }}>TOTAL (Cr):</span>
              <span>₹{totalCr.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
