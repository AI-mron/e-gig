import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WORKERS } from '../data/workers';
import { formatKes } from '../utils/pricing';
import { getTomorrowAfternoonLabel, getNextSaturdayLabel } from '../utils/dates';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Check,
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedWorkerIds, toggleSelectWorker } = useApp();

  const worker = WORKERS.find(w => w.id === id);

  if (!worker) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: '#DC2626', margin: '0 auto 16px' }} />
        <h2 style={{ marginBottom: '8px' }}>Worker Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          The worker profile you requested does not exist in our demo dataset.
        </p>
        <Link to="/hire" className="btn btn-primary">
          Back to hiring assistant
        </Link>
      </div>
    );
  }

  const isSelected = selectedWorkerIds.includes(worker.id);
  const isTv = worker.category === 'tv_repair';
  const availabilityString = isTv ? getTomorrowAfternoonLabel() : getNextSaturdayLabel();

  return (
    <div className="worker-profile-page" style={{ padding: '24px 0 60px' }}>
      <div className="container">
        {/* Back Link Preserving Selections and State */}
        <button
          type="button"
          onClick={() => navigate('/hire')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to results</span>
        </button>

        {/* 2-Column Profile Layout Matching Mockup 03 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '32px',
            alignItems: 'start'
          }}
          className="profile-grid"
        >
          {/* ================= LEFT COLUMN: Bio & Work History ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Identity Card */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {worker.identityCheckedDemo && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        padding: '2px',
                        display: 'flex',
                        color: '#16A34A'
                      }}
                      title="Identity check: simulated"
                    >
                      <ShieldCheck size={20} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '2px' }}>{worker.name}</h1>
                    <span title="Identity check: simulated" style={{ color: '#16A34A', display: 'flex' }}>
                      <ShieldCheck size={20} />
                    </span>
                  </div>

                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {worker.title} · {worker.location}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    <span className="badge badge-verified">
                      <ShieldCheck size={13} />
                      <span>Identity checked (demo)</span>
                    </span>
                    {worker.canLeadCrew && (
                      <span className="badge badge-green">
                        <span>Crew Leader</span>
                      </span>
                    )}
                    <span className="badge badge-subtle">
                      {worker.skills[0]}
                    </span>
                  </div>

                  {/* Rating & Similar Repairs */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.9rem' }}>
                    <div className="rating-pill">
                      <Star size={16} className="star-icon" />
                      <span>{worker.rating}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                        ({worker.reviewCount} reviews)
                      </span>
                    </div>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                      {worker.similarJobs}+ similar completed jobs
                    </span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>About</h3>
                <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {worker.bio}
                </p>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={16} style={{ color: 'var(--primary)' }} />
                    <span>{worker.experienceYears}+ years experience</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={16} style={{ color: 'var(--primary)' }} />
                    <span>Speaks {worker.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Recommendation Quote (if present) */}
            {worker.fictionalRecommendation && (
              <div
                className="card"
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid #D1E7C8'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <img
                    src={worker.fictionalRecommendation.avatar || '/images/grace.jpg'}
                    alt={worker.fictionalRecommendation.recommender}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                      <span>{worker.fictionalRecommendation.recommender} recommends {worker.name.split(' ')[0]}</span>
                      <ShieldCheck size={16} style={{ color: '#16A34A' }} />
                    </div>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '0.9rem', margin: '6px 0 8px' }}>
                      “{worker.fictionalRecommendation.text}”
                    </p>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      — {worker.fictionalRecommendation.recommender} · Demo network (fictional)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Work History (Sample) */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Work history (sample)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {worker.sampleWorkHistory.map((job, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      paddingBottom: idx !== worker.sampleWorkHistory.length - 1 ? '16px' : '0',
                      borderBottom: idx !== worker.sampleWorkHistory.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#F1F4EE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        flexShrink: 0
                      }}
                    >
                      <Briefcase size={18} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {job.location} · {job.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Brands Tags */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
                {isTv ? 'Skills & brands' : 'Crops & proficiencies'}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {worker.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#F4F6F1',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--text-main)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Rate & Availability Card ================= */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
              {/* Price Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>
                  {isTv ? 'Diagnostic Fee' : 'Daily Labour Rate'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0 6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatKes(isTv ? (worker.diagnosticRate || 800) : (worker.dailyRate || 1200))}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {isTv ? 'for diagnosis' : '/ day'}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {isTv
                    ? 'Final repair quote provided after on-site inspection.'
                    : '1-day labour assignment. Tools & transport arranged separately.'}
                </p>
              </div>

              {/* Service Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Calendar size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Sample availability</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {availabilityString}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Service area</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {worker.serviceAreas.join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Clock size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Typical duration</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {isTv ? '30 – 60 minutes for diagnosis' : 'Full working day (7:00 AM – 5:00 PM)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prominent TV Diagnosis Alert */}
              {isTv && (
                <div className="notice-box notice-warning" style={{ marginBottom: '20px', padding: '12px' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>Diagnostic visit only: </strong>
                    Parts and additional labour require your separate quote approval before work begins.
                  </div>
                </div>
              )}

              {/* Select Action Button */}
              <button
                type="button"
                onClick={() => toggleSelectWorker(worker.id)}
                className={`btn btn-lg ${isSelected ? 'btn-pale' : 'btn-primary'}`}
                style={{ width: '100%', marginBottom: '16px', fontWeight: 700 }}
              >
                {isSelected ? (
                  <>
                    <Check size={18} />
                    <span>Selected ({worker.name.split(' ')[0]})</span>
                  </>
                ) : (
                  <span>Select {worker.name.split(' ')[0]}</span>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                <span>
                  Secure and transparent: You approve any additional costs before work begins.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
