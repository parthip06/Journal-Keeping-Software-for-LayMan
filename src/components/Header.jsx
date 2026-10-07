import React from 'react';
import { BookOpen, Wallet, Plus, Building2, Settings2, RotateCcw } from 'lucide-react';
import { formatINR } from '../engine/accountingEngine';

export function Header({ 
  profile, 
  financialHealth, 
  onOpenInvoiceModal,
  onOpenCompanySetup,
  onResetAllData
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-icon-box">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="brand-title">LedgerAI</div>
            <div className="brand-subtitle">Simple accounts for small businesses</div>
          </div>
        </div>

        {/* Company Info Box (Clickable to Edit) */}
        <div 
          className="business-tag" 
          style={{ cursor: 'pointer' }}
          onClick={onOpenCompanySetup}
          title="Click to edit your business details"
        >
          <Building2 size={15} color="#0284c7" />
          <div>
            <strong>{profile.businessName}</strong> ({profile.city}, {profile.state})
            {profile.gstin !== 'Unregistered' && (
              <span style={{ marginLeft: '0.4rem', color: '#64748b' }}>&bull; GST: {profile.gstin}</span>
            )}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#0284c7', textDecoration: 'underline', marginLeft: '0.25rem' }}>
            Edit
          </span>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <div className="stat-pill" title="Total Available Liquid Money">
            <Wallet size={15} />
            <span>Bank &amp; Cash: {formatINR(financialHealth.totalLiquidCash)}</span>
          </div>

          <button 
            className="btn-primary"
            onClick={onOpenInvoiceModal}
          >
            <Plus size={15} />
            <span>Create Invoice</span>
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
            onClick={onResetAllData}
            title="Clear all transactions and start fresh"
          >
            <RotateCcw size={13} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}
