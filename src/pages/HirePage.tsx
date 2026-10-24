import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { matchWorkers } from '../utils/matching';
import { WorkerCard } from '../components/WorkerCard';
import { calculatePricing, formatKes } from '../utils/pricing';
import { WORKERS } from '../data/workers';
import {
  Send,
  Sparkles,
  Bot,
  AlertTriangle,
  Users,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const HirePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    requirements,
    updateRequirements,
    messages,
    selectedWorkerIds,
    toggleSelectWorker,
    isLoadingAi,
    processUserPrompt,
    startNewRequest
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showEditFields, setShowEditFields] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi]);

  // Execute matching engine
  const matchResult = matchWorkers(requirements);

  // Selected workers objects
  const selectedWorkers = WORKERS.filter(w => selectedWorkerIds.includes(w.id));
  const pricing = calculatePricing(selectedWorkers);

  // Check crew leader constraint
  const isCrew = (requirements.category === 'harvesting' && requirements.workerCount > 1);
  const hasLeaderSelected = selectedWorkers.some(w => w.canLeadCrew);
  const targetWorkerCount = requirements.category === 'tv_repair' ? 1 : Math.max(1, requirements.workerCount);
  const countMet = selectedWorkers.length === targetWorkerCount;

  // Budget validation for current selection
  const isCurrentSelectionOverBudget = !!(requirements.budgetKes && pricing.totalPayable > requirements.budgetKes);

  // Ready to book?
  const canProceedToBooking = countMet &&
    (!isCrew || hasLeaderSelected) &&
    !isCurrentSelectionOverBudget &&
    selectedWorkers.length > 0;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoadingAi) return;
    const textToSend = inputText.trim();
    setInputText('');
    await processUserPrompt(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSuggestion = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="hire-page" style={{ padding: '24px 0 48px' }}>
      <div className="container">
        {/* Main 2-column split layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '430px 1fr',
            gap: '28px',
            alignItems: 'start'
          }}
          className="hire-grid"
        >
          {/* ================= LEFT COLUMN: Chat Assistant ================= */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 140px)',
              minHeight: '620px',
              padding: '0',
              overflow: 'hidden',
              position: 'sticky',
              top: '90px'
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bot size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Your hiring assistant</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Tell me what you need and I'll find the right people.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={startNewRequest}
                className="btn btn-secondary btn-sm"
                title="Clear request and start again"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Conversation Messages Scroll Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: '#FAFAF8'
              }}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '85%'
                    }}
                  >
                    {!isUser && (
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                      >
                        e-gig
                      </div>
                    )}

                    <div
                      style={{
                        backgroundColor: isUser ? 'var(--primary)' : '#FFFFFF',
                        color: isUser ? '#FFFFFF' : 'var(--text-main)',
                        border: isUser ? 'none' : '1px solid var(--border-color)',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding: '12px 16px',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.88rem',
                        lineHeight: 1.45
                      }}
                    >
                      <p style={{ color: isUser ? '#FFFFFF' : 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </p>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-light)',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoadingAi && (
                <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    e-gig
                  </div>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <Sparkles size={14} className="animate-spin" />
                    <span>Analyzing request and finding matches...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Pill Chips */}
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              <button
                type="button"
                onClick={() => handleQuickSuggestion('Kilimani')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
              >
                e.g. Kilimani
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('Nakuru')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
              >
                e.g. Nakuru
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('Budget KSh 3,000')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
              >
                under 3,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickSuggestion('Prioritise my personal network recommendations')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
              >
                prioritise network
              </button>
            </div>

            {/* Chat Composer */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end'
              }}
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell me more or refine your request... (Enter to send, Shift+Enter for new line)"
                rows={2}
                style={{
                  flex: 1,
                  resize: 'none',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  color: 'var(--text-main)'
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoadingAi}
                className="btn btn-primary"
                style={{ height: '42px', width: '42px', padding: 0, borderRadius: 'var(--radius-sm)' }}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* ================= RIGHT COLUMN: Requirements & Worker Matches ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Requirements Card & Edit Panel */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>Job Requirements</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Extracted from your request. You can edit any field directly.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditFields(!showEditFields)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Sliders size={14} />
                  <span>{showEditFields ? 'Hide fields' : 'Edit requirements'}</span>
                </button>
              </div>

              {/* Requirement Summary Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: showEditFields ? '18px' : '0' }}>
                <span className="badge badge-green">
                  {requirements.category === 'tv_repair' ? 'TV & Appliance Repair' : requirements.category === 'harvesting' ? 'Farm & Harvesting Work' : 'No service selected'}
                </span>
                <span className="badge badge-subtle">
                  Location: {requirements.location || 'Not specified'}
                </span>
                <span className="badge badge-subtle">
                  Date: {requirements.requestedDate || 'Flexible'}
                </span>
                <span className="badge badge-subtle">
                  Workers: {requirements.category === 'tv_repair' ? '1 Technician (Diagnostic)' : `${requirements.workerCount} Workers`}
                </span>
                <span className="badge badge-subtle">
                  Budget: {requirements.budgetKes ? formatKes(requirements.budgetKes) : 'Not specified'}
                </span>
              </div>

              {/* Editable Fields Form */}
              {showEditFields && (
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '14px'
                  }}
                >
                  <div className="input-group">
                    <label className="input-label">Service Category</label>
                    <select
                      className="select-control"
                      value={requirements.category || ''}
                      onChange={(e) => updateRequirements({ category: (e.target.value as any) || null })}
                    >
                      <option value="">Select service...</option>
                      <option value="tv_repair">TV & Appliance Repair</option>
                      <option value="harvesting">Farm & Harvesting Work</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Location</label>
                    <input
                      type="text"
                      className="input-text"
                      value={requirements.location}
                      onChange={(e) => updateRequirements({ location: e.target.value })}
                      placeholder="e.g. Kilimani, Nakuru"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      type="text"
                      className="input-text"
                      value={requirements.requestedDate}
                      onChange={(e) => updateRequirements({ requestedDate: e.target.value })}
                      placeholder="e.g. Tomorrow, Saturday"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Workers Count</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      className="input-text"
                      disabled={requirements.category === 'tv_repair'}
                      value={requirements.category === 'tv_repair' ? 1 : requirements.workerCount}
                      onChange={(e) => updateRequirements({ workerCount: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Total Budget (KES)</label>
                    <input
                      type="number"
                      step={100}
                      className="input-text"
                      value={requirements.budgetKes || ''}
                      onChange={(e) => updateRequirements({ budgetKes: parseInt(e.target.value, 10) || null })}
                      placeholder="e.g. 3000, 6000"
                    />
                  </div>
                </div>
              )}

              {/* Personal Network Toggle */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  marginTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Prioritise my network</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Fictional demo connections (e.g. Grace, Peter). Ranks verified community recommendations higher.
                  </div>
                </div>

                <div
                  className="toggle-wrapper"
                  onClick={() => updateRequirements({ preferNetwork: !requirements.preferNetwork })}
                >
                  <div className={`toggle-switch ${requirements.preferNetwork ? 'active' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostics vs Repair Notice for TV */}
            {requirements.category === 'tv_repair' && (
              <div className="notice-box notice-warning">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Diagnostic Visit Pricing: </strong>
                  Displayed prices cover an on-site technical inspection and fault diagnosis. Because component faults cannot be verified prior to testing, additional repair labour and replacement parts require your explicit quote approval before work begins.
                </div>
              </div>
            )}

            {/* Harvesting 1-day Notice */}
            {requirements.category === 'harvesting' && (
              <div className="notice-box notice-info">
                <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Harvesting Assignment Scope: </strong>
                  Rates shown are per-day labour rates for 1-day assignments in Nakuru. Tools, field transport, and produce crating are arranged separately with the crew lead.
                </div>
              </div>
            )}

            {/* Warnings: Budget Too Low */}
            {matchResult.isBudgetTooLow && (
              <div className="notice-box notice-warning">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Budget Too Low: </strong>
                  Your specified budget of {formatKes(requirements.budgetKes || 0)} is below the minimum required for this service ({formatKes(matchResult.minimumPossibleBudgetKes)} including the 5% customer service fee). Please increase your budget or adjust the crew size.
                </div>
              </div>
            )}

            {/* Warnings: Insufficient Crew Members */}
            {matchResult.isCrewInsufficient && requirements.category === 'harvesting' && (
              <div className="notice-box notice-warning">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Insufficient Workers Available: </strong>
                  You requested {requirements.workerCount} workers, but only {matchResult.eligibleWorkers.length} matching workers are available in Nakuru for this date.
                </div>
              </div>
            )}

            {/* Warnings: Unsupported Location */}
            {matchResult.unsupportedLocation && (
              <div className="notice-box notice-warning">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />

              </div>
            )}

            {/* Matching Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                  {matchResult.eligibleWorkers.length} {requirements.category === 'tv_repair' ? 'technicians available' : 'workers available'}
                </h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Here are professionals matching your criteria.
                </div>
              </div>

              {/* Crew selection count badge */}
              {isCrew && (
                <div className="badge badge-green" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                  <Users size={14} />
                  <span>{selectedWorkers.length} of {targetWorkerCount} workers selected</span>
                </div>
              )}
            </div>

            {/* Worker Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
              {matchResult.eligibleWorkers.map(({ worker, reasons }) => {
                const isSelected = selectedWorkerIds.includes(worker.id);
                return (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    isSelected={isSelected}
                    onToggleSelect={() => toggleSelectWorker(worker.id)}
                    reasons={reasons}
                    disabledSelect={!isSelected && isCrew && selectedWorkerIds.length >= targetWorkerCount}
                  />
                );
              })}
            </div>

            {/* Empty state if 0 eligible */}
            {matchResult.eligibleWorkers.length === 0 && !matchResult.unsupportedLocation && (
              <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <HelpCircle size={40} style={{ color: 'var(--text-light)', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No matching workers found</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 16px', fontSize: '0.9rem' }}>
                  Try describing your job in the chat on the left, or click one of our prepared examples on the Home page.
                </p>
                <button
                  type="button"
                  onClick={() => updateRequirements({ category: 'tv_repair', location: 'Kilimani', budgetKes: 3000 })}
                  className="btn btn-secondary"
                >
                  Reset to Kilimani TV Technician
                </button>
              </div>
            )}

            {/* Crew Selection Summary Bar & Booking Button */}
            {selectedWorkers.length > 0 && (
              <div
                className="card"
                style={{
                  position: 'sticky',
                  bottom: '20px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid var(--primary)',
                  boxShadow: 'var(--shadow-dropdown)',
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  zIndex: 40
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      Selected: {selectedWorkers.length} {selectedWorkers.length === 1 ? 'Worker' : 'Workers'}
                    </span>
                    {isCrew && (
                      <span className={`badge ${hasLeaderSelected ? 'badge-green' : 'badge-amber'}`}>
                        {hasLeaderSelected ? 'Leader included' : 'Crew leader required'}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Running total: <strong>{formatKes(pricing.totalPayable)}</strong> (includes 5% customer fee)
                    {requirements.budgetKes && (
                      <span style={{ marginLeft: '8px', color: isCurrentSelectionOverBudget ? '#DC2626' : '#16A34A' }}>
                        · Budget: {formatKes(requirements.budgetKes)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {!canProceedToBooking && (
                    <span style={{ fontSize: '0.8rem', color: '#B45309' }}>
                      {isCurrentSelectionOverBudget
                        ? 'Total exceeds your budget'
                        : isCrew && !hasLeaderSelected
                          ? 'Please select 1 crew leader'
                          : `Select ${targetWorkerCount - selectedWorkers.length} more worker(s)`}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!canProceedToBooking}
                    onClick={() => navigate('/booking')}
                    className="btn btn-primary btn-lg"
                  >
                    <span>Review booking</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
