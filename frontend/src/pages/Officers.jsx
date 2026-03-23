import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Search } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

export default function Officers() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/officers`);
      setOfficers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users color="var(--accent-secondary)" /> Officer & Station Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage law enforcement personnel, ranks, and contact info.</p>
      </header>
      
      <div className="glass-card animate-fade-in">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search officers..." className="input-glass" style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading records...</td></tr>
              ) : officers.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No Officers found. (Try running the seed endpoint)</td></tr>
              ) : officers.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.username}</td>
                  <td><span className="badge badge-investigation">{o.role}</span></td>
                  <td>Active</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View Station</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
