import { Document, Types } from 'mongoose';

// Core types for the debt management system

// Renamed from User to IUser and extended Document for Mongoose compatibility
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Hashed password
  isAdmin: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

// Renamed from Debt to IDebt and extended Document
export interface IDebt extends Document {
  debtor: Types.ObjectId;
  creditor: Types.ObjectId;
  amount: number;
  description: string;
  dueDate: Date;
  isSettled: boolean;
  settledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction extends Document {
  type: 'DEBT_CREATED' | 'DEBT_SETTLED' | 'SETTLEMENT_TRIGGERED';
  debt?: Types.ObjectId;
  amount: number;
  description: string;
  user: Types.ObjectId; // User who initiated the transaction
}

export interface DebtChain {
  chain: string[]; // array of user IDs representing the chain
  totalAmount: number;
  canSettle: boolean;
  cashInjectionNeeded: number;
}

export interface SettlementResult {
  chains: DebtChain[];
  totalCashInjection: number;
  settledDebts: string[];
  transactions: ITransaction[];
}

export interface CreateDebtRequest {
  debtorId: string;
  amount: number;
  description: string;
  dueDate: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 