import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Camera, 
  Scale 
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { JournalBookTab } from './components/JournalBookTab';
import { DebtLendTab } from './components/DebtLendTab';
import { ConversationalAITab } from './components/ConversationalAITab';
import { BillScannerTab } from './components/BillScannerTab';
import { LedgerTrialBalanceTab } from './components/LedgerTrialBalanceTab';
import { InvoiceModal } from './components/InvoiceModal';
import { CompanySetupModal } from './components/CompanySetupModal';

import { 
  computeLedgers, 
  computeTrialBalance, 
  computeDebtorsAndCreditors, 
  computeGstSummary, 
  computeFinancialHealth,
  formatINR 
} from './engine/accountingEngine';

import { parseUserInput } from './engine/aiParser';

const STORAGE_KEY_COMPANY = 'ledgerai_user_company';
const STORAGE_KEY_JOURNAL = 'ledgerai_user_journal';

export function App() {
  // Load saved company or start fresh
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load saved journal entries or start empty
  const [journalEntries, setJournalEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // If no company exists yet, open onboarding setup automatically
  useEffect(() => {
    if (!profile) {
      setIsCompanyModalOpen(true);
    }
  }, [profile]);

  // Persist journal entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Failed to save journal entries', e);
    }
  }, [journalEntries]);

  // Initial clean chat greeting
  const [messages, setMessages] = useState(() => [
    {
      id: 'msg-welcome',
      sender: 'ai',
      result: {
        type: 'answer',
        title: 'Welcome to your Clean Accounting Book',
        summary: 'I am your AI Accountant. Tell me what happened in plain language (e.g. "Bought stationery for ₹500" or "Client paid ₹15,000") and I will write it into your official Journal Book.',
        data: []
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Save or Update Company Details
  const handleSaveCompany = (newProfile, startingBalance = 0) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(newProfile));

    // If starting balance is provided, record opening capital journal entry
    if (startingBalance > 0) {
      const today = new Date().toISOString().split('T')[0];
      const dateFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      const openingEntry = {
        id: 'JE-CAPITAL-' + Date.now(),
        date: today,
        formattedDate: dateFormatted,
        lines: [
          { accountName: `Bank A/c (${newProfile.bankName})`, lf: '102', debit: startingBalance, credit: 0, isDr: true },
          { accountName: 'Capital A/c', lf: '301', debit: 0, credit: startingBalance, isDr: false }
        ],
        narration: `(Business started with initial capital of ${formatINR(startingBalance)} deposited into ${newProfile.bankName})`,
        category: 'Capital',
        source: 'Initial Capital',
        aiConfidence: 100,
        requiresCaReview: false
      };

      setJournalEntries([openingEntry]);
    }
  };

  // Reset Everything to clean slate
  const handleResetAllData = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all data and set up a new company?'
    );
    if (!confirmReset) return;

    localStorage.removeItem(STORAGE_KEY_COMPANY);
    localStorage.removeItem(STORAGE_KEY_JOURNAL);
    setProfile(null);
    setJournalEntries([]);
    setIsCompanyModalOpen(true);
    setMessages([
      {
        id: 'msg-welcome-fresh',
        sender: 'ai',
        result: {
          type: 'answer',
          title: 'Books Reset & Ready',
          summary: 'Your accounting book is fresh and empty. Record your first transaction whenever ready!',
          data: []
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Pure Deterministic Calculations from Journal Entries
  const ledgers = useMemo(() => computeLedgers(journalEntries), [journalEntries]);
  const trialBalance = useMemo(() => computeTrialBalance(ledgers), [ledgers]);
  const debtorsAndCreditors = useMemo(() => computeDebtorsAndCreditors(journalEntries, ledgers), [journalEntries, ledgers]);
  const gstSummary = useMemo(() => computeGstSummary(ledgers), [ledgers]);
  const financialHealth = useMemo(() => computeFinancialHealth(ledgers), [ledgers]);

  // Add new entry into the Journal Book
  const handlePostEntry = (newEntry) => {
    setJournalEntries(prev => [...prev, newEntry]);
  };

  // 1-Click: Got paid by client
  const handleRecordPaymentReceived = (debtor) => {
    const today = new Date().toISOString().split('T')[0];
    const bankName = profile?.bankName || 'HDFC Bank';
    const entry = {
      id: 'JE-COLLECT-' + Date.now(),
      date: today,
      formattedDate: today,
      lines: [
        { accountName: `Bank A/c (${bankName})`, lf: '102', debit: debtor.amount, credit: 0, isDr: true },
        { accountName: debtor.name, lf: debtor.id, debit: 0, credit: debtor.amount, isDr: false }
      ],
      narration: `(Payment of ${formatINR(debtor.amount)} received from ${debtor.name} into ${bankName})`,
      category: 'Collection',
      source: 'Direct Settlement',
      aiConfidence: 100,
      requiresCaReview: false
    };

    handlePostEntry(entry);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // 1-Click: Paid Harish / Supplier
  const handleSettleCreditor = (creditor) => {
    const today = new Date().toISOString().split('T')[0];
    const bankName = profile?.bankName || 'HDFC Bank';
    const entry = {
      id: 'JE-PAY-' + Date.now(),
      date: today,
      formattedDate: today,
      lines: [
        { accountName: creditor.name, lf: creditor.id, debit: creditor.amount, credit: 0, isDr: true },
        { accountName: `Bank A/c (${bankName})`, lf: '102', debit: 0, credit: creditor.amount, isDr: false }
      ],
      narration: `(Paid ${formatINR(creditor.amount)} to ${creditor.name} via ${bankName})`,
      category: 'Purchases',
      source: 'Direct Payment',
      aiConfidence: 100,
      requiresCaReview: false
    };

    handlePostEntry(entry);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // AI Query dispatcher
  const handleSendQuery = (text) => {
    return parseUserInput(text, ledgers, debtorsAndCreditors, gstSummary, financialHealth, currentProfile);
  };

  const handleRunPrompt = (promptText) => {
    setActiveTab('chat');
    setTimeout(() => {
      const userMsg = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        text: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const response = handleSendQuery(promptText);
      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        result: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
    }, 150);
  };

  // Fallback profile if modal is open for the first time
  const currentProfile = profile || {
    businessName: 'My Business',
    tradeName: 'My Business',
    city: 'Trivandrum',
    state: 'Kerala',
    gstin: 'Unregistered',
    bankName: 'HDFC Bank'
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <Header 
        profile={currentProfile}
        financialHealth={financialHealth}
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
        onOpenCompanySetup={() => setIsCompanyModalOpen(true)}
        onResetAllData={handleResetAllData}
      />

      {/* Navigation Tabs */}
      <nav className="nav-tab-bar">
        <div className="tabs-container">
          <button 
            id="tab-overview"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} />
            <span>Summary</span>
          </button>

          <button 
            id="tab-journal"
            className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            <BookOpen size={16} />
            <span>Journal Book</span>
            <span className="tab-badge">{journalEntries.length}</span>
          </button>

          <button 
            id="tab-debt-lend"
            className={`tab-btn ${activeTab === 'debt_lend' ? 'active' : ''}`}
            onClick={() => setActiveTab('debt_lend')}
          >
            <Users size={16} />
            <span>Who Owes &amp; Who I Owe</span>
            <span className="tab-badge">
              {debtorsAndCreditors.debtors.length + debtorsAndCreditors.creditors.length}
            </span>
          </button>

          <button 
            id="tab-chat"
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={16} />
            <span>Ask or Add (Chat)</span>
          </button>

          <button 
            id="tab-scanner"
            className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
          >
            <Camera size={16} />
            <span>Scan a Bill</span>
          </button>

          <button 
            id="tab-ledgers"
            className={`tab-btn ${activeTab === 'ledgers' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledgers')}
          >
            <Scale size={16} />
            <span>Full Accounts &amp; CA</span>
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <DashboardTab 
            financialHealth={financialHealth}
            debtorsAndCreditors={debtorsAndCreditors}
            gstSummary={gstSummary}
            journalEntries={journalEntries}
            profile={currentProfile}
            onSelectTab={setActiveTab}
            onRunPrompt={handleRunPrompt}
          />
        )}

        {activeTab === 'journal' && (
          <JournalBookTab 
            journalEntries={journalEntries}
          />
        )}

        {activeTab === 'debt_lend' && (
          <DebtLendTab 
            debtorsAndCreditors={debtorsAndCreditors}
            onRecordPaymentReceived={handleRecordPaymentReceived}
            onSettleCreditor={handleSettleCreditor}
          />
        )}

        {activeTab === 'chat' && (
          <ConversationalAITab 
            onSendQuery={handleSendQuery}
            onPostProposedEntry={handlePostEntry}
            messages={messages}
            setMessages={setMessages}
          />
        )}

        {activeTab === 'scanner' && (
          <BillScannerTab 
            onPostProposedEntry={handlePostEntry}
          />
        )}

        {activeTab === 'ledgers' && (
          <LedgerTrialBalanceTab 
            ledgers={ledgers}
            trialBalance={trialBalance}
          />
        )}
      </main>

      {/* Set Up Company Modal */}
      <CompanySetupModal 
        isOpen={isCompanyModalOpen}
        onClose={() => {
          if (profile) setIsCompanyModalOpen(false);
        }}
        onSaveCompany={handleSaveCompany}
        currentProfile={profile}
      />

      {/* GST Invoice Creator */}
      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onPostInvoiceEntry={handlePostEntry}
        profile={currentProfile}
      />
    </div>
  );
}

export default App;
