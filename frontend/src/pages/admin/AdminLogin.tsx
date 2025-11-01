import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button, Input } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login for now
    setTimeout(() => {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        setAuth('mock-token', { id: 1, username: 'admin', email: 'admin@luxscents.com' });
        navigate('/admin/dashboard');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-luxury-dark mb-2">
                Admin Login
              </h1>
              <p className="text-gray-600">
                Sign in to manage your perfume collection
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                placeholder="Enter your username"
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 text-center">
                <strong>Demo Credentials:</strong><br />
                Username: admin<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
