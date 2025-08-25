import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Phone, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Camera,
  Navigation,
  CreditCard,
  TrendingUp,
  Users,
  UserX
} from 'lucide-react';
import { Borrower } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';

// Mock data
const mockBorrowers: Borrower[] = [
  {
    id: '1',
    lineId: '1',
    name: 'Rajesh Kumar',
    phone: '+919876543210',
    address: '123 Market Street, Central Market',
    geolocation: { lat: 28.6139, lng: 77.2090 },
    isHighRisk: false,
    isDefaulter: false,
    totalLoans: 5,
    activeLoans: 2,
    totalRepaid: 45000,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    lineId: '1',
    name: 'Priya Sharma',
    phone: '+919876543211',
    address: '456 Industrial Area, Sector 5',
    geolocation: { lat: 28.6129, lng: 77.2295 },
    isHighRisk: false,
    isDefaulter: false,
    totalLoans: 3,
    activeLoans: 1,
    totalRepaid: 25000,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    lineId: '2',
    name: 'Amit Singh',
    phone: '+919876543212',
    address: '789 Residential Zone, Block A',
    geolocation: { lat: 28.5355, lng: 77.3910 },
    isHighRisk: true,
    isDefaulter: true,
    totalLoans: 8,
    activeLoans: 3,
    totalRepaid: 15000,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    lineId: '1',
    name: 'Sunita Devi',
    phone: '+919876543213',
    address: '321 Village Road, Rural Area',
    isHighRisk: false,
    isDefaulter: false,
    totalLoans: 2,
    activeLoans: 1,
    totalRepaid: 12000,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '5',
    lineId: '2',
    name: 'Mohan Lal',
    phone: '+919876543214',
    address: '654 Commercial Street, Business District',
    geolocation: { lat: 28.7041, lng: 77.1025 },
    isHighRisk: false,
    isDefaulter: false,
    totalLoans: 6,
    activeLoans: 2,
    totalRepaid: 38000,
    createdAt: new Date('2024-01-25')
  }
];

