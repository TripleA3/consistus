import type { TalentRequest } from "@/lib/types";

/**
 * In-memory request store. There's no backend, so this resets whenever the
 * server process restarts — fine for a mock, but not durable. Swap for a
 * real database behind the same functions when one exists.
 */
const requests: TalentRequest[] = [
  {
    id: "request-seed-1",
    type: "personalised-video",
    fanId: "fan-seed-1",
    talentId: "talent-2",
    message: "Happy 30th birthday shoutout for my sister, Tolu!",
    occasion: "Birthday",
    recipientName: "Tolu",
    amount: 25000,
    currency: "NGN",
    status: "submitted",
    createdAt: "2026-08-20T09:00:00.000Z",
  },
];

export function getRequests(): TalentRequest[] {
  return requests;
}

export function getRequestById(id: string): TalentRequest | undefined {
  return requests.find((r) => r.id === id);
}

export function getRequestsByTalentId(talentId: string): TalentRequest[] {
  return requests.filter((r) => r.talentId === talentId);
}

export function getRequestsByFanId(fanId: string): TalentRequest[] {
  return requests.filter((r) => r.fanId === fanId);
}

export function addRequest(request: TalentRequest): TalentRequest {
  requests.unshift(request);
  return request;
}

export function updateRequest(
  id: string,
  updates: Partial<TalentRequest>,
): TalentRequest | undefined {
  const request = requests.find((r) => r.id === id);
  if (!request) return undefined;
  Object.assign(request, updates);
  return request;
}
