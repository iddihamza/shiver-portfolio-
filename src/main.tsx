import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import TestApp from './TestApp.tsx'
// import './index.css'  // Temporarily disable CSS imports

// Add error handling for deployment debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }

  // Use test app first to verify basic deployment
  const useTestApp = window.location.pathname === '/test' || window.location.search.includes('test=true');
  
  createRoot(root).render(useTestApp ? <TestApp /> : <App />);
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; background: #000; color: #fff; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
      <h1>🚨 Deployment Error</h1>
      <p>Failed to start the application.</p>
      <pre style="background: #333; padding: 10px; border-radius: 4px; color: #ff6b6b;">${error}</pre>
      <a href="/?test=true" style="color: #00bcd4; margin-top: 20px;">Try Test Mode</a>
    </div>
  `;
}
