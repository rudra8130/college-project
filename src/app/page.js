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
    params.set('limit', 10);

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

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>College Discovery</h1>
      <Link href="/compare">Compare Colleges</Link>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
        <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input placeholder="Min rating" type="number" step="0.1" value={minRating} onChange={(e) => setMinRating(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="fees_asc">Fees: Low to High</option>
          <option value="fees_desc">Fees: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      <div>
        {colleges.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem' }}>
            <h3><Link href={`/college/${c.id}`}>{c.name}</Link></h3>
            <p>{c.location} | Fees: ₹{c.fees.toLocaleString()} | Rating: {c.rating}</p>
          </div>
        ))}
      </div>

      {pagination && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </main>
  );
}