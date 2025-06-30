import mongoose, { Schema, Document } from 'mongoose';
import { IDebt } from '../types';

const DebtSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  debtor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  creditor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  isSettled: { type: Boolean, default: false },
  settledAt: { type: Date },
}, {
  timestamps: true,
});

const Debt = mongoose.model<IDebt>('Debt', DebtSchema);

export default Debt; 