import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, CheckCircle, Search } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

export default function CasesList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/cases`);
      setCases(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const closeCase = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/cases/${id}/close`);
      fetchCases();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase color="var(--accent-secondary)" /> Case Tracking
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage active investigations and review closed cases.</p>
      </header>

      <div className="glass-card animate-fade-in">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search cases by FIR ID or Notes..." className="input-glass" style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Linked FIR</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading records...</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No Cases found.</td></tr>
              ) : cases.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>#CASE-{String(c.id).padStart(4, '0')}</td>
                  <td>#FIR-{String(c.fir_id).padStart(4, '0')}</td>
                  <td>
                    <span className={`badge badge-${c.status.toLowerCase().replace(' ', '-')}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.notes || c.fir_desc}
                  </td>
                  <td>
                    {c.status !== 'Closed' && (
                      <button onClick={() => closeCase(c.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={14} color="var(--success)" /> Close Case
                      </button>
                    )}
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
