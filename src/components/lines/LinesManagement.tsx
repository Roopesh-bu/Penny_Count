import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Building2,
  UserCheck,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { Line, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';

// Mock data
const mockLines: Line[] = [
  {
    id: '1',
    name: 'Line A - Central Market',
    ownerId: '1',
    coOwnerId: '2',
    agentId: '3',
    initialCapital: 100000,
    currentBalance: 75000,
    totalDisbursed: 250000,
    totalCollected: 225000,
    borrowerCount: 25,
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Line B - Industrial Area',
    ownerId: '1',
    agentId: '3',
    initialCapital: 150000,
    currentBalance: 120000,
    totalDisbursed: 300000,
    totalCollected: 280000,
    borrowerCount: 35,
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Line C - Residential Zone',
    ownerId: '1',
    coOwnerId: '2',
    initialCapital: 80000,
    currentBalance: 45000,
    totalDisbursed: 180000,
    totalCollected: 165000,
    borrowerCount: 18,
    isActive: false,
    createdAt: new Date('2024-01-20')
  }
];

const mockUsers: User[] = [
  { id: '1', name: 'John Owner', phone: '+1234567890', role: 'owner', createdAt: new Date(), isActive: true },
  { id: '2', name: 'Sarah Co-Owner', phone: '+1234567891', role: 'co-owner', createdAt: new Date(), isActive: true },
  { id: '3', name: 'Mike Agent', phone: '+1234567892', role: 'agent', createdAt: new Date(), isActive: true },
  { id: '4', name: 'Lisa Agent', phone: '+1234567893', role: 'agent', createdAt: new Date(), isActive: true }
];

export const LinesManagement: React.FC = () => {
  const { user } = useAuth();
  const [lines, setLines] = useState<Line[]>(mockLines);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [linesData, usersData] = await Promise.all([
          dataService.getLines(),
          dataService.getUsers()
        ]);
        setLines(linesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const filteredLines = user?.role === 'co-owner' 
    ? lines.filter(line => line.coOwnerId === user.id)
    : lines;

  const getCoOwnerName = (coOwnerId?: string) => {
    const coOwner = users.find(u => u.id === coOwnerId);
    return coOwner?.name || 'Not assigned';
  };

  const getAgentName = (agentId?: string) => {
    const agent = users.find(u => u.id === agentId);
    return agent?.name || 'Not assigned';
  };

  const handleCreateLine = () => {
    setShowCreateModal(true);
  };

  const handleCreateLineSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newLine = {
      name: formData.get('name') as string,
      ownerId: user!.id,
      coOwnerId: formData.get('coOwnerId') as string || undefined,
      agentId: formData.get('agentId') as string || undefined,
      initialCapital: parseInt(formData.get('initialCapital') as string),
      currentBalance: parseInt(formData.get('initialCapital') as string),
      isActive: true,
      interestRate: 2.5,
      defaultTenure: 30
    };

    try {
      const createdLine = await dataService.createLine(newLine);
      setLines([...lines, createdLine]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating line:', error);
    }
  };

  const handleEditLine = (line: Line) => {
    setSelectedLine(line);
    setShowEditModal(true);
  };

  const handleDeleteLine = async (lineId: string) => {
    if (confirm('Are you sure you want to delete this line? This action cannot be undone.')) {
      try {
        await dataService.deleteLine(lineId);
        setLines(lines.filter(line => line.id !== lineId));
      } catch (error) {
        console.error('Error deleting line:', error);
      }
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
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.role === 'owner' ? 'Lines Management' : 'My Lines'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'owner' 
              ? 'Manage all lending lines and assignments' 
              : 'Monitor your assigned lending lines'
            }
          </p>
        </div>
        {user?.role === 'owner' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateLine}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Line</span>
          </motion.button>
        )}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Lines</h3>
          <p className="text-2xl font-bold text-gray-800">{filteredLines.length}</p>
          <p className="text-sm text-green-600">
            {filteredLines.filter(l => l.isActive).length} active
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Capital</h3>
          <p className="text-2xl font-bold text-gray-800">
            ₹{filteredLines.reduce((sum, line) => sum + line.initialCapital, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Initial investment</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Borrowers</h3>
          <p className="text-2xl font-bold text-gray-800">
            {filteredLines.reduce((sum, line) => sum + line.borrowerCount, 0)}
          </p>
          <p className="text-sm text-gray-500">Across all lines</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Collection Rate</h3>
          <p className="text-2xl font-bold text-gray-800">87.5%</p>
          <p className="text-sm text-emerald-600">Above target</p>
        </motion.div>
      </div>

      {/* Lines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLines.map((line, index) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{line.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    line.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {line.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Created {line.createdAt.toLocaleDateString()}
                </p>
              </div>
              {user?.role === 'owner' && (
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Balance</span>
                <span className="font-semibold text-gray-800">
                  ₹{line.currentBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Disbursed</span>
                <span className="font-semibold text-gray-800">
                  ₹{line.totalDisbursed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Collected</span>
                <span className="font-semibold text-emerald-600">
                  ₹{line.totalCollected.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Borrowers</span>
                <span className="font-semibold text-gray-800">{line.borrowerCount}</span>
              </div>
            </div>

            {/* Assignments */}
            <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
              {line.coOwnerId && (
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Co-Owner:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {getCoOwnerName(line.coOwnerId)}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Agent:</span>
                <span className="text-sm font-medium text-gray-800">
                  {getAgentName(line.agentId)}
                </span>
              </div>
            </div>

            {/* Actions */}
            {user?.role === 'owner' && (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEditLine(line)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteLine(line.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create Line Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Line</h2>
            <form className="space-y-4" onSubmit={handleCreateLineSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Line D - Market Area"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Capital
                </label>
                <input
                  type="number"
                  name="initialCapital"
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Co-Owner (Optional)
                </label>
                <select name="coOwnerId" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option value="">Select Co-Owner</option>
                  {users.filter(u => u.role === 'co-owner').map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Agent
                </label>
                <select name="agentId" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option value="">Select Agent</option>
                  {users.filter(u => u.role === 'agent').map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
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
                  Create Line
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};