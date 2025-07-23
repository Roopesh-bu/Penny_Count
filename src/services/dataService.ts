import { User, Line, Borrower, Loan, Payment, Commission, Fine, Notification } from '../types';

// Simulated database with localStorage persistence
class DataService {
  private storageKey = 'penny-count-data';

  private getStoredData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      this.convertDates(data);
      return data;
    }
    return this.getInitialData();
  }

  private convertDates(data: any) {
    // Convert date strings back to Date objects
    ['users', 'lines', 'borrowers', 'loans', 'payments', 'commissions', 'fines', 'notifications'].forEach(key => {
      if (data[key]) {
        data[key].forEach((item: any) => {
          Object.keys(item).forEach(prop => {
            if (prop.includes('At') || prop.includes('Date') || prop === 'createdAt') {
              if (item[prop]) {
                item[prop] = new Date(item[prop]);
              }
            }
          });
        });
      }
    });
  }

  private saveData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private getInitialData() {
    const now = new Date();
    const data = {
      users: [
        {
          id: '1',
          name: 'John Owner',
          phone: '+1234567890',
          role: 'owner',
          createdAt: now,
          isActive: true,
        },
        {
          id: '2',
          name: 'Sarah Co-Owner',
          phone: '+1234567891',
          role: 'co-owner',
          createdAt: now,
          isActive: true,
          assignedLines: ['1', '2']
        },
        {
          id: '3',
          name: 'Mike Agent',
          phone: '+1234567892',
          role: 'agent',
          createdAt: now,
          isActive: true,
          assignedLines: ['1', '2']
        },
      ] as User[],
      lines: [
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
          createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          interestRate: 2.5,
          defaultTenure: 30
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
          createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          interestRate: 2.0,
          defaultTenure: 45
        }
      ] as Line[],
      borrowers: [
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
          outstandingAmount: 12000,
          creditScore: 750,
          createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
          lastPaymentDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          lineId: '1',
          name: 'Priya Sharma',
          phone: '+919876543211',
          address: '456 Industrial Area, Sector 5',
          isHighRisk: false,
          isDefaulter: false,
          totalLoans: 3,
          activeLoans: 1,
          totalRepaid: 25000,
          outstandingAmount: 8000,
          creditScore: 720,
          createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          lastPaymentDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      ] as Borrower[],
      loans: [
        {
          id: 'L001',
          borrowerId: '1',
          lineId: '1',
          agentId: '3',
          amount: 10000,
          interestRate: 2.5,
          tenure: 30,
          repaymentFrequency: 'daily',
          totalAmount: 10750,
          paidAmount: 5000,
          remainingAmount: 5750,
          status: 'active',
          disbursedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
          nextPaymentDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          dailyAmount: 358
        },
        {
          id: 'L002',
          borrowerId: '2',
          lineId: '1',
          agentId: '3',
          amount: 8000,
          interestRate: 2.0,
          tenure: 20,
          repaymentFrequency: 'weekly',
          totalAmount: 8320,
          paidAmount: 8320,
          remainingAmount: 0,
          status: 'completed',
          disbursedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
          dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          nextPaymentDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          weeklyAmount: 1248
        }
      ] as Loan[],
      payments: [
        {
          id: 'P001',
          loanId: 'L001',
          borrowerId: '1',
          agentId: '3',
          amount: 500,
          method: 'cash',
          receivedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          isOffline: false
        },
        {
          id: 'P002',
          loanId: 'L001',
          borrowerId: '1',
          agentId: '3',
          amount: 358,
          method: 'upi',
          transactionId: 'UPI123456789',
          receivedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          syncedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          isOffline: false
        }
      ] as Payment[],
      commissions: [
        {
          id: 'C001',
          coOwnerId: '2',
          lineId: '1',
          amount: 2500,
          percentage: 10,
          calculatedOn: 25000,
          period: '2024-02',
          status: 'paid',
          paidAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        }
      ] as Commission[],
      fines: [] as Fine[],
      notifications: [
        {
          id: 'N001',
          userId: '3',
          type: 'payment_due',
          title: 'Payment Due Tomorrow',
          message: 'Rajesh Kumar has a payment of ₹358 due tomorrow',
          isRead: false,
          createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000)
        }
      ] as Notification[]
    };
    this.saveData(data);
    return data;
  }

  // Users
  async getUsers(): Promise<User[]> {
    const data = this.getStoredData();
    return data.users;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const data = this.getStoredData();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    data.users.push(newUser);
    this.saveData(data);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const data = this.getStoredData();
    const index = data.users.findIndex((u: User) => u.id === id);
    if (index === -1) throw new Error('User not found');
    data.users[index] = { ...data.users[index], ...updates };
    this.saveData(data);
    return data.users[index];
  }

  async deleteUser(id: string): Promise<void> {
    const data = this.getStoredData();
    data.users = data.users.filter((u: User) => u.id !== id);
    this.saveData(data);
  }

  // Lines
  async getLines(): Promise<Line[]> {
    const data = this.getStoredData();
    return data.lines;
  }

  async createLine(line: Omit<Line, 'id' | 'createdAt' | 'borrowerCount' | 'totalDisbursed' | 'totalCollected'>): Promise<Line> {
    const data = this.getStoredData();
    const newLine: Line = {
      ...line,
      id: Date.now().toString(),
      createdAt: new Date(),
      borrowerCount: 0,
      totalDisbursed: 0,
      totalCollected: 0
    };
    data.lines.push(newLine);
    this.saveData(data);
    return newLine;
  }

  async updateLine(id: string, updates: Partial<Line>): Promise<Line> {
    const data = this.getStoredData();
    const index = data.lines.findIndex((l: Line) => l.id === id);
    if (index === -1) throw new Error('Line not found');
    data.lines[index] = { ...data.lines[index], ...updates };
    this.saveData(data);
    return data.lines[index];
  }

  async deleteLine(id: string): Promise<void> {
    const data = this.getStoredData();
    data.lines = data.lines.filter((l: Line) => l.id !== id);
    this.saveData(data);
  }

  // Borrowers
  async getBorrowers(): Promise<Borrower[]> {
    const data = this.getStoredData();
    return data.borrowers;
  }

  async createBorrower(borrower: Omit<Borrower, 'id' | 'createdAt' | 'totalLoans' | 'activeLoans' | 'totalRepaid' | 'outstandingAmount' | 'creditScore'>): Promise<Borrower> {
    const data = this.getStoredData();
    const newBorrower: Borrower = {
      ...borrower,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalLoans: 0,
      activeLoans: 0,
      totalRepaid: 0,
      outstandingAmount: 0,
      creditScore: 700
    };
    data.borrowers.push(newBorrower);
    
    // Update line borrower count
    const lineIndex = data.lines.findIndex((l: Line) => l.id === borrower.lineId);
    if (lineIndex !== -1) {
      data.lines[lineIndex].borrowerCount += 1;
    }
    
    this.saveData(data);
    return newBorrower;
  }

  async updateBorrower(id: string, updates: Partial<Borrower>): Promise<Borrower> {
    const data = this.getStoredData();
    const index = data.borrowers.findIndex((b: Borrower) => b.id === id);
    if (index === -1) throw new Error('Borrower not found');
    data.borrowers[index] = { ...data.borrowers[index], ...updates };
    this.saveData(data);
    return data.borrowers[index];
  }

  // Loans
  async getLoans(): Promise<Loan[]> {
    const data = this.getStoredData();
    return data.loans;
  }

  async createLoan(loan: Omit<Loan, 'id' | 'disbursedAt' | 'paidAmount' | 'remainingAmount' | 'status' | 'nextPaymentDate'>): Promise<Loan> {
    const data = this.getStoredData();
    const now = new Date();
    
    // Calculate payment amounts based on frequency
    let dailyAmount, weeklyAmount, monthlyAmount;
    const totalAmount = loan.totalAmount;
    
    if (loan.repaymentFrequency === 'daily') {
      dailyAmount = Math.round(totalAmount / loan.tenure);
    } else if (loan.repaymentFrequency === 'weekly') {
      const weeks = Math.ceil(loan.tenure / 7);
      weeklyAmount = Math.round(totalAmount / weeks);
    } else if (loan.repaymentFrequency === 'monthly') {
      const months = Math.ceil(loan.tenure / 30);
      monthlyAmount = Math.round(totalAmount / months);
    }

    const newLoan: Loan = {
      ...loan,
      id: `L${Date.now()}`,
      disbursedAt: now,
      paidAmount: 0,
      remainingAmount: loan.totalAmount,
      status: 'active',
      nextPaymentDate: new Date(now.getTime() + (loan.repaymentFrequency === 'daily' ? 1 : loan.repaymentFrequency === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000),
      dailyAmount,
      weeklyAmount,
      monthlyAmount
    };
    
    data.loans.push(newLoan);
    
    // Update borrower stats
    const borrowerIndex = data.borrowers.findIndex((b: Borrower) => b.id === loan.borrowerId);
    if (borrowerIndex !== -1) {
      data.borrowers[borrowerIndex].totalLoans += 1;
      data.borrowers[borrowerIndex].activeLoans += 1;
      data.borrowers[borrowerIndex].outstandingAmount += loan.totalAmount;
    }
    
    // Update line stats
    const lineIndex = data.lines.findIndex((l: Line) => l.id === loan.lineId);
    if (lineIndex !== -1) {
      data.lines[lineIndex].totalDisbursed += loan.amount;
      data.lines[lineIndex].currentBalance -= loan.amount;
    }
    
    this.saveData(data);
    return newLoan;
  }

  async updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
    const data = this.getStoredData();
    const index = data.loans.findIndex((l: Loan) => l.id === id);
    if (index === -1) throw new Error('Loan not found');
    data.loans[index] = { ...data.loans[index], ...updates };
    this.saveData(data);
    return data.loans[index];
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    const data = this.getStoredData();
    return data.payments;
  }

  async createPayment(payment: Omit<Payment, 'id' | 'receivedAt' | 'syncedAt'>): Promise<Payment> {
    const data = this.getStoredData();
    const now = new Date();
    
    const newPayment: Payment = {
      ...payment,
      id: `P${Date.now()}`,
      receivedAt: now,
      syncedAt: payment.isOffline ? undefined : now
    };
    
    data.payments.push(newPayment);
    
    // Update loan payment
    const loanIndex = data.loans.findIndex((l: Loan) => l.id === payment.loanId);
    if (loanIndex !== -1) {
      data.loans[loanIndex].paidAmount += payment.amount;
      data.loans[loanIndex].remainingAmount -= payment.amount;
      
      if (data.loans[loanIndex].remainingAmount <= 0) {
        data.loans[loanIndex].status = 'completed';
        data.loans[loanIndex].completedAt = now;
        
        // Update borrower active loans
        const borrowerIndex = data.borrowers.findIndex((b: Borrower) => b.id === payment.borrowerId);
        if (borrowerIndex !== -1) {
          data.borrowers[borrowerIndex].activeLoans -= 1;
        }
      }
    }
    
    // Update borrower stats
    const borrowerIndex = data.borrowers.findIndex((b: Borrower) => b.id === payment.borrowerId);
    if (borrowerIndex !== -1) {
      data.borrowers[borrowerIndex].totalRepaid += payment.amount;
      data.borrowers[borrowerIndex].outstandingAmount -= payment.amount;
      data.borrowers[borrowerIndex].lastPaymentDate = now;
    }
    
    // Update line stats
    const loan = data.loans.find((l: Loan) => l.id === payment.loanId);
    if (loan) {
      const lineIndex = data.lines.findIndex((l: Line) => l.id === loan.lineId);
      if (lineIndex !== -1) {
        data.lines[lineIndex].totalCollected += payment.amount;
        data.lines[lineIndex].currentBalance += payment.amount;
      }
    }
    
    this.saveData(data);
    return newPayment;
  }

  // Commissions
  async getCommissions(): Promise<Commission[]> {
    const data = this.getStoredData();
    return data.commissions;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const data = this.getStoredData();
    return data.notifications.filter((n: Notification) => n.userId === userId);
  }

  async markNotificationRead(id: string): Promise<void> {
    const data = this.getStoredData();
    const index = data.notifications.findIndex((n: Notification) => n.id === id);
    if (index !== -1) {
      data.notifications[index].isRead = true;
      this.saveData(data);
    }
  }

  // Dashboard metrics
  async getDashboardMetrics(userId: string, userRole: string): Promise<any> {
    const data = this.getStoredData();
    
    let filteredLines = data.lines;
    let filteredBorrowers = data.borrowers;
    let filteredLoans = data.loans;
    
    // Filter based on user role
    if (userRole === 'co-owner') {
      filteredLines = data.lines.filter((l: Line) => l.coOwnerId === userId);
      const lineIds = filteredLines.map((l: Line) => l.id);
      filteredBorrowers = data.borrowers.filter((b: Borrower) => lineIds.includes(b.lineId));
      filteredLoans = data.loans.filter((l: Loan) => lineIds.includes(l.lineId));
    } else if (userRole === 'agent') {
      filteredLines = data.lines.filter((l: Line) => l.agentId === userId);
      const lineIds = filteredLines.map((l: Line) => l.id);
      filteredBorrowers = data.borrowers.filter((b: Borrower) => lineIds.includes(b.lineId));
      filteredLoans = data.loans.filter((l: Loan) => lineIds.includes(l.lineId));
    }
    
    const totalDisbursed = filteredLines.reduce((sum: number, line: Line) => sum + line.totalDisbursed, 0);
    const totalCollected = filteredLines.reduce((sum: number, line: Line) => sum + line.totalCollected, 0);
    const activeLoans = filteredLoans.filter((l: Loan) => l.status === 'active').length;
    const overdueLoans = filteredLoans.filter((l: Loan) => l.status === 'overdue').length;
    const defaultedLoans = filteredLoans.filter((l: Loan) => l.status === 'defaulted').length;
    
    return {
      totalLines: filteredLines.length,
      totalBorrowers: filteredBorrowers.length,
      totalDisbursed,
      totalCollected,
      activeLoans,
      overdueLoans,
      collectionEfficiency: totalDisbursed > 0 ? (totalCollected / totalDisbursed) * 100 : 0,
      profit: totalCollected - totalDisbursed,
      cashOnHand: filteredLines.reduce((sum: number, line: Line) => sum + line.currentBalance, 0),
      defaultRate: filteredLoans.length > 0 ? (defaultedLoans / filteredLoans.length) * 100 : 0,
      avgLoanSize: filteredLoans.length > 0 ? totalDisbursed / filteredLoans.length : 0
    };
  }
}

export const dataService = new DataService();