'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CollegeDetail() {
  const params = useParams();
  const [college, setCollege] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchCollege();
    }
  }, [params?.id]);

  async function fetchCollege() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/colleges/${params.id}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Something went wrong');
        setCollege(null);
      } else {
        setCollege(json.data);
      }
    } catch (err) {
      setError('Failed to fetch college details');
    }
    setLoading(false);
  }

  // Hero image fallback
  const heroImage = college?.image || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
        <div style={{ textAlign: 'center', animation: 'float 2s infinite ease-in-out' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <p style={{ fontSize: '1.2rem', color: '#818cf8', fontWeight: '600' }}>Fetching institute details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <div style={{ background: 'rgba(18, 24, 38, 0.8)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '2.5rem', borderRadius: '1.25rem', textAlign: 'center', maxWidth: '450px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ margin: '0 0 0.5rem', color: '#f43f5e' }}>Unable to Load</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error}</p>
          <Link href="/" style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: '#fff', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
            ← Back to Listing
          </Link>
        </div>
      </div>
    );
  }

  if (!college) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", position: 'relative', overflowX: 'hidden' }}>
      
      {/* Animations & Glass Styles */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        .floating-bg-1 {
          position: absolute; top: -120px; left: -100px; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
          filter: blur(90px); animation: pulseGlow 8s infinite ease-in-out; pointer-events: none;
        }
        .floating-bg-2 {
          position: absolute; top: 600px; right: -120px; width: 550px; height: 550px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
          filter: blur(100px); animation: pulseGlow 10s infinite ease-in-out 2s; pointer-events: none;
        }
        .glass-card {
          background: rgba(18, 24, 38, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #f8fafc;
        }
        .tag-pill {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      `}</style>

      <div className="floating-bg-1" />
      <div className="floating-bg-2" />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Back Link */}
        <Link href="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          color: '#818cf8', 
          textDecoration: 'none', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          ← Back to Discovery
        </Link>

        {/* Hero Banner Header */}
        <div className="glass-card" style={{ borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', height: '280px', width: '100%' }}>
            <img src={heroImage} alt={college.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9, 13, 22, 0.95) 10%, rgba(9, 13, 22, 0.4) 60%, transparent 100%)' }} />
            
            {/* Top Badges */}
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.6rem' }}>
              <span style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '0.4rem 0.9rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: '700' }}>
                ★ {college.rating || 'N/A'}
              </span>
              <span style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '0.4rem 0.9rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600' }}>
                {college.type || 'Institute'}
              </span>
            </div>

            {/* Title & Metadata inside Banner */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                📍 {college.location} • Estd. {college.established || 'N/A'}
              </span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0, color: '#ffffff', lineHeight: 1.2 }}>
                {college.name}
              </h1>
            </div>
          </div>

          {/* Key Metrics Highlight Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ padding: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>Annual Tuition Fees</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>
                ₹{college.fees ? college.fees.toLocaleString() : 'N/A'}
              </p>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>Overall Rating</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#fbbf24' }}>
                {college.rating} / 5.0
              </p>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>Total Offered Courses</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#a5b4fc' }}>
                {college.courses ? college.courses.length : 0} Programs
              </p>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>Latest Avg Placement</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#4ade80' }}>
                {college.placements?.[0]?.avgPackage ? `₹${college.placements[0].avgPackage.toLocaleString()}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Offered Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">📚 Offered Programs & Courses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {college.courses && college.courses.length > 0 ? (
              college.courses.map((c) => (
                <div key={c.id} className="glass-card" style={{ padding: '1.25rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>{c.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'inline-block', marginBottom: '1rem' }}>⏱️ Duration: {c.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Fee Structure</span>
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8' }}>₹{c.fees ? c.fees.toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b' }}>No course information available.</p>
            )}
          </div>
        </section>

        {/* Placements Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">💼 Placement Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {college.placements && college.placements.length > 0 ? (
              college.placements.map((p) => (
                <div key={p.id} className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>Batch Year {p.year}</span>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontWeight: '700' }}>
                      Verified Data
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Average Package</span>
                      <strong style={{ fontSize: '1.1rem', color: '#38bdf8' }}>₹{p.avgPackage ? p.avgPackage.toLocaleString() : 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Highest Package</span>
                      <strong style={{ fontSize: '1.1rem', color: '#4ade80' }}>₹{p.highestPackage ? p.highestPackage.toLocaleString() : 'N/A'}</strong>
                    </div>
                  </div>

                  {p.companies && p.companies.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Top Hiring Companies:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {p.companies.map((company, idx) => (
                          <span key={idx} className="tag-pill">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b' }}>No placement records found.</p>
            )}
          </div>
        </section>

        {/* Student Reviews Section */}
        <section>
          <h2 className="section-title">⭐ Student Reviews & Feedback</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {college.reviews && college.reviews.length > 0 ? (
              college.reviews.map((r) => (
                <div key={r.id} className="glass-card" style={{ padding: '1.25rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.25rem', italic: 'true' }}>
                    "{r.text}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                        {r.author ? r.author.charAt(0) : 'U'}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#f8fafc' }}>{r.author || 'Anonymous'}</span>
                    </div>
                    <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.9rem' }}>
                      ★ {r.rating}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b' }}>No reviews yet.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}