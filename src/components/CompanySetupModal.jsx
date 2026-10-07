import React, { useState } from 'react';
import { Building2, Check, Sparkles, MapPin, Landmark, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

const INDIAN_STATES = [
  'Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 
  'Andhra Pradesh', 'Telangana', 'Gujarat', 'Uttar Pradesh', 
  'West Bengal', 'Rajasthan', 'Punjab', 'Goa', 'Other'
];

export function CompanySetupModal({ isOpen, onClose, onSaveCompany, currentProfile }) {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState(currentProfile?.businessName || '');
  const [city, setCity] = useState(currentProfile?.city || 'Trivandrum');
  const [state, setState] = useState(currentProfile?.state || 'Kerala');
  const [hasGst, setHasGst] = useState(Boolean(currentProfile?.gstin && currentProfile.gstin !== 'Unregistered'));
  const [gstin, setGstin] = useState(currentProfile?.gstin === 'Unregistered' ? '' : (currentProfile?.gstin || ''));
  const [bankName, setBankName] = useState(currentProfile?.bankName || 'HDFC Bank');
  const [startingBalance, setStartingBalance] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const newProfile = {
      businessName: businessName.trim(),
      tradeName: businessName.trim(),
      gstin: hasGst && gstin.trim() ? gstin.trim().toUpperCase() : 'Unregistered',
      pan: hasGst && gstin.length >= 12 ? gstin.substring(2, 12).toUpperCase() : 'PAN_NOT_SET',
      state,
      city: city.trim() || 'Trivandrum',
      bankName: bankName.trim() || 'Primary Bank',
      bankAccountMasked: '•••• 1234',
      financialYear: '2026-2027',
      currency: 'INR (₹)'
    };

    onSaveCompany(newProfile, Number(startingBalance) || 0);

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
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: '#0284c7',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {currentProfile ? 'Edit Your Business Details' : 'Set Up Your Business'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Start with clean, official books tailored to your business
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              Business or Company Name *
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Horizon Digital, City Medicals, Rahul Agency..."
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="clean-input"
              style={{ width: '100%' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                City / Town
              </label>
              <input 
                type="text"
                placeholder="e.g. Trivandrum, Kochi..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="clean-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                State (For GST Rules)
              </label>
              <select 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="clean-input"
                style={{ width: '100%', background: '#fff' }}
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GST Toggle */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '0.85rem 1rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
              <input 
                type="checkbox"
                checked={hasGst}
                onChange={(e) => setHasGst(e.target.checked)}
              />
              <span>Is your business registered for Indian GST?</span>
            </label>

            {hasGst && (
              <div style={{ marginTop: '0.65rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  15-digit GSTIN (e.g. 32AABCU9603R1ZM)
                </label>
                <input 
                  type="text"
                  placeholder="32AABCU9603R1ZM"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="clean-input"
                  style={{ width: '100%', textTransform: 'uppercase' }}
                />
              </div>
            )}
          </div>

          {/* Bank & Starting Balance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Primary Bank Name
              </label>
              <input 
                type="text"
                placeholder="e.g. HDFC Bank, SBI..."
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="clean-input"
                style={{ width: '100%' }}
              />
            </div>

            {!currentProfile && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Initial Starting Cash / Bank (₹)
                </label>
                <input 
                  type="number"
                  min="0"
                  placeholder="e.g. 50000 (or 0)"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                  className="clean-input"
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            )}
          </div>

          {!currentProfile && Number(startingBalance) > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#16a34a', background: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
              ✓ Will record your opening journal entry: <strong>Bank A/c Dr. ₹{Number(startingBalance).toLocaleString('en-IN')}</strong> to <strong>Capital A/c</strong>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            {currentProfile && (
              <button 
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              className="btn-primary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Check size={16} />
              <span>{currentProfile ? 'Save Changes' : 'Start My Accounts'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
