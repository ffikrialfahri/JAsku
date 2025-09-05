import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Mengambil kata kunci dari URL

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/services/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Failed to fetch search results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]); // Jalankan effect setiap kali query di URL berubah

  if (loading) {
    return <div>Searching...</div>;
  }

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      <hr />
      {results.length > 0 ? (
        results.map(service => (
          <Link to={`/service/${service.id}`} key={service.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{service.title}</h3>
              <p><strong>Category:</strong> {service.category}</p>
              <p><strong>Price:</strong> ${service.price}</p>
              <p>by {service.partner.name}</p>
            </div>
          </Link>
        ))
      ) : (
        <p>No services found matching your search.</p>
      )}
    </div>
  );
};

export default SearchResults;