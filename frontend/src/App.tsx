import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PerfumeCatalog from './pages/PerfumeCatalog';
import PerfumeDetail from './pages/PerfumeDetail';
import Recommendations from './pages/Recommendations';
import EnhancedRecommendations from "./pages/EnhancedRecommendations";
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPerfumes from './pages/admin/AdminPerfumes';
import AdminAromas from './pages/admin/AdminAromas';
import { useAuthStore } from './stores/authStore';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { token } = useAuthStore();

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<PerfumeCatalog />} />
          <Route path="/catalog/:id" element={<PerfumeDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/quiz" element={<EnhancedRecommendations />} />
  
          {/* Admin routes */}
          <Route
            path="/admin/login"
            element={token ? <Navigate to="/admin/dashboard" /> : <AdminLogin />}
          />
          <Route
            path="/admin/*"
            element={token ? <AdminDashboard /> : <Navigate to="/admin/login" />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;