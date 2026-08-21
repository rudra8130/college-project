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
    fetchCollege();
  }, [params.id]);

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
      setError('Failed to fetch college');
    }
    setLoading(false);
  }

  if (loading) return <main style={{ padding: '2rem' }}><p>Loading...</p></main>;
  if (error) return <main style={{ padding: '2rem' }}><p>Error: {error}</p><Link href="/">Back to listing</Link></main>;
  if (!college) return null;

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/">← Back to listing</Link>
      <h1>{college.name}</h1>
      <p>{college.location} | {college.type} | Established {college.established}</p>
      <p>Fees: ₹{college.fees.toLocaleString()} / year | Rating: {college.rating}</p>

      <h2>Courses</h2>
      <ul>
        {college.courses.map((c) => (
          <li key={c.id}>{c.name} — {c.duration} — ₹{c.fees.toLocaleString()}</li>
        ))}
      </ul>

      <h2>Placements</h2>
      {college.placements.map((p) => (
        <div key={p.id} style={{ marginBottom: '0.5rem' }}>
          <strong>{p.year}</strong>: Avg ₹{p.avgPackage.toLocaleString()}, Highest ₹{p.highestPackage.toLocaleString()}
          <p>Recruiters: {p.companies.join(', ')}</p>
        </div>
      ))}

      <h2>Reviews</h2>
      {college.reviews.map((r) => (
        <div key={r.id} style={{ borderTop: '1px solid #eee', padding: '0.5rem 0' }}>
          <strong>{r.author}</strong> — {r.rating}★
          <p>{r.text}</p>
        </div>
      ))}
    </main>
  );
}