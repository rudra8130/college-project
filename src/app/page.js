'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, [page]);

  async function fetchColleges() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (minRating) params.set('minRating', minRating);
    if (sort) params.set('sort', sort);
    params.set('page', page);
    params.set('limit', 9); // Grid design ke liye 9 clean dikhta hai

    const res = await fetch(`/api/colleges?${params.toString()}`);
    const json = await res.json();
    setColleges(json.data || []);
    setPagination(json.pagination);
    setLoading(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchColleges();
  }

  // High quality Unsplash campus images for fallback
  const sampleImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", position: 'relative', overflowX: 'hidden' }}>
      
      {/* Custom Styles for Animations & Glass Effect */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.08); }
        }
        .floating-bg-1 {
          position: absolute; top: -100px; left: -100px; width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(0, 0, 0, 0) 70%);
          filter: blur(80px); animation: pulseGlow 8s infinite ease-in-out; pointer-events: none;
        }
        .floating-bg-2 {
          position: absolute; top: 300px; right: -120px; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(0, 0, 0, 0) 70%);
          filter: blur(90px); animation: pulseGlow 10s infinite ease-in-out 2s; pointer-events: none;
        }
        .glass-card {
          background: rgba(18, 24, 38, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .college-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .college-card:hover {
          transform: translateY(-8px);
          border-color: rgba(129, 140, 248, 0.4);
          box-shadow: 0 20px 35px -10px rgba(99, 102, 241, 0.25);
        }
        .college-card:hover .college-img {
          transform: scale(1.06);
        }
        .custom-input {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          padding: 0.85rem 1.1rem;
          border-radius: 0.85rem;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }
        .custom-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background: rgba(15, 23, 42, 0.85);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          color: #fff;
          font-weight: 600;
          border-radius: 0.85rem;
          padding: 0.85rem 1.8rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          opacity: 0.95;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
        }
      `}</style>

      {/* Floating Background Glow Shapes */}
      <div className="floating-bg-1" />
      <div className="floating-bg-2" />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Navigation / Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', color: '#818cf8', textTransform: 'uppercase' }}>
              ✦ Campus Finder 3.0
            </span>
            <h1 style={{ fontSize: '2.75rem', fontWeight: '800', margin: '0.4rem 0 0', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Discover Top Colleges
            </h1>
          </div>
          <Link href="/compare" style={{ 
            textDecoration: 'none', 
            padding: '0.75rem 1.4rem', 
            borderRadius: '9999px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.15)', 
            color: '#e2e8f0', 
            fontWeight: '500', 
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}>
            ⚖️ Compare Colleges
          </Link>
        </div>

        {/* Floating Glass Search & Filter Form */}
        <form onSubmit={handleSearch} className="glass-card" style={{ 
          padding: '1.25rem', 
          borderRadius: '1.25rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '0.85rem', 
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          <input 
            className="custom-input" 
            placeholder="🔍 Search name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <input 
            className="custom-input" 
            placeholder="📍 Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
          />
          <input 
            className="custom-input" 
            placeholder="⭐ Min Rating (1-5)" 
            type="number" 
            step="0.1" 
            value={minRating} 
            onChange={(e) => setMinRating(e.target.value)} 
          />
          <select 
            className="custom-input" 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#0f172a' }}>Sort By</option>
            <option value="fees_asc" style={{ background: '#0f172a' }}>Fees: Low to High</option>
            <option value="fees_desc" style={{ background: '#0f172a' }}>Fees: High to Low</option>
            <option value="rating_desc" style={{ background: '#0f172a' }}>Rating: High to Low</option>
          </select>

          <button type="submit" className="btn-gradient">
            Search
          </button>
        </form>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#818cf8', fontSize: '1.2rem', fontWeight: '500' }}>
            <span style={{ display: 'inline-block', animation: 'float 2s infinite ease-in-out' }}>🎓 Loading premier institutions...</span>
          </div>
        )}

        {/* College Grid Layout */}
        {!loading && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.75rem', 
            marginBottom: '3rem' 
          }}>
            {colleges.map((c, index) => {
              const campusImg = c.image || sampleImages[index % sampleImages.length];
              return (
                <div key={c.id} className="glass-card college-card" style={{ borderRadius: '1.25rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Image Banner with Badges */}
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img 
                      src={campusImg} 
                      alt={c.name} 
                      className="college-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} 
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                      ★ {c.rating || 'N/A'}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                        📍 {c.location || 'Location Not Specified'}
                      </span>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: '700', lineHeight: '1.4' }}>
                        <Link href={`/college/${c.id}`} style={{ color: '#f8fafc', textDecoration: 'none' }}>
                          {c.name}
                        </Link>
                      </h3>
                    </div>

                    <div style={{ paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Annual Fees</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8' }}>
                          ₹{c.fees ? c.fees.toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <Link href={`/college/${c.id}`} style={{ padding: '0.5rem 0.9rem', borderRadius: '0.6rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                        View Details →
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.2rem', marginTop: '2rem' }}>
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.1)',
                background: page <= 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                color: page <= 1 ? '#475569' : '#f8fafc',
                cursor: page <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>
              Page <strong style={{ color: '#fff' }}>{pagination.page}</strong> of {pagination.totalPages}
            </span>
            <button 
              disabled={page >= pagination.totalPages} 
              onClick={() => setPage(page + 1)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.1)',
                background: page >= pagination.totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                color: page >= pagination.totalPages ? '#475569' : '#f8fafc',
                cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
          </div>
        )}

      </main>
    </div>
  );
}