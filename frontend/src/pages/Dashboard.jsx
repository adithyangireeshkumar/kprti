import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/analytics`);
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!stats) return <div className="glass-card animate-fade-in"><p>Loading telemetry...</p></div>;

  const chartData = stats.recentFirs?.map(item => ({
    name: item.date,
    count: item.count
  })).reverse() || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time telemetry and command center data.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total FIRs" value={stats.totalFirs} icon={Activity} color="var(--accent-secondary)" />
        <StatCard title="Active Investigations" value={stats.activeCases} icon={ShieldAlert} color="var(--warning)" />
        <StatCard title="Closed Cases" value={stats.closedCases} icon={CheckCircle} color="var(--success)" />
        <StatCard title="Pending News Approvals" value={stats.pendingNews} icon={Clock} color="var(--text-secondary)" />
      </div>

      <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--accent-secondary)" />
          7-Day Incident Frequency
        </h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--border-glass)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--border-glass)" tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              No recent incident data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
          <Icon size={24} color={color} />
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{value}</h2>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: color, filter: 'blur(50px)', opacity: 0.1, borderRadius: '50%' }} />
    </div>
  );
}
