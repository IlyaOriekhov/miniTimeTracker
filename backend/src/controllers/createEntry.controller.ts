import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { dayRangeFromYMD } from "../utils/dateRange";

export async function createEntryController(req: Request, res: Response) {
  const { date, project, hours, description } = req.body as {
    date?: string;
    project?: string;
    hours?: number;
    description?: string;
  };

  if (!date || !project || hours == null || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (typeof hours !== "number" || hours <= 0) {
    return res
      .status(400)
      .json({ message: "Hours must be a positive number." });
  }

  const { start, end } = dayRangeFromYMD(date);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const agg = await tx.timeEntry.aggregate({
        where: { date: { gte: start, lt: end } },
        _sum: { hours: true },
      });

      const existing = agg._sum.hours ?? 0;
      if (existing + hours > 24) {
        throw new Error(
          `Daily limit exceeded. Existing: ${existing}, requested: ${hours}, max: 24.`,
        );
      }

      return tx.timeEntry.create({
        data: {
          date: start,
          project,
          hours,
          description,
        },
      });
    });

    return res.status(201).json(created);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.startsWith("Daily limit exceeded")) {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
