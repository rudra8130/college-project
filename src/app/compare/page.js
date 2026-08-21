'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/colleges?limit=50')
      .then((res) => res.json())
      .then((json) => setAllColleges(json.data || []));
  }, []);

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleCompare() {
    setError(null);
    setComparison(null);
    setLoading(true);

    const res = await fetch('/api/colleges/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Something went wrong');
    } else {
      setComparison(json.data);
    }
    setLoading(false);
  }

  // Sample fallback pictures for comparison headers
  const sampleImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  ];

  const filteredColleges = allColleges.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", position: 'relative', overflowX: 'hidden' }}>
      
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        .floating-bg {
          position: absolute; top: -100px; right: -100px; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
          filter: blur(90px); animation: pulseGlow 9s infinite ease-in-out; pointer-events: none;
        }
        .glass-card {
          background: rgba(18, 24, 38, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.4);
          border-radius: 4px;
        }
        .college-item {
          transition: all 0.2s ease;
        }
        .college-item:hover {
          background: rgba(99, 102, 241, 0.12) !important;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          color: #fff; font-weight: 600; border-radius: 0.85rem; padding: 0.85rem 2rem;
          border: none; cursor: pointer; transition: all 0.3s ease;
        }
        .btn-gradient:hover:not(:disabled) {
          opacity: 0.95; transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
        }
        .btn-gradient:disabled {
          opacity: 0.4; cursor: not-allowed;
        }
        .metric-row:nth-child(even) {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>

      <div className="floating-bg" />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Navigation Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <Link href="/" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', display: 'inline-block', marginBottom: '0.5rem' }}>
              ← Back to Discovery
            </Link>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Compare Colleges
            </h1>
          </div>
          <span style={{ fontSize: '0.85rem', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            Select 2 to 3 Colleges
          </span>
        </div>

        {/* Selection Glass Panel */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '2.5rem' }}>
          
          {/* Selected Colleges Pills */}
          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {selectedIds.map((id) => {
                const college = allColleges.find((c) => c.id === id);
                return (
                  <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.25)', border: '1px solid #6366f1', color: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600' }}>
                    🏛️ {college?.name || id}
                    <button onClick={() => toggleSelect(id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}>
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Search Box inside selection panel */}
          <input
            type="text"
            placeholder="🔍 Search college by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '0.75rem',
              color: '#fff',
              outline: 'none',
              marginBottom: '1rem',
              boxSizing: 'border-box'
            }}
          />

          {/* List of colleges */}
          <div className="custom-scrollbar" style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', background: 'rgba(15, 23, 42, 0.3)' }}>
            {filteredColleges.length === 0 ? (
              <p style={{ padding: '1rem', color: '#64748b', textAlign: 'center', margin: 0 }}>No colleges found</p>
            ) : (
              filteredColleges.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                const isDisabled = !isSelected && selectedIds.length >= 3;
                return (
                  <label
                    key={c.id}
                    className="college-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.4 : 1,
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(c.id)}
                      disabled={isDisabled}
                      style={{ accentColor: '#6366f1', width: '16px', height: '16px', cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <span style={{ fontWeight: '600', color: isSelected ? '#a5b4fc' : '#f1f5f9' }}>{c.name}</span>
                      <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '0.5rem' }}>• 📍 {c.location}</span>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {/* Compare trigger button */}
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCompare}
              disabled={selectedIds.length < 2 || loading}
              className="btn-gradient"
            >
              {loading ? '⚡ Comparing...' : `Compare (${selectedIds.length}/3 Selected)`}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '0.85rem', color: '#fda4af', marginBottom: '2rem' }}>
            ⚠️ Error: {error}
          </div>
        )}

        {/* Comparison Result Section */}
        {comparison && (
          <div className="glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '1.25rem', width: '220px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Features</th>
                    {comparison.map((c, index) => (
                      <th key={c.id} style={{ padding: '1.25rem', minWidth: '220px', verticalAlign: 'top' }}>
                        <div style={{ height: '100px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '0.75rem', position: 'relative' }}>
                          <img src={c.image || sampleImages[index % sampleImages.length]} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)' }} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>{c.name}</h3>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="metric-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: '600', color: '#a5b4fc' }}>📍 Location</td>
                    {comparison.map((c) => (
                      <td key={c.id} style={{ padding: '1.1rem 1.25rem', color: '#e2e8f0' }}>{c.location || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="metric-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: '600', color: '#a5b4fc' }}>💰 Annual Fees</td>
                    {comparison.map((c) => (
                      <td key={c.id} style={{ padding: '1.1rem 1.25rem', color: '#38bdf8', fontWeight: '700', fontSize: '1.05rem' }}>
                        {c.fees ? `₹${c.fees.toLocaleString()}` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="metric-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: '600', color: '#a5b4fc' }}>⭐ Rating</td>
                    {comparison.map((c) => (
                      <td key={c.id} style={{ padding: '1.1rem 1.25rem' }}>
                        <span style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>
                          ★ {c.rating || 'N/A'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="metric-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: '600', color: '#a5b4fc' }}>🏛️ College Type</td>
                    {comparison.map((c) => (
                      <td key={c.id} style={{ padding: '1.1rem 1.25rem', color: '#e2e8f0' }}>{c.type || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr className="metric-row">
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: '600', color: '#a5b4fc' }}>💼 Avg Placement</td>
                    {comparison.map((c) => (
                      <td key={c.id} style={{ padding: '1.1rem 1.25rem', color: '#4ade80', fontWeight: '700', fontSize: '1.05rem' }}>
                        {c.latestPlacement?.avgPackage ? `₹${c.latestPlacement.avgPackage.toLocaleString()}` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}