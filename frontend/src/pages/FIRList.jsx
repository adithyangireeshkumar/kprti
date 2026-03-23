import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, FileText } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

export default function FIRList() {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFirs();
  }, []);

  const fetchFirs = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/firs`);
      setFirs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText color="var(--accent-secondary)" /> FIR Lifecycle Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log, track, and update First Information Reports.</p>
        </div>
      </header>

      <div className="glass-card animate-fade-in">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search by complainant, location, or ID..." className="input-glass" style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Complainant</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading records...</td></tr>
              ) : firs.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No FIRs found.</td></tr>
              ) : firs.map(fir => (
                <tr key={fir.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>#FIR-{String(fir.id).padStart(4, '0')}</td>
                  <td>{new Date(fir.incident_date).toLocaleDateString()}</td>
                  <td>{fir.location}</td>
                  <td>{fir.complainant_name}</td>
                  <td>
                    <span className={`badge badge-${fir.status.toLowerCase().replace(' ', '-')}`}>
                      {fir.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View Details</button>
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
