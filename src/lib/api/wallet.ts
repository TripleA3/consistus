"use server";

import {
  addWithdrawalMethod,
  getTransactions,
  getWalletSummary,
  getWithdrawalMethods,
  hasPin,
  setPin,
  verifyPin,
  withdraw,
} from "@/lib/mock/wallet";
import type { WalletSummary, WalletTransaction, WithdrawalMethod } from "@/lib/types";

export async function fetchWalletSummary(talentId: string): Promise<WalletSummary> {
  return getWalletSummary(talentId);
}

export async function fetchTransactions(talentId: string): Promise<WalletTransaction[]> {
  return getTransactions(talentId);
}

export async function fetchWithdrawalMethods(talentId: string): Promise<WithdrawalMethod[]> {
  return getWithdrawalMethods(talentId);
}

export type AddMethodInput = {
  talentId: string;
  type: WithdrawalMethod["type"];
  label: string;
  last4: string;
  isDefault: boolean;
};

export async function createWithdrawalMethod(input: AddMethodInput): Promise<WithdrawalMethod> {
  return addWithdrawalMethod({ id: `method-${Date.now().toString(36)}`, ...input });
}

export async function checkHasPin(talentId: string): Promise<boolean> {
  return hasPin(talentId);
}

export async function createPin(talentId: string, pin: string): Promise<void> {
  setPin(talentId, pin);
}

export async function confirmPin(talentId: string, pin: string): Promise<boolean> {
  return verifyPin(talentId, pin);
}

export async function submitWithdrawal(
  talentId: string,
  amount: number,
  methodLabel: string,
): Promise<WalletTransaction> {
  return withdraw(talentId, amount, methodLabel);
}
