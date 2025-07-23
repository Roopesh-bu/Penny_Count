import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardCards } from './DashboardCards';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { DashboardMetrics } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const handleQuickAction = (action: string) => {
    console.log('Quick action triggered:', action);
    // TODO: Implement specific action handlers
  };

  useEffect(() => {
    const loadMetrics = async () => {
      if (user) {
        try {
          const dashboardMetrics = await dataService.getDashboardMetrics(user.id, user.role);
          setMetrics(dashboardMetrics);
        } catch (error) {
          console.error('Error loading dashboard metrics:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMetrics();
  }, [user]);

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'owner':
        return 'Business Overview';
      case 'co-owner':
        return 'Line Management Dashboard';
      case 'agent':
        return 'Collection Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardSubtitle = () => {
    switch (user?.role) {
      case 'owner':
        return 'Monitor your entire lending operation';
      case 'co-owner':
        return 'Manage your lines and track performance';
      case 'agent':
        return 'Track your collections and borrowers';
      default:
        return 'Welcome back';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{getDashboardTitle()}</h1>
        <p className="text-gray-600">{getDashboardSubtitle()}</p>
      </motion.div>

      {/* Metrics Cards */}
      {metrics && <DashboardCards metrics={metrics} />}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {user?.role === 'agent' ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center hover:bg-emerald-100 transition-colors"
                >
                  <div className="text-emerald-600 font-medium">Add Payment</div>
                  <div className="text-sm text-emerald-500 mt-1">Record collection</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  <div className="text-blue-600 font-medium">New Loan</div>
                  <div className="text-sm text-blue-500 mt-1">Disburse loan</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  <div className="text-purple-600 font-medium">Add Borrower</div>
                  <div className="text-sm text-purple-500 mt-1">New customer</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center hover:bg-orange-100 transition-colors"
                >
                  <div className="text-orange-600 font-medium">Sync Data</div>
                  <div className="text-sm text-orange-500 mt-1">Upload offline data</div>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center hover:bg-emerald-100 transition-colors"
                >
                  <div className="text-emerald-600 font-medium">Create Line</div>
                  <div className="text-sm text-emerald-500 mt-1">New lending line</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
                  <div className="text-blue-600 font-medium">Add Agent</div>
                  <div className="text-sm text-blue-500 mt-1">Assign new agent</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center hover:bg-purple-100 transition-colors"
                >
                  <div className="text-purple-600 font-medium">View Reports</div>
                  <div className="text-sm text-purple-500 mt-1">Generate insights</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center hover:bg-gray-100 transition-colors"
                >
                  <div className="text-gray-600 font-medium">Settings</div>
                  <div className="text-sm text-gray-500 mt-1">Configure system</div>
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <QuickActions onAction={handleQuickAction} />
        </motion.div>
      </div>
    </div>
  );
};