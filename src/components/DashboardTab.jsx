import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  BookOpen, 
  Plus,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { formatINR } from '../engine/accountingEngine';

export function DashboardTab({ 
  financialHealth, 
  debtorsAndCreditors, 
  gstSummary, 
  journalEntries, 
  profile,
  onSelectTab, 
  onRunPrompt 
}) {
  const { totalRevenue, totalExpenses, netProfit, totalLiquidCash } = financialHealth;
  const { totalReceivables, totalPayables, debtors } = debtorsAndCreditors;

  const isBrandNew = journalEntries.length === 0;

  return (
    <div>
      {/* Friendly Status Banner */}
      {isBrandNew ? (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Sparkles size={24} color="#0284c7" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0369a1' }}>
              Welcome to {profile.businessName}! Your official books are clean and ready.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#0c4a6e', marginTop: '0.15rem' }}>
              Just tell the AI what you bought or sold, or use the buttons below to record your first transaction.
            </div>
          </div>
        </div>
      ) : (
        <div className="layman-alert">
          <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <strong>Summary:</strong> You have <strong>{debtors.length} customer(s)</strong> who owe you <strong>{formatINR(totalReceivables)}</strong>, and <strong>{formatINR(totalPayables)}</strong> due in supplier bills.
          </div>
        </div>
      )}

      {/* 4 Simple Numbers */}
      <div className="overview-grid">
        {/* Box 1: Money in Bank */}
        <div className="simple-box green">
          <div className="simple-box-label">Money Available (Bank + Cash)</div>
          <div className="simple-box-value" style={{ color: '#15803d' }}>
            {formatINR(totalLiquidCash)}
          </div>
          <div className="simple-box-sub">
            {totalLiquidCash > 0 ? 'Ready to spend' : 'No funds recorded yet'}
          </div>
        </div>

        {/* Box 2: People Who Owe You */}
        <div 
          className="simple-box blue"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectTab('debt_lend')}
        >
          <div className="simple-box-label">People Who Owe You Money &rarr;</div>
          <div className="simple-box-value" style={{ color: '#0284c7' }}>
            {formatINR(totalReceivables)}
          </div>
          <div className="simple-box-sub">
            {debtors.length > 0 
              ? `${debtors.length} customer(s) pending` 
              : 'Nobody owes you right now'}
          </div>
        </div>

        {/* Box 3: People You Have to Pay */}
        <div 
          className="simple-box red"
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectTab('debt_lend')}
        >
          <div className="simple-box-label">People You Have to Pay &rarr;</div>
          <div className="simple-box-value" style={{ color: '#dc2626' }}>
            {formatINR(totalPayables)}
          </div>
          <div className="simple-box-sub">
            {totalPayables > 0 ? 'Bills due for payment' : 'No outstanding bills'}
          </div>
        </div>

        {/* Box 4: Your Business Profit */}
        <div className="simple-box amber">
          <div className="simple-box-label">This Period's Profit</div>
          <div className="simple-box-value" style={{ color: '#d97706' }}>
            {formatINR(netProfit)}
          </div>
          <div className="simple-box-sub">
            Sales ({formatINR(totalRevenue)}) - Expenses ({formatINR(totalExpenses)})
          </div>
        </div>
      </div>

      {/* Quick Everyday Actions */}
      <div className="clean-card">
        <h3 className="card-title">What would you like to record?</h3>
        <p className="card-desc">Click any prompt to tell the AI, or open the chat tab to write in your own words:</p>

        <div className="chat-suggestions">
          <button 
            className="suggestion-pill"
            onClick={() => onRunPrompt("Started business with ₹1,00,000 cash in bank")}
          >
            💵 Put ₹1,00,000 capital in bank
          </button>

          <button 
            className="suggestion-pill"
            onClick={() => onRunPrompt("Create invoice for Rahul Enterprises for ₹25,000 for services with 18% GST")}
          >
            💼 Bill a client ₹25,000
          </button>

          <button 
            className="suggestion-pill"
            onClick={() => onRunPrompt("Purchased goods from Harish for ₹20,000 on credit")}
          >
            🛒 Bought goods for ₹20,000 on credit
          </button>

          <button 
            className="suggestion-pill"
            onClick={() => onRunPrompt("Bought stationery for cash ₹2,200")}
          >
            ✏️ Bought stationery for ₹2,200 cash
          </button>

          <button 
            className="suggestion-pill"
            onClick={() => onRunPrompt("Paid office rent ₹12,000 via bank")}
          >
            🏢 Paid rent ₹12,000
          </button>

          <button 
            className="suggestion-pill"
            onClick={() => onRunPrompt("Who owes me money?")}
          >
            ❓ Who owes me money right now?
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="clean-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <h3 className="card-title">Recent Transactions Recorded</h3>
            <p className="card-desc" style={{ marginBottom: 0 }}>Every transaction gets automatically written into your official Journal Book.</p>
          </div>
          {journalEntries.length > 0 && (
            <button 
              className="btn-secondary"
              onClick={() => onSelectTab('journal')}
            >
              <BookOpen size={14} />
              <span>Open Journal Book &rarr;</span>
            </button>
          )}
        </div>

        {journalEntries.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--border-color)' }}>
            {journalEntries.slice(-5).reverse().map((entry) => (
              <div 
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '0.9rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{entry.narration}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {entry.formattedDate} &bull; Category: {entry.category}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {formatINR(entry.lines[0]?.debit || entry.lines[0]?.credit)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)' }}>
            No transactions yet. Tap one of the buttons above or type in the chat to add your first entry!
          </div>
        )}
      </div>
    </div>
  );
}
