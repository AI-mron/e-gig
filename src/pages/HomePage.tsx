import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  User,
  Users,
  Tv,
  Wheat,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Star
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { loadPresetQuery, processUserPrompt } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    processUserPrompt(searchInput.trim());
    navigate('/hire');
  };

  const handleExampleClick = (exampleText: string) => {
    loadPresetQuery(exampleText);
    navigate('/hire');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{ padding: '48px 0 64px', overflow: 'hidden' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: '48px',
              alignItems: 'center'
            }}
            className="hero-grid"
          >
            {/* Left Column: Headlines & Search */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}
              >
                <span>Local Talent. Real Work.</span>
              </div>

              <h1 style={{ marginBottom: '16px', color: 'var(--primary)', lineHeight: 1.15 }}>
                Good work starts with the right people.
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-muted)',
                  marginBottom: '32px',
                  maxWidth: '520px'
                }}
              >
                Find a professional or build a crew. Tell us what you need, and e-gig helps you find the right match.
              </p>

              {/* Main Search Input Form */}
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '8px 8px 8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: 'var(--shadow-card)',
                  marginBottom: '24px'
                }}
              >
                <Search size={22} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="What work do you need done?"
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ flexShrink: 0 }}
                >
                  Find my match
                </button>
              </form>

              {/* Clickable Preset Examples */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Click to try demo scenarios:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleExampleClick('Find a TV technician in Kilimani tomorrow afternoon. My total budget is KSh 3,000.')}
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: '0.86rem',
                      lineHeight: 1.4,
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <Tv size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>“Find a TV technician in Kilimani tomorrow afternoon. My total budget is KSh 3,000.”</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExampleClick('I need 4 harvesting workers in Nakuru on Saturday for one day. My total budget is KSh 6,000.')}
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: '0.86rem',
                      lineHeight: 1.4,
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <Wheat size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>“I need 4 harvesting workers in Nakuru on Saturday for one day. My total budget is KSh 6,000.”</span>
                  </button>
                </div>
              </div>

              {/* Quick Option Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div
                  onClick={() => handleExampleClick('Find a TV technician in Kilimani tomorrow afternoon. My total budget is KSh 3,000.')}
                  className="card card-hover"
                  style={{ padding: '16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                      <User size={18} />
                      <span>Hire a professional</span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-light)' }} />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Get matched with a vetted local expert for diagnostic or skilled work.
                  </p>
                </div>

                <div
                  onClick={() => handleExampleClick('I need 4 harvesting workers in Nakuru on Saturday for one day. My total budget is KSh 6,000.')}
                  className="card card-hover"
                  style={{ padding: '16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                      <Users size={18} />
                      <span>Build a crew</span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-light)' }} />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Need a bigger job done? Assemble a coordinated team with a leader.
                  </p>
                </div>
              </div>

              {/* Popular Services Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)' }}>
                  POPULAR SERVICES:
                </span>
                <button
                  type="button"
                  onClick={() => handleExampleClick('Find a TV technician in Kilimani tomorrow afternoon. My total budget is KSh 3,000.')}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Tv size={14} />
                  <span>TV repair</span>
                  <ChevronRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleExampleClick('I need 4 harvesting workers in Nakuru on Saturday for one day. My total budget is KSh 6,000.')}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Wheat size={14} />
                  <span>Farm work</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Right Column: Hero Collage Matching Mockup 01 */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-hover)',
                  border: '1px solid var(--border-color)',
                  height: '460px',
                  backgroundColor: '#E7ECE5'
                }}
              >
                <img
                  src="/images/hero-workshop.jpg"
                  alt="Nairobi electronics workshop with technician"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Floating Card 1: Daniel Mwangi (TV Technician) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <img
                    src="/images/daniel-mwangi.jpg"
                    alt="Daniel Mwangi"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.88rem' }}>
                      <span>Daniel Mwangi</span>
                      <ShieldCheck size={14} style={{ color: '#16A34A' }} />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>TV technician · Kilimani</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      <Star size={12} className="star-icon" />
                      <span>4.8 (24 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2: Amina Otieno */}
                <div
                  style={{
                    position: 'absolute',
                    top: '160px',
                    left: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <img
                    src="/images/amina-otieno.jpg"
                    alt="Amina Otieno"
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.84rem' }}>
                      <span>Amina Otieno</span>
                      <ShieldCheck size={14} style={{ color: '#16A34A' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Electronics specialist</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 700 }}>
                      <Star size={11} className="star-icon" />
                      <span>4.7 (18 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Card 3: James Kiplangat (Harvesting Crew Lead) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <img
                    src="/images/james-kiplangat.jpg"
                    alt="James Kiplangat"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.88rem' }}>
                      <span>James Kiplangat</span>
                      <ShieldCheck size={14} style={{ color: '#16A34A' }} />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Harvest Crew Lead · Nakuru</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', fontWeight: 700, marginTop: '2px' }}>
                      <Star size={12} className="star-icon" />
                      <span>4.8 (26 jobs)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '64px 0', borderTop: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Simple & Reliable Hiring
            </span>
            <h2 style={{ margin: '8px 0 12px', color: 'var(--primary)' }}>
              How e-gig works
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Describe what you need in plain words. Our assistant matches you with reliable workers in your neighbourhood or farm region.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '16px'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Describe the job</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Enter what work you need done, your location, preferred date, budget, and whether you need an individual expert or a multi-person crew.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '16px'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Review your matches</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                View ranked worker profiles with verified past jobs, sample availability, transparent rates, and optional trusted network recommendations.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '16px'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Select and review booking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Confirm your selections with an itemised cost breakdown and clear 5% platform fee. Save your booking reference instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value in Plain Language */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '36px', color: 'var(--primary)' }}>
              Built for clear, fair local hiring
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Relevant experience</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Every technician and harvester has recorded work histories and genuine skills tailored to the exact task you describe.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Clear, transparent pricing</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    For appliances, pay only an honest diagnostic fee before approving parts. For farm labour, clear per-day rates with no surprises.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Trusted network recommendations</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Turn on network prioritisation to surface workers recommended by people in your community without compromising on skills.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>One person or a whole crew</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Easily hire an individual specialist or coordinate a full 4-person farm crew with a designated leader in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
