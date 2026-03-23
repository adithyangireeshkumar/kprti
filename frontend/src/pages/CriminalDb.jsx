import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserSquare2, Search } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

export default function CriminalDb() {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCriminals();
  }, []);

  const fetchCriminals = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/criminals`);
      setCriminals(data);
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
          <UserSquare2 color="var(--accent-secondary)" /> Criminal Profiling
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Searchable database of criminal records and historical data.</p>
      </header>

      <div className="glass-card animate-fade-in">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search profiles by name or ID..." className="input-glass" style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading profiles...</p>
            ) : criminals.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No criminal records found.</p>
            ) : criminals.map(criminal => (
                <div key={criminal.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                           <img src={criminal.photo_url || `https://ui-avatars.com/api/?name=${criminal.name}&background=1e293b&color=94a3b8`} alt={criminal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{criminal.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>DOB: {criminal.dob || 'Unknown'}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <p><span style={{ color: 'var(--text-secondary)' }}>Marks:</span> {criminal.identifying_marks || 'None'}</p>
                        <p><span style={{ color: 'var(--text-secondary)' }}>History:</span> {criminal.history || 'No prior record'}</p>
                    </div>
                    <button className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }}>View Full Profile</button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
