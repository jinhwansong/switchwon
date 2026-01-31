import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/provider.ts';
import GlobalToast from './components/common/GlobalToast.tsx';
import './styles/fonts.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <GlobalToast />
    </QueryClientProvider>
  </StrictMode>
);
