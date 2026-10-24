import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS } from '../data/workers';
import { calculatePricing, formatKes } from '../utils/pricing';
import { getTomorrowShortLabel, getNextSaturdayShortLabel } from '../utils/dates';
import {
  Calendar,
  MapPin,
  Briefcase,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Info
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    requirements,
    selectedWorkerIds,
    activeBooking,
    confirmBooking,
    startNewRequest
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEarningsAccordion, setShowEarningsAccordion] = useState(false);

  // If already booked, show confirmation state immediately (survives refresh!)
  if (activeBooking) {
    return (
      <div className="booking-page" style={{ padding: '36px 0 60px' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Success Banner */}
          <div
            className="card"
            style={{
              padding: '36px',
              textAlign: 'center',
              border: '2px solid var(--primary)',
              backgroundColor: '#FFFFFF',
              marginBottom: '28px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span className="badge badge-green" style={{ fontSize: '0.84rem', padding: '6px 14px', marginBottom: '12px' }}>
              Booking Reference: {activeBooking.referenceId}
            </span>

            <h1 style={{ fontSize: '1.85rem', color: 'var(--primary)', margin: '8px 0 10px' }}>
              Demo Booking Confirmed
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 24px' }}>
              Your simulated request has been recorded locally. Thank you for testing the e-gig hiring flow.
            </p>

            {/* Explicit Prototype Disclaimer as required by Section 7 */}
            <div className="notice-box notice-demo" style={{ textAlign: 'left', marginBottom: '24px' }}>
              <Info size={20} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.88rem' }}>
                <strong>Demo booking saved. </strong>
                No worker has been contacted, no availability has been confirmed, and no payment has been made.
              </div>
            </div>

            {/* Confirmed Details Summary */}
            <div
              style={{
                backgroundColor: '#F8F9F6',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '28px'
              }}
            >
              <h3 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--text-main)' }}>
                Confirmed Assignment Summary
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>SERVICE & LOCATION</span>
                  <strong>{activeBooking.requirements.category === 'tv_repair' ? 'TV Repair Diagnostic' : 'Harvesting Crew'}</strong>
                  <div style={{ color: 'var(--text-muted)' }}>{activeBooking.requirements.location}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>APPOINTMENT TIME</span>
                  <strong>{activeBooking.requirements.requestedDate || 'Scheduled date'}</strong>
                  <div style={{ color: 'var(--text-muted)' }}>{activeBooking.requirements.requestedTime}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>TOTAL DEMO PAYABLE</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                    {formatKes(activeBooking.totalPayable)}
                  </strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Includes 5% customer fee</div>
                </div>
              </div>

              {/* Workers list */}
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '8px' }}>
                  SELECTED PERSONNEL ({activeBooking.workers.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeBooking.workers.map(w => (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={w.avatar}
                          alt={w.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{w.name}</span>
                        {w.canLeadCrew && (
                          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Crew Leader</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {formatKes(w.category === 'tv_repair' ? (w.diagnosticRate || 800) : (w.dailyRate || 1200))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset / New Request Button */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={() => {
                  startNewRequest();
                  navigate('/');
                }}
                className="btn btn-primary btn-lg"
              >
                <RefreshCw size={18} />
                <span>Start a new request</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no workers selected, display empty state
  const selectedWorkers = WORKERS.filter(w => selectedWorkerIds.includes(w.id));
  if (selectedWorkers.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: 'var(--text-light)', margin: '0 auto 16px' }} />
        <h2 style={{ marginBottom: '8px' }}>No Workers Selected</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Please use the hiring assistant to choose a worker or assemble your crew before reviewing a booking.
        </p>
        <Link to="/hire" className="btn btn-primary">
          Back to hiring assistant
        </Link>
      </div>
    );
  }

  const pricing = calculatePricing(selectedWorkers);
  const isTv = requirements.category === 'tv_repair';
  const isCrew = selectedWorkers.length > 1;

  const handleConfirm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      confirmBooking();
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="booking-page" style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate('/hire')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to matches</span>
        </button>

        {/* 2-Column Review Layout Matching Mockup 04 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '32px',
            alignItems: 'start'
          }}
          className="booking-grid"
        >
          {/* ================= LEFT COLUMN: Job & Worker Details ================= */}
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '6px', color: 'var(--text-main)' }}>
              Review your booking
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
              Check the details below before confirming.
            </p>

            {/* Selected Worker(s) Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {selectedWorkers.map(w => (
                <div
                  key={w.id}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={w.avatar}
                      alt={w.name}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '1.05rem' }}>
                        <span>{w.name}</span>
                        <ShieldCheck size={16} style={{ color: '#16A34A' }} />
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {w.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginTop: '4px' }}>
                        <Star size={13} className="star-icon" />
                        <span style={{ fontWeight: 700 }}>{w.rating}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({w.reviewCount} reviews)</span>
                        {w.canLeadCrew && (
                          <span className="badge badge-green" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                            Crew Leader
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {formatKes(isTv ? (w.diagnosticRate || 800) : (w.dailyRate || 1200))}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {isTv ? 'Diagnostic visit' : '1-day rate'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Job Appointment Specifications */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Appointment Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Calendar size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Date & time</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                      {requirements.requestedDate || (isTv ? getTomorrowShortLabel() : getNextSaturdayShortLabel())}
                      {requirements.requestedTime && ` · ${requirements.requestedTime}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Briefcase size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Job Description</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                      {isTv
                        ? 'TV diagnosis (Final repair quote after inspection)'
                        : `Farm harvesting (${selectedWorkers.length} workers, 1-day assignment)`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Location</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                      {requirements.location || (isTv ? 'Kilimani, Nairobi' : 'Nakuru')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Cost Breakdown Card ================= */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Cost breakdown</h3>

              {/* Itemized Line Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '0.92rem' }}>
                {pricing.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-main)' }}>
                      {item.workerName} ({item.isLeader ? 'Leader' : isTv ? 'Diagnosis' : 'Labour'})
                    </span>
                    <span style={{ fontWeight: 600 }}>{formatKes(item.labourRate)}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Customer service fee (5%)</span>
                  <span>{formatKes(pricing.customerFee)}</span>
                </div>
              </div>

              {/* Total Payable */}
              <div
                style={{
                  borderTop: '2px solid var(--border-color)',
                  paddingTop: '16px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>Total payable</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatKes(pricing.totalPayable)}
                </span>
              </div>

              {/* Collapsible Worker Earnings (How this works) Accordion */}
              <div
                style={{
                  backgroundColor: '#F9FAF7',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '20px'
                }}
              >
                <div
                  onClick={() => setShowEarningsAccordion(!showEarningsAccordion)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <span>Worker earnings (how this works)</span>
                  {showEarningsAccordion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showEarningsAccordion ? (
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                      {pricing.items.map(item => (
                        <div key={item.workerId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.workerName}</span>
                          <span>Fee: {formatKes(item.workerFee)} · Receives: {formatKes(item.workerNetEarnings)}</span>
                        </div>
                      ))}
                    </div>
                    {isCrew && (
                      <div style={{ fontStyle: 'italic', marginBottom: '8px' }}>
                        Note: The crew leader's daily rate includes their active coordination role.
                      </div>
                    )}
                    <p>
                      The customer service fee and worker fee help us keep e-gig safe, verified, and reliable for everyone.
                    </p>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Worker fee: {formatKes(pricing.workerFeeTotal)} · Net worker earnings: {formatKes(pricing.workerNetTotal)}
                  </div>
                )}
              </div>

              {/* Reassurance Notice Box */}
              {isTv ? (
                <div className="notice-box notice-warning" style={{ marginBottom: '20px', padding: '12px' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.82rem' }}>
                    <strong>Repair parts and additional labour require your approval: </strong>
                    This diagnostic visit pinpoints the fault. You approve any parts cost before repair starts.
                  </div>
                </div>
              ) : (
                <div className="notice-box notice-info" style={{ marginBottom: '20px', padding: '12px' }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.82rem' }}>
                    <strong>1-Day Crew Assignment: </strong>
                    Tools and transport are arranged separately with your designated team leader.
                  </div>
                </div>
              )}

              {/* Confirmation CTA Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '12px', fontWeight: 700 }}
              >
                {isSubmitting ? 'Confirming demo booking...' : 'Confirm demo booking'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                No payment or real appointment will be made.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
