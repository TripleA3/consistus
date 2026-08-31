import {
  addRequest,
  getRequestById,
  getRequests,
  getRequestsByFanId,
  getRequestsByTalentId,
  updateRequest,
} from "@/lib/mock/requests";
import { transitionRequest, type RequestEvent } from "@/lib/requests/requestStateMachine";
import type { RequestType, TalentRequest } from "@/lib/types";

export type CreateRequestInput = {
  type: RequestType;
  fanId: string;
  talentId: string;
  message: string;
  amount: number;
  currency: string;
  occasion?: string;
  recipientName?: string;
  dueBy?: string;
};

export async function fetchAllRequests(): Promise<TalentRequest[]> {
  return getRequests();
}

export async function fetchRequestById(id: string): Promise<TalentRequest | undefined> {
  return getRequestById(id);
}

export async function fetchRequestsByTalentId(talentId: string): Promise<TalentRequest[]> {
  return getRequestsByTalentId(talentId);
}

export async function fetchRequestsByFanId(fanId: string): Promise<TalentRequest[]> {
  return getRequestsByFanId(fanId);
}

export async function submitRequest(input: CreateRequestInput): Promise<TalentRequest> {
  const request: TalentRequest = {
    id: `request-${Date.now().toString(36)}`,
    type: input.type,
    fanId: input.fanId,
    talentId: input.talentId,
    message: input.message,
    occasion: input.occasion,
    recipientName: input.recipientName,
    amount: input.amount,
    currency: input.currency,
    status: transitionRequest("draft", { type: "SUBMIT" }),
    createdAt: new Date().toISOString(),
    dueBy: input.dueBy,
  };
  return addRequest(request);
}

export async function applyRequestEvent(
  id: string,
  event: RequestEvent,
  extra?: Partial<Pick<TalentRequest, "termsAcceptedAt" | "deliveryUrl">>,
): Promise<TalentRequest | undefined> {
  const request = getRequestById(id);
  if (!request) return undefined;
  const status = transitionRequest(request.status, event);
  return updateRequest(id, { status, ...extra });
}
