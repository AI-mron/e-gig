import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { serverStatus } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHire = location.pathname.startsWith('/hire');

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <span>e-gig</span>
          <span className="brand-dot" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/hire"
            className={`nav-link ${isHire ? 'active' : ''}`}
          >
            Find talent
          </Link>
          <a
            href="/#how-it-works"
            className="nav-link"
          >
            How it works
          </a>
        </nav>

        {/* Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isHire && (
            <div
              className={`nav-badge-pill ${serverStatus.geminiAvailable ? '' : 'fallback'}`}
              title={serverStatus.geminiAvailable ? `Using model: ${serverStatus.model}` : 'Running with local deterministic parser'}
              style={{
                backgroundColor: serverStatus.geminiAvailable ? 'var(--primary-light)' : '#FEF3C7',
                borderColor: serverStatus.geminiAvailable ? '#C5E2BA' : '#FCD34D',
                color: serverStatus.geminiAvailable ? 'var(--primary)' : '#92400E',
                fontSize: '0.74rem'
              }}
            >
              <Sparkles size={13} />
              <span>
                {serverStatus.geminiAvailable
                  ? 'Gemini connected · Worker data is simulated'
                  : 'Guided demo · Gemini not connected'}
              </span>
            </div>
          )}

          <div className="nav-badge-pill">
            <span className="status-dot simulated" />
            <span>Prototype · Sample data</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle btn btn-secondary btn-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '6px' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-color)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link
            to="/"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/hire"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find talent
          </Link>
          <a
            href="/#how-it-works"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </a>
        </div>
      )}
    </header>
  );
};
