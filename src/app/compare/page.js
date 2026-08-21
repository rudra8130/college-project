'use client';
import { useState, useEffect } from 'react';

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // dropdown ke liye saari colleges laate hain (bas naam/id chahiye)
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

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Compare Colleges</h1>
      <p>Select 2-3 colleges</p>

      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem' }}>
        {allColleges.map((c) => (
          <label key={c.id} style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={selectedIds.includes(c.id)}
              onChange={() => toggleSelect(c.id)}
              disabled={!selectedIds.includes(c.id) && selectedIds.length >= 3}
            />
            {' '}{c.name} — {c.location}
          </label>
        ))}
      </div>

      <button
        onClick={handleCompare}
        disabled={selectedIds.length < 2 || loading}
        style={{ marginTop: '1rem' }}
      >
        {loading ? 'Comparing...' : `Compare (${selectedIds.length} selected)`}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {comparison && (
        <table style={{ marginTop: '1.5rem', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Attribute</th>
              {comparison.map((c) => (
                <th key={c.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Location</td>
              {comparison.map((c) => <td key={c.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{c.location}</td>)}
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Fees</td>
              {comparison.map((c) => <td key={c.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>₹{c.fees.toLocaleString()}</td>)}
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Rating</td>
              {comparison.map((c) => <td key={c.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{c.rating}</td>)}
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Type</td>
              {comparison.map((c) => <td key={c.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{c.type}</td>)}
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Latest Avg Package</td>
              {comparison.map((c) => (
                <td key={c.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  {c.latestPlacement ? `₹${c.latestPlacement.avgPackage.toLocaleString()}` : 'N/A'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </main>
  );
}