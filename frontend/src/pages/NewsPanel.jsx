import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Newspaper, CheckCircle, Search } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

export default function NewsPanel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/news`);
      setNews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const approveNews = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/news/${id}/approve`);
      fetchNews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Newspaper color="var(--accent-secondary)" /> News Moderation
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Approve or reject public articles linking to cases.</p>
      </header>

      <div className="glass-card animate-fade-in">
        <div style={{ display: 'grid', gap: '1rem' }}>
            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading news...</p>
            ) : news.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No news found.</p>
            ) : news.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{item.title}</h3>
                            <span className={item.status === 'Approved' ? 'badge badge-closed' : 'badge badge-open'}>{item.status}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{item.content}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Submitted: {new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    {item.status === 'Pending Review' && (
                        <button onClick={() => approveNews(item.id)} className="btn btn-primary" style={{ shrink: 0, padding: '0.75rem', gap: '0.5rem' }}>
                            <CheckCircle size={18} /> Approve
                        </button>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
