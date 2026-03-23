import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'url("https://images.unsplash.com/photo-1542880941-11d279cf4f82?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
      position: 'relative'
    }}>
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7))' }} />

      <div className="glass-panel" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '480px',
        width: '90%',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.1)',
          display: 'grid',
          placeItems: 'center',
          border: '1px solid var(--accent-secondary)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Shield size={40} color="var(--accent-secondary)" />
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>Kerala Police</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
          Criminal Data Management System (RTI Portal)
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', width: '100%', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          className="btn"
          style={{
            background: 'white',
            color: '#1f2937',
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <Lock size={14} /> Secure Access Portal
        </div>
      </div>
    </div>
  );
}
