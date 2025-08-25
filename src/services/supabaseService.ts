@@ .. @@
 import { supabase } from '../lib/supabase';
 import { Database } from '../lib/database.types';
+import { User, Line, Borrower, Loan, Payment, Commission, Fine, Notification, DashboardMetrics } from '../types';
 
 type Tables = Database['public']['Tables'];
 
@@ .. @@
   }
 
   // Dashboard metrics with role-based filtering
-  async getDashboardMetrics(userId: string, userRole: string): Promise<any> {
+  async getDashboardMetrics(userId: string, userRole: string): Promise<DashboardMetrics> {
     try {
       let linesQuery = supabase.from('lines').select('*');
       
@@ -200,7 +201,7 @@ class SupabaseService {
       const totalDisbursed = lines.reduce((sum, line) => sum + (line.total_disbursed || 0), 0);
       const totalCollected = lines.reduce((sum, line) => sum + (line.total_collected || 0), 0);
       const cashOnHand = lines.reduce((sum, line) => sum + (line.current_balance || 0), 0);
-      
+
       // Get loans for these lines
       const { data: loans } = await supabase
         .from('loans')
@@ -208,7 +209,7 @@ class SupabaseService {
         .in('line_id', lineIds);
       
       const activeLoans = loans?.filter(l => l.status === 'active').length || 0;
-      const overdueLoans = loans?.filter(l => l.status === 'overdue').length || 0;
+      const overdueLoans = loans?.filter(l => l.status === 'overdue' || l.status === 'defaulted').length || 0;
       const completedLoans = loans?.filter(l => l.status === 'completed').length || 0;
       const defaultedLoans = loans?.filter(l => l.status === 'defaulted').length || 0;
       
@@ -216,7 +217,7 @@ class SupabaseService {
         totalLines: lines.length,
         totalBorrowers: borrowers?.length || 0,
         totalDisbursed,
-        totalCollected,
+        totalCollected, 
         activeLoans,
         overdueLoans,
         collectionEfficiency: totalDisbursed > 0 ? (totalCollected / totalDisbursed) * 100 : 0,
@@ -224,7 +225,8 @@ class SupabaseService {
         cashOnHand,
         defaultRate: (loans?.length || 0) > 0 ? (defaultedLoans / (loans?.length || 1)) * 100 : 0,
         avgLoanSize: (loans?.length || 0) > 0 ? totalDisbursed / (loans?.length || 1) : 0,
-        completedLoans
+        completedLoans,
+        avgTenure: 30 // Default average tenure
       };
     } catch (error) {
       console.error('Error getting dashboard metrics:', error);
@@ -233,6 +235,7 @@ class SupabaseService {
         totalBorrowers: 0,
         totalDisbursed: 0,
         totalCollected: 0,
+        activeLoans: 0,
         overdueLoans: 0,
         collectionEfficiency: 0,
         profit: 0,
@@ -240,7 +243,8 @@ class SupabaseService {
         defaultRate: 0,
         avgLoanSize: 0,
         completedLoans: 0,
-        activeLoans: 0
+        avgTenure: 30
       };
     }
   }
+
+  // Real-time subscriptions
+  subscribeToPayments(callback: (payload: any) => void) {
+    return supabase
+      .channel('payments')
+      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
+      .subscribe();
+  }
+
+  subscribeToLoans(callback: (payload: any) => void) {
+    return supabase
+      .channel('loans')
+      .on('postgres_changes', { event: '*', schema: 'public', table: 'loans' }, callback)
+      .subscribe();
+  }
+
+  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
+    return supabase
+      .channel('notifications')
+      .on('postgres_changes', 
+          { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, 
+          callback)
+      .subscribe();
+  }
 }
 
 export const supabaseService = new SupabaseService();