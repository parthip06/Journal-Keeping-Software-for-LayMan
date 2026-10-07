/**
 * Initial Seed Data for the Journal
 * Includes the exact transactions from the standard Indian Journal template provided by the user,
 * plus representative modern transactions (Sales on credit, Fixed assets with GST, Bank loans).
 */

export const INITIAL_BUSINESS_PROFILE = {
  businessName: 'Apex Digital Solutions LLP',
  tradeName: 'Apex Studio',
  gstin: '32AABCU9603R1ZM',
  pan: 'AABCU9603R',
  state: 'Kerala (32)',
  city: 'Trivandrum',
  address: 'Technopark Phase 3, Kazhakkoottam, Trivandrum, Kerala 695583',
  bankName: 'HDFC Bank Ltd',
  bankAccountMasked: '•••• •••• 9012',
  ifsc: 'HDFC0001234',
  financialYear: '2026-2027',
  currency: 'INR (₹)'
};

export const INITIAL_JOURNAL_ENTRIES = [
  // 1. Exact entry from User's template: Business started with cash
  {
    id: 'JE-1001',
    date: '2026-05-01',
    formattedDate: '2026 May 1',
    lines: [
      { accountName: 'Cash A/c', lf: '101', debit: 100000, credit: 0, isDr: true },
      { accountName: 'Capital A/c', lf: '301', debit: 0, credit: 100000, isDr: false }
    ],
    narration: '(Business started with cash)',
    category: 'Capital',
    source: 'Owner Injection',
    aiConfidence: 100,
    requiresCaReview: false,
    supportingDoc: null
  },

  // 2. Exact entry from User's template: Goods purchased from Harish on credit
  {
    id: 'JE-1002',
    date: '2026-05-01',
    formattedDate: '2026 May 1',
    lines: [
      { accountName: 'Purchases A/c', lf: '501', debit: 20000, credit: 0, isDr: true },
      { accountName: "Harish's A/c", lf: '201', debit: 0, credit: 20000, isDr: false, partyRole: 'Sundry Creditor' }
    ],
    narration: '(Goods purchased from Harish on credit)',
    category: 'Purchases',
    source: 'Vendor Invoice #H-892',
    aiConfidence: 98,
    requiresCaReview: false,
    supportingDoc: 'Bill_Harish_May1.pdf'
  },

  // 3. Exact entry from User's template: Stationery purchased for cash
  {
    id: 'JE-1003',
    date: '2026-05-01',
    formattedDate: '2026 May 1',
    lines: [
      { accountName: 'Stationery & Office Supplies A/c', lf: '502', debit: 2200, credit: 0, isDr: true },
      { accountName: 'Cash A/c', lf: '101', debit: 0, credit: 2200, isDr: false }
    ],
    narration: '(Stationery purchased for cash)',
    category: 'Office Expense',
    source: 'Cash Receipt',
    aiConfidence: 99,
    requiresCaReview: false,
    supportingDoc: null
  },

  // 4. Exact entry from User's template: Opened a bank account
  {
    id: 'JE-1004',
    date: '2026-05-02',
    formattedDate: '2026 May 2',
    lines: [
      { accountName: 'Bank A/c (HDFC)', lf: '102', debit: 30000, credit: 0, isDr: true },
      { accountName: 'Cash A/c', lf: '101', debit: 0, credit: 30000, isDr: false }
    ],
    narration: '(Opened a bank account with HDFC)',
    category: 'Contra',
    source: 'Bank Deposit Slip',
    aiConfidence: 100,
    requiresCaReview: false,
    supportingDoc: null
  },

  // 5. Sales to Rahul Enterprises on credit (Debtor creation with GST)
  {
    id: 'JE-1005',
    date: '2026-05-10',
    formattedDate: '2026 May 10',
    lines: [
      { accountName: "Rahul Enterprises A/c", lf: '103', debit: 29500, credit: 0, isDr: true, partyRole: 'Sundry Debtor' },
      { accountName: 'Sales / Service Revenue A/c', lf: '401', debit: 0, credit: 25000, isDr: false },
      { accountName: 'Output CGST A/c', lf: '203', debit: 0, credit: 2250, isDr: false },
      { accountName: 'Output SGST A/c', lf: '204', debit: 0, credit: 2250, isDr: false }
    ],
    narration: '(Being web development services billed to Rahul Enterprises with 18% GST)',
    category: 'Sales',
    source: 'Tax Invoice #INV-2026-001',
    aiConfidence: 97,
    requiresCaReview: false,
    supportingDoc: 'Tax_Invoice_Rahul_001.pdf'
  },

  // 6. Capital Asset: Dell XPS Laptop for office (Section 32 Asset & ITC)
  {
    id: 'JE-1006',
    date: '2026-05-15',
    formattedDate: '2026 May 15',
    lines: [
      { accountName: 'Office Equipment A/c', lf: '104', debit: 75000, credit: 0, isDr: true },
      { accountName: 'Input CGST A/c', lf: '105', debit: 6750, credit: 0, isDr: true },
      { accountName: 'Input SGST A/c', lf: '106', debit: 6750, credit: 0, isDr: true },
      { accountName: 'Bank A/c (HDFC)', lf: '102', debit: 0, credit: 88500, isDr: false }
    ],
    narration: '(Bought Dell laptop for business use via HDFC NetBanking, 18% GST ITC claimed)',
    category: 'Fixed Asset',
    source: 'Dell Direct Invoice #DL-8831',
    aiConfidence: 74, // Below 80% to demonstrate CA human-in-the-loop flag!
    requiresCaReview: true,
    caReviewNote: 'High value capital asset (>₹50,000). Verify depreciation schedule & ITC eligibility under Sec 16(1).',
    supportingDoc: 'Dell_XPS_Invoice.pdf'
  },

  // 7. Secured Bank Facility / Institutional Lender: Axis Bank Working Capital Loan
  {
    id: 'JE-1007',
    date: '2026-05-18',
    formattedDate: '2026 May 18',
    lines: [
      { accountName: 'Bank A/c (HDFC)', lf: '102', debit: 300000, credit: 0, isDr: true },
      { accountName: 'Bank Loan A/c (Axis Bank)', lf: '202', debit: 0, credit: 300000, isDr: false, partyRole: 'Lender' }
    ],
    narration: '(Business loan disbursed by Axis Bank directly into HDFC Current A/c)',
    category: 'Loan Facility',
    source: 'Axis Bank Sanction Letter #AX-LN-4421',
    aiConfidence: 96,
    requiresCaReview: false,
    supportingDoc: 'Axis_Sanction_Letter.pdf'
  },

  // 8. Partial Payment Received from Rahul Enterprises
  {
    id: 'JE-1008',
    date: '2026-05-24',
    formattedDate: '2026 May 24',
    lines: [
      { accountName: 'Bank A/c (HDFC)', lf: '102', debit: 15000, credit: 0, isDr: true },
      { accountName: "Rahul Enterprises A/c", lf: '103', debit: 0, credit: 15000, isDr: false, partyRole: 'Sundry Debtor' }
    ],
    narration: '(UPI payment received from Rahul Enterprises against invoice #INV-2026-001)',
    category: 'Collection',
    source: 'UPI Ref #UPI-612940291',
    aiConfidence: 99,
    requiresCaReview: false,
    supportingDoc: null
  }
];

export const SAMPLE_PROMPT_PRESETS = [
  {
    label: "Bought Dell laptop ₹75k",
    prompt: "Bought a laptop for my business for ₹75,000 from Dell with 18% GST paid via bank"
  },
  {
    label: "Goods from Harish ₹20k",
    prompt: "Purchased goods from Harish for ₹20,000 on credit"
  },
  {
    label: "Bill Rahul ₹25k",
    prompt: "Create invoice for Rahul Enterprises for ₹25,000 for web design with 18% GST"
  },
  {
    label: "Who owes me money?",
    prompt: "Who owes money to the business and how much?"
  },
  {
    label: "Who do I owe / Lenders?",
    prompt: "Who does the business owe money to, and who lent us funds?"
  },
  {
    label: "How much GST do I owe?",
    prompt: "Why is my GST high and what is my net GST payable after input tax credit?"
  },
  {
    label: "Stationery ₹2,200 cash",
    prompt: "Stationery purchased for cash ₹2,200"
  },
  {
    label: "Axis Bank loan ₹3L",
    prompt: "Received ₹3,00,000 business loan from Axis Bank into our HDFC account"
  }
];