export const BorrowersManagement: React.FC = () => {
  const { user } = useAuth();
  const [borrowers, setBorrowers] = useState<Borrower[]>(mockBorrowers);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const borrowersData = await dataService.getBorrowers();
        setBorrowers(borrowersData);
      } catch (error) {
        console.error('Error loading borrowers:', error);
      }
    };
    
    loadData();
  }, []);

  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesSearch = borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         borrower.phone.includes(searchTerm) ||
                         borrower.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRisk = true;
    if (riskFilter === 'high-risk') matchesRisk = borrower.isHighRisk;
    else if (riskFilter === 'defaulter') matchesRisk = borrower.isDefaulter;
    else if (riskFilter === 'good') matchesRisk = !borrower.isHighRisk && !borrower.isDefaulter;
    
    return matchesSearch && matchesRisk;
  });

  const handleCreateBorrower = () => {
    setShowCreateModal(true);
  };

  const handleCreateBorrowerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBorrower = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      lineId: formData.get('lineId') as string,
      isHighRisk: false,
      isDefaulter: false
    };

    try {
      const createdBorrower = await dataService.createBorrower(newBorrower);
      setBorrowers([...borrowers, createdBorrower]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating borrower:', error);
    }
  };

  const handleViewBorrower = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setShowDetailsModal(true);
  };

  const handleToggleRisk = async (borrowerId: string) => {
    try {
      const borrower = borrowers.find(b => b.id === borrowerId);
      if (borrower) {
        const updatedBorrower = await dataService.updateBorrower(borrowerId, { isHighRisk: !borrower.isHighRisk });
        setBorrowers(borrowers.map(b => b.id === borrowerId ? updatedBorrower : b));
      }
    } catch (error) {
      console.error('Error updating borrower risk:', error);
    }
  };

  const getTitle = () => {
    switch (user?.role) {
      case 'owner':
        return 'All Borrowers';
      case 'co-owner':
        return 'Borrowers';
      case 'agent':
        return 'My Borrowers';
      default:
        return 'Borrowers';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{getTitle()}</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'agent' 
              ? 'Manage your assigned borrowers and their loans'
              : 'Monitor borrower information and loan performance'
            }
          </p>
        </div>
        {(user?.role === 'agent' || user?.role === 'owner') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateBorrower}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Borrower</span>
          </motion.button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Borrowers</h3>
          <p className="text-2xl font-bold text-gray-800">{borrowers.length}</p>
          <p className="text-sm text-gray-500">Active customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Good Standing</h3>
          <p className="text-2xl font-bold text-gray-800">
            {borrowers.filter(b => !b.isHighRisk && !b.isDefaulter).length}
          </p>
          <p className="text-sm text-green-600">Reliable borrowers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">High Risk</h3>
          <p className="text-2xl font-bold text-gray-800">
            {borrowers.filter(b => b.isHighRisk).length}
          </p>
          <p className="text-sm text-yellow-600">Needs attention</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Defaulters</h3>
          <p className="text-2xl font-bold text-gray-800">
            {borrowers.filter(b => b.isDefaulter).length}
          </p>
          <p className="text-sm text-red-600">Immediate action</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search borrowers by name, phone, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Borrowers</option>
              <option value="good">Good Standing</option>
              <option value="high-risk">High Risk</option>
              <option value="defaulter">Defaulters</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Borrowers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBorrowers.map((borrower, index) => (
          <motion.div
            key={borrower.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleViewBorrower(borrower)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {borrower.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{borrower.name}</h3>
                  <p className="text-sm text-gray-500">ID: {borrower.id}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                {borrower.isDefaulter && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Defaulter
                  </span>
                )}
                {borrower.isHighRisk && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    High Risk
                  </span>
                )}
                {!borrower.isHighRisk && !borrower.isDefaulter && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Good
                  </span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{borrower.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600 line-clamp-2">{borrower.address}</span>
              </div>
              {borrower.geolocation && (
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">GPS Available</span>
                </div>
              )}
            </div>

            {/* Loan Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Total Loans</p>
                <p className="font-semibold text-gray-800">{borrower.totalLoans}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="font-semibold text-emerald-600">{borrower.activeLoans}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Total Repaid</p>
                <p className="font-semibold text-gray-800">₹{borrower.totalRepaid.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            {user?.role === 'agent' && (
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle collect payment
                  }}
                  className="flex-1 bg-emerald-50 text-emerald-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  Collect
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRisk(borrower.id);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    borrower.isHighRisk
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  }`}
                >
                  {borrower.isHighRisk ? 'Mark Safe' : 'Mark Risk'}
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create Borrower Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Borrower</h2>
            <form className="space-y-4" onSubmit={handleCreateBorrowerSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+919876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Enter complete address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Assignment
                </label>
                <select name="lineId" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" required>
                  <option value="">Select Line</option>
                  <option value="1">Line A - Central Market</option>
                  <option value="2">Line B - Industrial Area</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-green-50 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Location</span>
                </motion.button>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Add Borrower
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Borrower Details Modal */}
      {showDetailsModal && selectedBorrower && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Borrower Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedBorrower.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedBorrower.name}</h3>
                  <p className="text-gray-600">{selectedBorrower.phone}</p>
                  <p className="text-sm text-gray-500">Member since {selectedBorrower.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex space-x-2">
                {selectedBorrower.isDefaulter && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    Defaulter
                  </span>
                )}
                {selectedBorrower.isHighRisk && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                    High Risk
                  </span>
                )}
                {!selectedBorrower.isHighRisk && !selectedBorrower.isDefaulter && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Good Standing
                  </span>
                )}
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{selectedBorrower.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">{selectedBorrower.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Loan Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Loans:</span>
                      <span className="font-medium">{selectedBorrower.totalLoans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Loans:</span>
                      <span className="font-medium text-emerald-600">{selectedBorrower.activeLoans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Repaid:</span>
                      <span className="font-medium">₹{selectedBorrower.totalRepaid.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {user?.role === 'agent' && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>New Loan</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Collect Payment</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};