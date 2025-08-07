import React from 'react';

const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000',
      color: '#fff'
    }}>
      <h1>SHIVER Portfolio - Test Deploy</h1>
      <p>If you can see this, the basic deployment is working!</p>
      <p>Environment check:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>✅ React: Working</li>
        <li>✅ Vite: Working</li>
        <li>✅ TypeScript: Working</li>
        <li>{import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'} Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}</li>
        <li>{import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'} Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</li>
      </ul>
      <button 
        onClick={() => window.location.href = '/full-app'}
        style={{
          padding: '10px 20px',
          margin: '20px',
          background: '#00bcd4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try Full App
      </button>
    </div>
  );
};

export default TestApp;