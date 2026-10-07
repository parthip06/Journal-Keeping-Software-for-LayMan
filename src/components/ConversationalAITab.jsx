import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../engine/accountingEngine';

export function ConversationalAITab({ 
  onSendQuery, 
  onPostProposedEntry,
  messages,
  setMessages 
}) {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (overrideText) => {
    const query = overrideText || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      const response = onSendQuery(query);
      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        result: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 300);
  };

  const handleConfirm = (msgId, proposed) => {
    onPostProposedEntry(proposed.entry);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          result: {
            ...m.result,
            isCommitted: true
          }
        };
      }
      return m;
    }));
  };

  return (
    <div className="clean-chat-box">
      {/* Top Bar */}
      <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>AI Accountant Assistant</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Just speak naturally. The AI handles the debits and credits.</p>
        </div>
        <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="clean-chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`clean-bubble ${msg.sender}`}>
            {msg.sender === 'user' ? (
              <div>{msg.text}</div>
            ) : (
              <div>
                {/* 1. Direct Answer to a Question */}
                {msg.result.type === 'answer' && (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0284c7', marginBottom: '0.35rem' }}>
                      {msg.result.title}
                    </div>
                    <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', color: '#1e293b' }}>
                      {msg.result.summary}
                    </div>
                  </div>
                )}

                {/* 2. Proposed Journal Entry */}
                {msg.result.type === 'proposed_entry' && (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                      Here is how this will be written in your Journal Book:
                    </div>

                    {/* Paper Preview */}
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.88rem'
                    }}>
                      {msg.result.entry.lines.map((l, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: l.debit > 0 ? 0 : '1.5rem', marginBottom: '0.2rem' }}>
                          <span>{l.debit > 0 ? `${l.accountName} Dr.` : `To ${l.accountName}`}</span>
                          <span style={{ fontWeight: 700 }}>
                            {l.debit > 0 ? `₹${l.debit.toLocaleString('en-IN')}` : `₹${l.credit.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      ))}
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.4rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35rem', fontFamily: 'var(--font-sans)' }}>
                        {msg.result.entry.narration}
                      </div>
                    </div>

                    {/* Plain Language Summary */}
                    <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', color: '#334155' }}>
                      <strong>What this means:</strong>
                      {msg.result.impacts.map((imp, idx) => (
                        <div key={idx}>&bull; {imp}</div>
                      ))}
                    </div>

                    {/* Confirm Button */}
                    <div style={{ marginTop: '0.85rem', textAlign: 'right' }}>
                      {msg.result.isCommitted ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>
                          <CheckCircle2 size={16} />
                          <span>Written into your Journal Book</span>
                        </div>
                      ) : (
                        <button
                          className="btn-primary"
                          onClick={() => handleConfirm(msg.id, msg.result)}
                        >
                          <Check size={14} />
                          <span>Save to Journal Book</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? '#bae6fd' : '#94a3b8', textAlign: 'right', marginTop: '0.25rem' }}>
              {msg.timestamp}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="clean-bubble ai" style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Writing into accounting rules...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div style={{ padding: '0.5rem 1.25rem', background: '#f8fafc', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
        <button 
          className="suggestion-pill"
          onClick={() => handleSubmit("Who owes money to the business?")}
        >
          Who owes me money?
        </button>
        <button 
          className="suggestion-pill"
          onClick={() => handleSubmit("Who does the business owe money to?")}
        >
          Who do I owe?
        </button>
        <button 
          className="suggestion-pill"
          onClick={() => handleSubmit("Bought stationery for cash ₹2,200")}
        >
          Bought stationery for cash ₹2,200
        </button>
        <button 
          className="suggestion-pill"
          onClick={() => handleSubmit("Purchased goods from Harish for ₹20,000 on credit")}
        >
          Purchased goods from Harish for ₹20,000
        </button>
      </div>

      {/* Input */}
      <div className="clean-chat-input-bar">
        <input 
          type="text"
          className="clean-input"
          placeholder="Tell me what you bought, sold, or ask a question (e.g. 'Paid rent ₹10,000' or 'Who owes me?')..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
        <button 
          className="btn-primary"
          onClick={() => handleSubmit()}
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
