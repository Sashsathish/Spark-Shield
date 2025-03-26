import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import FileScanner from './pages/FileScanner';
import URLScanner from './pages/URLScanner';
import DomainScanner from './pages/DomainScanner';
import IPScanner from './pages/IPScanner';
import PhishingDetector from './pages/PhishingDetector';
import CodeRepair from './pages/CodeRepair';
import NotFound from './pages/NotFound';
import { Layout } from './components/Layout';

// const queryClient = new QueryClient();

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <FileScanner />,
      },
      {
        path: '/url-scanner',
        element: <URLScanner />,
      },
      {
        path: '/domain-scanner',
        element: <DomainScanner />,
      },
      {
        path: '/ip-scanner',
        element: <IPScanner />,
      },
      {
        path: '/phishing-detector',
        element: <PhishingDetector />,
      },
      {
        path: '/code-repair',
        element: <CodeRepair />,
      },

    ]
  },
  {
    // Catch-all route for not found pages
    path: '*',
    element: <NotFound />,
  },
]);

const App = () => (
  // <QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <RouterProvider router={router} />
  </TooltipProvider>
  // </QueryClientProvider>
);

export default App;
