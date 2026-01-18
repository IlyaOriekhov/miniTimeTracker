import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function listEntriesController(_req: Request, res: Response) {
  const entries = await prisma.timeEntry.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  res.json(entries);
}
