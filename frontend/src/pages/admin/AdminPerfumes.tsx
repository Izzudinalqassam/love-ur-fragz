import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  LoadingSkeleton,
  Badge
} from '../../components/ui';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  DollarSign,
  Calendar,
  TrendingUp,
  Download,
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  aromaTags: string[];
  description: string;
  image?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'out-of-stock';
}

const AdminPerfumes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: 'luxury',
    description: '',
    aromaTags: [] as string[]
  });

  const categories = ['all', 'luxury', 'designer', 'niche', 'classic', 'modern'];
  const aromaOptions = [
    'Floral', 'Citrus', 'Woody', 'Fresh', 'Oriental',
    'Spicy', 'Sweet', 'Aquatic', 'Green', 'Fruity'
  ];

  const mockPerfumes: Perfume[] = [
    {
      id: '1',
      name: 'Chanel No. 5',
      brand: 'Chanel',
      price: 150.00,
      rating: 4.8,
      stock: 45,
      category: 'luxury',
      aromaTags: ['Floral', 'Oriental', 'Sweet'],
      description: 'Classic and timeless fragrance',
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Dior Sauvage',
      brand: 'Dior',
      price: 120.00,
      rating: 4.6,
      stock: 12,
      category: 'designer',
      aromaTags: ['Woody', 'Fresh', 'Spicy'],
      description: 'Modern and masculine fragrance',
      createdAt: '2024-02-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Tom Ford Black Orchid',
      brand: 'Tom Ford',
      price: 220.00,
      rating: 4.9,
      stock: 0,
      category: 'luxury',
      aromaTags: ['Oriental', 'Spicy', 'Sweet'],
      description: 'Luxurious and mysterious scent',
      createdAt: '2024-03-10',
      status: 'out-of-stock'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setPerfumes(mockPerfumes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPerfumes = perfumes.filter(perfume => {
    const matchesSearch = perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perfume.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || perfume.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddPerfume = () => {
    const newPerfume: Perfume = {
      id: Date.now().toString(),
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      rating: 0,
      stock: parseInt(formData.stock),
      category: formData.category,
      aromaTags: formData.aromaTags,
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    if (editingPerfume) {
      setPerfumes(perfumes.map(p => p.id === editingPerfume.id ? { ...newPerfume, id: editingPerfume.id } : p));
    } else {
      setPerfumes([...perfumes, newPerfume]);
    }

    setShowAddModal(false);
    setEditingPerfume(null);
    setFormData({
      name: '',
      brand: '',
      price: '',
      stock: '',
      category: 'luxury',
      description: '',
      aromaTags: []
    });
  };

  const handleDeletePerfume = (id: string) => {
    if (window.confirm('Are you sure you want to delete this perfume?')) {
      setPerfumes(perfumes.filter(p => p.id !== id));
    }
  };

  const handleEditPerfume = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setFormData({
      name: perfume.name,
      brand: perfume.brand,
      price: perfume.price.toString(),
      stock: perfume.stock.toString(),
      category: perfume.category,
      description: perfume.description,
      aromaTags: perfume.aromaTags
    });
    setShowAddModal(true);
  };

  const toggleAromaTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      aromaTags: prev.aromaTags.includes(tag)
        ? prev.aromaTags.filter(t => t !== tag)
        : [...prev.aromaTags, tag]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Perfumes</h2>
          <p className="text-gray-600">Add, edit, and manage your fragrance inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Perfume
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{perfumes.length}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {perfumes.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {perfumes.filter(p => p.stock < 20).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${perfumes.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(0)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPerfumes.map((perfume) => (
                <tr key={perfume.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{perfume.name}</div>
                      <div className="text-sm text-gray-500">
                        {perfume.aromaTags.slice(0, 2).join(', ')}
                        {perfume.aromaTags.length > 2 && ' + more'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perfume.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${perfume.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      perfume.stock < 20 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {perfume.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{perfume.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(perfume.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditPerfume(perfume)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePerfume(perfume.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPerfume ? 'Edit Perfume' : 'Add New Perfume'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPerfume(null);
                    setFormData({
                      name: '',
                      brand: '',
                      price: '',
                      stock: '',
                      category: 'luxury',
                      description: '',
                      aromaTags: []
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perfume Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter perfume name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter perfume description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aroma Tags
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {aromaOptions.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleAromaTag(tag)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.aromaTags.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPerfume(null);
                    setFormData({
                      name: '',
                      brand: '',
                      price: '',
                      stock: '',
                      category: 'luxury',
                      description: '',
                      aromaTags: []
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPerfume}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {editingPerfume ? 'Update Perfume' : 'Add Perfume'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPerfumes;