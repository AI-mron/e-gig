import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div style={{ maxWidth: '380px' }}>
            <div className="brand-logo" style={{ marginBottom: '12px' }}>
              <span>e-gig</span>
              <span className="brand-dot" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '14px' }}>
              Good work starts with the right people. Match with verified local professionals or assemble specialized crews through an intelligent assistant.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Independent Kenyan Startup Prototype</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-main)' }}>Demo Scenarios</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>
                <Link to="/hire" style={{ color: 'var(--text-muted)' }}>
                  TV Technician in Kilimani (1 worker)
                </Link>
              </li>
              <li>
                <Link to="/hire" style={{ color: 'var(--text-muted)' }}>
                  Harvesting Crew in Nakuru (4 workers)
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" style={{ color: 'var(--text-muted)' }}>
                  How the Assistant Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-main)' }}>Platform Scope</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>Diagnostic pricing for appliances</li>
              <li>Single-day harvesting assignments</li>
              <li>Transparent 5% platform service fees</li>
              <li>Trusted personal network signals</li>
            </ul>
          </div>
        </div>

        <div className="notice-box notice-demo" style={{ marginBottom: '20px' }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} e-gig Technologies. Prototype Demonstration.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy (Demo)</span>
            <span>Terms of Service (Demo)</span>
            <span>Nairobi & Nakuru, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
