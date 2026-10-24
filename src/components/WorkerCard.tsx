import React from 'react';
import { Link } from 'react-router-dom';
import type { Worker } from '../types';
import { Check, Star, Calendar, Banknote, ShieldCheck, Heart } from 'lucide-react';
import { formatKes } from '../utils/pricing';
import { getTomorrowShortLabel, getNextSaturdayShortLabel } from '../utils/dates';

interface WorkerCardProps {
  worker: Worker;
  isSelected: boolean;
  onToggleSelect: () => void;
  reasons: string[];
  disabledSelect?: boolean;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  isSelected,
  onToggleSelect,
  reasons,
  disabledSelect
}) => {
  const isTv = worker.category === 'tv_repair';
  const availabilityLabel = isTv ? getTomorrowShortLabel() : getNextSaturdayShortLabel();

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
        borderWidth: isSelected ? '2px' : '1px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        padding: '20px'
      }}
    >
      {/* Top Image & badges */}
      <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '14px' }}>
        <img
          src={worker.avatar}
          alt={worker.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Top right heart icon (from mockup) */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <Heart size={16} />
        </div>

        {/* Crew leader tag if applicable */}
        {worker.canLeadCrew && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={12} />
            <span>Crew Leader</span>
          </div>
        )}
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>{worker.name}</h3>
            {worker.identityCheckedDemo && (
              <span title="Identity check: simulated" style={{ color: '#16A34A', display: 'flex' }}>
                <ShieldCheck size={16} />
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isTv ? 'TV repair' : 'Harvesting'} · {worker.location}
          </p>
        </div>

        {/* Rating */}
        <div className="rating-pill">
          <Star size={15} className="star-icon" />
          <span>{worker.rating}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>
            ({worker.reviewCount})
          </span>
        </div>
      </div>

      {/* Key Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0', fontSize: '0.86rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
          <Calendar size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>
            <strong>Sample availability:</strong> {availabilityLabel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-main)' }}>
          <Banknote size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            {isTv ? (
              <>
                <strong>Diagnosis:</strong> {formatKes(worker.diagnosticRate || 800)}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                  Final repair quote after inspection
                </div>
              </>
            ) : (
              <>
                <strong>Daily rate:</strong> {formatKes(worker.dailyRate || 1200)} / day
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                  1-day labour (tools & transport separate)
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Why This Match */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          marginTop: 'auto',
          marginBottom: '16px'
        }}
      >
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Why this match
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
          {reasons.slice(0, 3).map((r, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-main)' }}>
              <Check size={14} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Link
          to={`/workers/${worker.id}`}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%' }}
        >
          View profile
        </Link>
        <button
          onClick={onToggleSelect}
          disabled={disabledSelect && !isSelected}
          className={`btn btn-sm ${isSelected ? 'btn-pale' : 'btn-primary'}`}
          style={{
            width: '100%',
            fontWeight: 700,
            borderColor: isSelected ? 'var(--primary)' : undefined
          }}
        >
          {isSelected ? (
            <>
              <Check size={14} />
              <span>Selected</span>
            </>
          ) : (
            'Select'
          )}
        </button>
      </div>
    </div>
  );
};
