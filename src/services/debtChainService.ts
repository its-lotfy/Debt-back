import Debt from '../models/debt.model';
import User from '../models/user.model';
import { IDebt, IUser } from '../types';

// Gets all debts with populated user data
export const getAllDebts = async (userId: string, status?: 'active' | 'settled') => {
  const query: any = {
    $or: [{ debtor: userId }, { creditor: userId }],
  };

  if (status) {
    query.isSettled = status === 'settled';
  }

  const debts = await Debt.find(query)
    .populate<{ debtor: IUser }>('debtor', 'name email')
    .populate<{ creditor: IUser }>('creditor', 'name email')
    .sort({ createdAt: -1 });

  return debts.map((debt: any) => ({
    id: debt._id.toString(),
    amount: debt.amount,
    description: debt.description,
    debtorId: debt.debtor._id.toString(),
    debtorName: debt.debtor.name,
    creditorId: debt.creditor._id.toString(),
    creditorName: debt.creditor.name,
    dueDate: debt.dueDate,
    isSettled: debt.isSettled,
    createdAt: debt.createdAt,
    updatedAt: debt.updatedAt,
  }));
};

// Creates a new debt
export const createDebt = async (
  creditorId: string,
  debtorId: string,
  amount: number,
  description: string,
  dueDate: Date
) => {
  const debt = await Debt.create({
    creditor: creditorId,
    debtor: debtorId,
    amount,
    description,
    dueDate,
  });
  return debt;
};


// Gets a summary of debts for the dashboard
export const getDebtSummary = async (userId: string) => {
  const debts = await Debt.find({
    $or: [{ debtor: userId }, { creditor: userId }],
    isSettled: false,
  })
  .populate<{ debtor: IUser }>('debtor', 'name')
  .populate<{ creditor: IUser }>('creditor', 'name');

  const owedToMe = debts.filter((d: any) => d.creditor._id.toString() === userId);
  const owedByMe = debts.filter((d: any) => d.debtor._id.toString() === userId);

  const totalOwedToMe = owedToMe.reduce((acc, debt) => acc + debt.amount, 0);
  const totalOwed = owedByMe.reduce((acc, debt) => acc + debt.amount, 0);
  const netPosition = totalOwedToMe - totalOwed;

  const mapDebt = (d: any) => ({
    id: d._id.toString(),
    description: d.description,
    amount: d.amount,
    dueDate: d.dueDate,
    debtorName: d.debtor.name,
    creditorName: d.creditor.name,
  });

  return {
    totalOwedToMe,
    totalOwed,
    netPosition,
    owedByOthers: owedToMe.map(mapDebt),
    owedToOthers: owedByMe.map(mapDebt),
  };
};

// Finds debt chains (simplified for now)
export const findDebtChains = async () => {
  // This is a complex graph problem. For this migration, we return an empty array.
  // A proper implementation would use graph traversal algorithms (like Tarjan's or Kosaraju's)
  // to find strongly connected components (cycles) in the debt graph.
  return [];
}; 