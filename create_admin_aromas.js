const fs = require('fs');

const enhancedAdminAromas = `import React, { useState, useEffect } from 'react';
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
  Tag,
  Package,
  TrendingUp,
  Flower,
  Citrus as CitrusIcon,
  TreePine,
  Waves,
  Sun,
  ChefHat,
  Apple,
  Leaf,
  Zap,
  X,
  Check,
  AlertCircle,
  BarChart3,
  Users,
  Heart
} from 'lucide-react';

interface Aroma {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  icon: string;
  usageCount: number;
  popularity: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

const AdminAromas: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAroma, setEditingAroma] = useState<Aroma | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'floral',
    description: '',
    color: '#ec4899'
  });

  const categories = ['all', 'floral', 'citrus', 'woody', 'fresh', 'oriental', 'spicy', 'sweet'];

  const categoryIcons = {
    floral: Flower,
    citrus: CitrusIcon,
    woody: TreePine,
    fresh: Waves,
    oriental: Sun,
    spicy: ChefHat,
    sweet: Apple
  };

  const categoryColors = {
    floral: '#ec4899',
    citrus: '#f59e0b',
    woody: '#8b5cf6',
    fresh: '#10b981',
    oriental: '#f97316',
    spicy: '#ef4444',
    sweet: '#ec4899'
  };

  const mockAromas: Aroma[] = [
    {
      id: '1',
      name: 'Rose',
      category: 'floral',
      description: 'Classic romantic rose scent with notes of violet and bergamot',
      color: '#ec4899',
      icon: '🌹',
      usageCount: 156,
      popularity: 4.8,
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Lemon',
      category: 'citrus',
      description: 'Fresh and zesty lemon fragrance with green undertones',
      color: '#f59e0b',
      icon: '🍋',
      usageCount: 142,
      popularity: 4.6,
      createdAt: '2024-01-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sandalwood',
      category: 'woody',
      description: 'Creamy and warm sandalwood with subtle sweetness',
      color: '#8b5cf6',
      icon: '🪵',
      usageCount: 98,
      popularity: 4.7,
      createdAt: '2024-02-10',
      status: 'active'
    },
    {
      id: '4',
      name: 'Ocean Breeze',
      category: 'fresh',
      description: 'Clean aquatic scent reminiscent of sea air',
      color: '#10b981',
      icon: '🌊',
      usageCount: 87,
      popularity: 4.5,
      createdAt: '2024-02-15',
      status: 'active'
    },
    {
      id: '5',
      name: 'Vanilla',
      category: 'sweet',
      description: 'Rich and creamy vanilla with warm undertones',
      color: '#ec4899',
      icon: '🍦',
      usageCount: 134,
      popularity: 4.9,
      createdAt: '2024-03-01',
      status: 'active'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setAromas(mockAromas);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredAromas = aromas.filter(aroma => {
    const matchesSearch = aroma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aroma.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || aroma.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddAroma = () => {
    const newAroma: Aroma = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      color: formData.color,
      icon: '🌸',
      usageCount: 0,
      popularity: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    if (editingAroma) {
      setAromas(aromas.map(a => a.id === editingAroma.id ? { ...newAroma, id: editingAroma.id, usageCount: editingAroma.usageCount, popularity: editingAroma.popularity } : a));
    } else {
      setAromas([...aromas, newAroma]);
    }

    setShowAddModal(false);
    setEditingAroma(null);
    setFormData({
      name: '',
      category: 'floral',
      description: '',
      color: '#ec4899'
    });
  };

  const handleDeleteAroma = (id: string) => {
    if (window.confirm('Are you sure you want to delete this aroma? This may affect existing products.')) {
      setAromas(aromas.filter(a => a.id !== id));
    }
  };

  const handleEditAroma = (aroma: Aroma) => {
    setEditingAroma(aroma);
    setFormData({
      name: aroma.name,
      category: aroma.category,
      description: aroma.description,
      color: aroma.color
    });
    setShowAddModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Flower className="h-5 w-5" />;
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
          <h2 className="text-2xl font-bold text-gray-900">Manage Aromas</h2>
          <p className="text-gray-600">Organize and manage fragrance categories and scent profiles</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Export Tags
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Aroma
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Aromas</p>
              <p className="text-2xl font-bold text-gray-900">{aromas.length}</p>
            </div>
            <Flower className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {aromas.reduce((sum, a) => sum + a.usageCount, 0)}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(aromas.reduce((sum, a) => sum + a.popularity, 0) / aromas.length).toFixed(1)}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aroma Categories</h3>
          <div className="space-y-3">
            {categories.filter(cat => cat !== 'all').map(category => {
              const count = aromas.filter(a => a.category === category).length;
              const percentage = (count / aromas.length) * 100;
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              const color = categoryColors[category as keyof typeof categoryColors];

              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: \`\${color}20\`, color: color }}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{category}</p>
                      <p className="text-sm text-gray-500">{count} aromas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{percentage.toFixed(0)}%</p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: \`\${percentage}%\`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Aromas</h3>
          <div className="space-y-3">
            {aromas
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 5)
              .map((aroma, index) => (
                <div key={aroma.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{aroma.name}</p>
                      <p className="text-sm text-gray-500">{aroma.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{aroma.popularity.toFixed(1)}</p>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3"
                          fill={i < Math.floor(aroma.popularity) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
              placeholder="Search aromas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 \${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }\`}
              >
                {category !== 'all' && getCategoryIcon(category)}
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Aromas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAromas.map((aroma) => (
          <Card key={aroma.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: \`\${aroma.color}20\` }}
                  >
                    {aroma.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{aroma.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{aroma.category}</p>
                  </div>
                </div>
                {getStatusBadge(aroma.status)}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {aroma.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Package className="h-4 w-4" />
                    <span>{aroma.usageCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{aroma.popularity.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: aroma.color }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    {aroma.usageCount > 100 ? 'Trending' : 'Normal'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditAroma(aroma)}
                    className="text-purple-600 hover:text-purple-900 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAroma(aroma.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAroma ? 'Edit Aroma' : 'Add New Aroma'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAroma(null);
                    setFormData({
                      name: '',
                      category: 'floral',
                      description: '',
                      color: '#ec4899'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aroma Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter aroma name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, color: categoryColors[e.target.value as keyof typeof categoryColors] }))}
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
                    placeholder="Describe this aroma profile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{formData.color}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAroma(null);
                    setFormData({
                      name: '',
                      category: 'floral',
                      description: '',
                      color: '#ec4899'
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAroma}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {editingAroma ? 'Update Aroma' : 'Add Aroma'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminAromas;`;

fs.writeFileSync('D:/website/testing/frontend/src/pages/admin/AdminAromas.tsx', enhancedAdminAromas);
console.log('Enhanced AdminAromas.tsx created successfully!');