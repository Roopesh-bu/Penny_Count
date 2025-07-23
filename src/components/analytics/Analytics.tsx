import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalDisbursed: 2500000,
    totalCollected: 2100000,
    activeLoans: 89,
    completedLoans: 156,
    defaultRate: 3.2,
    collectionEfficiency: 87.5,
    avgLoanSize: 12500,
    avgTenure: 28
  },
  monthlyTrends: [
    { month: 'Oct', disbursed: 180000, collected: 165000, loans: 15 },
    { month: 'Nov', disbursed: 220000, collected: 195000, loans: 18 },
    { month: 'Dec', disbursed: 250000, collected: 230000, loans: 22 },
    { month: 'Jan', disbursed: 280000, collected: 245000, loans: 25 },
    { month: 'Feb', disbursed: 320000, collected: 285000, loans: 28 }
  ],
  linePerformance: [
    { name: 'Line A - Central Market', disbursed: 850000, collected: 780000, efficiency: 91.8, borrowers: 35 },
    { name: 'Line B - Industrial Area', disbursed: 950000, collected: 820000, efficiency: 86.3, borrowers: 42 },
    { name: 'Line C - Residential Zone', disbursed: 700000, collected: 500000, efficiency: 71.4, borrowers: 28 }
  ],
  riskAnalysis: {
    lowRisk: 78,
    mediumRisk: 15,
    highRisk: 12,
    defaulters: 8
  }
};

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('disbursed');

  const getTitle = () => {
    switch (user?.role) {
      case 'owner':
        return 'Analytics';
      case 'co-owner':
        return 'Reports';
      default:
        return 'Analytics';
    }
  };

  const getSubtitle = () => {
    switch (user?.role) {
      case 'owner':
        return 'Comprehensive business insights and performance metrics';
      case 'co-owner':
        return 'Performance reports for your managed lines';
      default:
        return 'Business analytics and insights';
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
          <p className="text-gray-600 mt-1">{getSubtitle()}</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Disbursed</h3>
          <p className="text-2xl font-bold text-gray-800">₹{mockAnalytics.overview.totalDisbursed.toLocaleString()}</p>
          <p className="text-sm text-green-600">+12% from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Collection Efficiency</h3>
          <p className="text-2xl font-bold text-gray-800">{mockAnalytics.overview.collectionEfficiency}%</p>
          <p className="text-sm text-green-600">+2.3% from last period</p>
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
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Loans</h3>
          <p className="text-2xl font-bold text-gray-800">{mockAnalytics.overview.activeLoans}</p>
          <p className="text-sm text-green-600">+8 new this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Default Rate</h3>
          <p className="text-2xl font-bold text-gray-800">{mockAnalytics.overview.defaultRate}%</p>
          <p className="text-sm text-red-600">-0.8% from last period</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Trends</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="disbursed">Disbursed</option>
                <option value="collected">Collected</option>
                <option value="loans">Loan Count</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {mockAnalytics.monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: selectedMetric === 'disbursed' 
                          ? `${(month.disbursed / 320000) * 100}%`
                          : selectedMetric === 'collected'
                          ? `${(month.collected / 285000) * 100}%`
                          : `${(month.loans / 28) * 100}%`
                      }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="bg-emerald-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                  {selectedMetric === 'disbursed' 
                    ? `₹${(month.disbursed / 1000).toFixed(0)}K`
                    : selectedMetric === 'collected'
                    ? `₹${(month.collected / 1000).toFixed(0)}K`
                    : month.loans
                  }
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Risk Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Low Risk</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{mockAnalytics.riskAnalysis.lowRisk}</span>
                <span className="text-xs text-gray-500 ml-1">borrowers</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Medium Risk</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{mockAnalytics.riskAnalysis.mediumRisk}</span>
                <span className="text-xs text-gray-500 ml-1">borrowers</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">High Risk</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{mockAnalytics.riskAnalysis.highRisk}</span>
                <span className="text-xs text-gray-500 ml-1">borrowers</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Defaulters</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{mockAnalytics.riskAnalysis.defaulters}</span>
                <span className="text-xs text-gray-500 ml-1">borrowers</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Borrowers:</span>
              <span className="font-semibold text-gray-800">
                {Object.values(mockAnalytics.riskAnalysis).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Line Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Line Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Line</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Disbursed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Collected</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Borrowers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockAnalytics.linePerformance.map((line, index) => (
                <motion.tr
                  key={line.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-800">{line.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-800">₹{line.disbursed.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-600 font-medium">₹{line.collected.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        line.efficiency >= 85 ? 'text-green-600' : 
                        line.efficiency >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {line.efficiency}%
                      </span>
                      {line.efficiency >= 85 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-800">{line.borrowers}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          line.efficiency >= 85 ? 'bg-green-500' : 
                          line.efficiency >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${line.efficiency}%` }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Avg Loan Size</h4>
            <p className="text-2xl font-bold text-blue-600">₹{mockAnalytics.overview.avgLoanSize.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Per borrower</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Avg Tenure</h4>
            <p className="text-2xl font-bold text-purple-600">{mockAnalytics.overview.avgTenure}</p>
            <p className="text-sm text-gray-500">Days</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-emerald-100 rounded-lg w-fit mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Completed Loans</h4>
            <p className="text-2xl font-bold text-emerald-600">{mockAnalytics.overview.completedLoans}</p>
            <p className="text-sm text-gray-500">Successfully closed</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-1">Growth Rate</h4>
            <p className="text-2xl font-bold text-yellow-600">+18%</p>
            <p className="text-sm text-gray-500">Month over month</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};