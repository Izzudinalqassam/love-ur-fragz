import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui';
import AdminPerfumes from './AdminPerfumes';
import AdminAromas from './AdminAromas';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-luxury-dark mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your perfume collection and aroma tags
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-luxury-gold mb-2">12</h3>
              <p className="text-gray-600">Total Perfumes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-luxury-gold mb-2">8</h3>
              <p className="text-gray-600">Aroma Tags</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-luxury-gold mb-2">$150</h3>
              <p className="text-gray-600">Average Price</p>
            </CardContent>
          </Card>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/admin/perfumes" replace />} />
          <Route path="/perfumes" element={<AdminPerfumes />} />
          <Route path="/aromas" element={<AdminAromas />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
