import { request } from "./client";
import type { SummaryResponse } from "../types";

export type CreateEntryPayload = {
  date: string;
  project: string;
  hours: number;
  description: string;
};

export function getSummary() {
  return request<SummaryResponse>("/entries/summary");
}

export function createEntry(payload: CreateEntryPayload) {
  return request("/entries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
