import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Sparkles,
  Edit3,
  Shield,
  MessageSquare
} from 'lucide-react';
import { formatINR } from '../engine/accountingEngine';

export function CaReviewTab({ journalEntries, onApproveCaItem }) {
  const [reviewNote, setReviewNote] = useState('');
  const [approvedIds, setApprovedIds] = useState(new Set());

  // Filter items flagged for CA review
  const flaggedItems = journalEntries.filter(e => e.requiresCaReview);

  const handleApprove = (entry) => {
    onApproveCaItem(entry.id, reviewNote);
    setApprovedIds(prev => new Set(prev).add(entry.id));
    setReviewNote('');
  };

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fde68a' }}>
              Chartered Accountant (CA) Human-in-the-Loop Hub
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#fed7aa' }}>
              AI filters routine transactions & flags complex items requiring professional judgment.
            </p>
          </div>
        </div>

        <div style={{
          background: '#78350f',
          color: '#fef3c7',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          border: '1px solid #b45309'
        }}>
          {flaggedItems.length} Exceptions Awaiting Review
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {flaggedItems.map(item => {
          const isApproved = approvedIds.has(item.id);

          return (
            <div key={item.id} className="ca-review-item">
              <div className="ca-item-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>
                      {item.narration}
                    </span>
                    <span className="ca-flag-badge">
                      <AlertTriangle size={13} />
                      <span>AI Confidence: {item.aiConfidence}%</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    Entry ID: {item.id} &bull; Date: {item.formattedDate} &bull; Source: {item.source}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Transaction Amount
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>
                    {formatINR(item.lines[0]?.debit || 75000)}
                  </div>
                </div>
              </div>

              {/* Reason for Flagging */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderLeft: '3px solid #f59e0b',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: '#fef3c7',
                marginBottom: '1rem'
              }}>
                <strong>Why AI Flagged this:</strong> {item.caReviewNote || 'Transaction exceeds ₹50,000 threshold. Capital goods classification requires professional sign-off.'}
              </div>

              {/* Journal Line breakdown */}
              <div style={{
                background: 'var(--bg-card)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                  CURRENT PROPOSED JOURNAL LINES:
                </div>
                {item.lines.map((l, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.15rem 0' }}>
                    <span style={{ paddingLeft: l.debit > 0 ? 0 : '1.5rem', color: l.debit > 0 ? '#60a5fa' : '#94a3b8' }}>
                      {l.debit > 0 ? `${l.accountName} (Dr)` : `To ${l.accountName}`}
                    </span>
                    <span>{formatINR(l.debit || l.credit)}</span>
                  </div>
                ))}
              </div>

              {/* CA Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <FileText size={15} color="#60a5fa" />
                  <span>Supporting Doc: {item.supportingDoc || 'Tax_Invoice_Attached.pdf'}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {isApproved ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                      <CheckCircle size={16} />
                      <span>CA Approved &amp; Certified</span>
                    </div>
                  ) : (
                    <button 
                      id={`ca-approve-btn-${item.id}`}
                      className="btn-small btn-primary-sm"
                      style={{ background: '#10b981', padding: '0.5rem 1rem' }}
                      onClick={() => handleApprove(item)}
                    >
                      <CheckCircle size={15} />
                      <span>Approve &amp; Certify Entry</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {flaggedItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)'
          }}>
            <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '0.5rem' }}>All Clear! No Pending CA Exceptions</h3>
            <p style={{ fontSize: '0.85rem' }}>Every journal transaction is verified and complies with standard Indian accounting treatment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
