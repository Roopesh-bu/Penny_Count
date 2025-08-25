import { User, Line, Borrower, Loan, Payment, Commission, Fine, Notification, DashboardMetrics } from '../types';
import { supabaseService } from './supabaseService';

// Data service that uses Supabase as primary source with localStorage fallback
class DataService {
  private useSupabase = true; // Toggle between Supabase and localStorage

  // Check if Supabase is available
  private async isSupabaseAvailable(): Promise<boolean> {
    try {
      const { data } = await supabaseService.getUsers();
      return true;
    } catch (error) {
      console.warn('Supabase not available, falling back to localStorage');
      return false;
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getUsers();
    }
    // Fallback to localStorage or return empty array
    return [];
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.createUser(user);
    }
    throw new Error('Database not available');
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.updateUser(id, updates);
    }
    throw new Error('Database not available');
  }

  async deleteUser(id: string): Promise<void> {
    if (await this.isSupabaseAvailable()) {
      await supabaseService.deleteUser(id);
    } else {
      throw new Error('Database not available');
    }
  }

  // Lines
  async getLines(): Promise<Line[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getLines();
    }
    return [];
  }

  async createLine(line: Omit<Line, 'id' | 'createdAt' | 'borrowerCount' | 'totalDisbursed' | 'totalCollected'>): Promise<Line> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.createLine(line);
    }
    throw new Error('Database not available');
  }

  async updateLine(id: string, updates: Partial<Line>): Promise<Line> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.updateLine(id, updates);
    }
    throw new Error('Database not available');
  }

  async deleteLine(id: string): Promise<void> {
    if (await this.isSupabaseAvailable()) {
      await supabaseService.deleteLine(id);
    } else {
      throw new Error('Database not available');
    }
  }

  // Borrowers
  async getBorrowers(): Promise<Borrower[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getBorrowers();
    }
    return [];
  }

  async createBorrower(borrower: Omit<Borrower, 'id' | 'createdAt' | 'totalLoans' | 'activeLoans' | 'totalRepaid' | 'outstandingAmount' | 'creditScore'>): Promise<Borrower> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.createBorrower(borrower);
    }
    throw new Error('Database not available');
  }

  async updateBorrower(id: string, updates: Partial<Borrower>): Promise<Borrower> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.updateBorrower(id, updates);
    }
    throw new Error('Database not available');
  }

  // Loans
  async getLoans(): Promise<Loan[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getLoans();
    }
    return [];
  }

  async createLoan(loan: Omit<Loan, 'id' | 'disbursedAt' | 'paidAmount' | 'remainingAmount' | 'status' | 'nextPaymentDate'>): Promise<Loan> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.createLoan(loan);
    }
    throw new Error('Database not available');
  }

  async updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.updateLoan(id, updates);
    }
    throw new Error('Database not available');
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getPayments();
    }
    return [];
  }

  async createPayment(payment: Omit<Payment, 'id' | 'receivedAt' | 'syncedAt'>): Promise<Payment> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.createPayment(payment);
    }
    throw new Error('Database not available');
  }

  // Commissions
  async getCommissions(): Promise<Commission[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getCommissions();
    }
    return [];
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getNotifications(userId);
    }
    return [];
  }

  async markNotificationRead(id: string): Promise<void> {
    if (await this.isSupabaseAvailable()) {
      await supabaseService.markNotificationRead(id);
    } else {
      throw new Error('Database not available');
    }
  }

  // Dashboard metrics
  async getDashboardMetrics(userId: string, userRole: string): Promise<DashboardMetrics> {
    if (await this.isSupabaseAvailable()) {
      return await supabaseService.getDashboardMetrics(userId, userRole);
    }
    // Return default metrics if database not available
    return {
      totalLines: 0,
      totalBorrowers: 0,
      totalDisbursed: 0,
      totalCollected: 0,
      activeLoans: 0,
      overdueLoans: 0,
      collectionEfficiency: 0,
      profit: 0,
      cashOnHand: 0,
      defaultRate: 0,
      avgLoanSize: 0,
      avgTenure: 30
    };
  }
}

export const dataService = new DataService();