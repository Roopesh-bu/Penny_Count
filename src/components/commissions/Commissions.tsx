import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Building2,
  Percent
} from 'lucide-react';
import { Commission } from '../../types';
import { dataService } from '../../services/dataService';

// Mock data
const mockCommissions: Commission[] = [
  {
    id: 'C001',
    coOwnerId: '2',
    lineId: '1',
    amount: 2500,
    percentage: 10,
    calculatedOn: 25000,
    period: '2024-02',
    status: 'paid',
    paidAt: new Date('2024-03-01')
  },
  {
    id: 'C002',
    coOwnerId: '2',
    lineId: '2',
    amount: 1800,
    percentage: 12,
    calculatedOn: 15000,
    period: '2024-02',
    status: 'pending'
  },
  {
    id: 'C003',
    coOwnerId: '2',
    lineId: '1',
    amount: 2200,
    percentage: 10,
    calculatedOn: 22000,
    period: '2024-01',
    status: 'paid',
    paidAt: new Date('2024-02-01')
  },
  {
    id: 'C004',
    coOwnerId: '2',
    lineId: '2',
    amount: 1650,
    percentage: 12,
    calculatedOn: 13750,
    period: '2024-01',
    status: 'paid',
    paidAt: new Date('2024-02-01')
  }
];

const lineNames: { [key: string]: string } = {
  '1': 'Line A - Central Market',
  '2': 'Line B - Industrial Area',
  '3': 'Line C - Residential Zone'
};

export const Commissions: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const commissionsData = await dataService.getCommissions();
        setCommissions(commissionsData);
      } catch (error) {
        console.error('Error loading commissions:', error);
      }
    };
    
    loadData();
  }, []);

  const filteredCommissions = commissions.filter(commission => {
    const matchesPeriod = periodFilter === 'all' || commission.period === periodFilter;
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesPeriod && matchesStatus;
  });

  const totalEarned = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const totalPending = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
  const thisMonthEarned = commissions.filter(c => c.period === '2024-02' && c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const thisMonthPending = commissions.filter(c => c.period === '2024-02' && c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
          <h1 className="text-3xl font-bold text-gray-800">Commissions</h1>
          <p className="text-gray-600 mt-1">Track your commission earnings from managed lines</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </motion.button>
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
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Earned</h3>
          <p className="text-2xl font-bold text-gray-800">₹{totalEarned.toLocaleString()}</p>
          <p className="text-sm text-emerald-600">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
          <p className="text-2xl font-bold text-gray-800">₹{totalPending.toLocaleString()}</p>
          <p className="text-sm text-yellow-600">Awaiting payment</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">This Month</h3>
          <p className="text-2xl font-bold text-gray-800">₹{thisMonthEarned.toLocaleString()}</p>
          <p className="text-sm text-blue-600">February 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Avg. Rate</h3>
          <p className="text-2xl font-bold text-gray-800">11%</p>
          <p className="text-sm text-purple-600">Commission rate</p>
        </motion.div>
      </div>

      {/* Monthly Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">February 2024</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Earned:</span>
                <span className="font-semibold text-emerald-600">₹{thisMonthEarned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-yellow-600">₹{thisMonthPending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-800">₹{(thisMonthEarned + thisMonthPending).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Line Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(lineNames).map(([lineId, lineName]) => {
                const lineCommissions = commissions.filter(c => c.lineId === lineId && c.period === '2024-02');
                const lineTotal = lineCommissions.reduce((sum, c) => sum + c.amount, 0);
                return lineTotal > 0 ? (
                  <div key={lineId} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{lineName}:</span>
                    <span className="text-sm font-medium text-gray-800">₹{lineTotal.toLocaleString()}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Periods</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-01">January 2024</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Commissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Commission ID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Line</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Period</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Base Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Rate</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Commission</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCommissions.map((commission, index) => (
                <motion.tr
                  key={commission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-800">{commission.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">{lineNames[commission.lineId]}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-800">{formatPeriod(commission.period)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-800">₹{commission.calculatedOn.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-800">{commission.percentage}%</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-emerald-600">₹{commission.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(commission.status)}`}>
                      {getStatusIcon(commission.status)}
                      <span className="capitalize">{commission.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {commission.paidAt ? (
                      <span className="text-gray-800">{commission.paidAt.toLocaleDateString()}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};