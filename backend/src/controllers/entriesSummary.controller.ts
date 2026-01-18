import type { Request, Response } from "express";
import { getEntriesSummary } from "../services/entriesSummary.service";

export async function entriesSummaryController(_req: Request, res: Response) {
  const summary = await getEntriesSummary();
  res.json(summary);
}
