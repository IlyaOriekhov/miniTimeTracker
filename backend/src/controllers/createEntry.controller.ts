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

  const agg = await prisma.timeEntry.aggregate({
    where: {
      date: { gte: start, lt: end },
    },
    _sum: { hours: true },
  });

  const existing = agg._sum.hours ?? 0;

  if (existing + hours > 24) {
    return res.status(400).json({
      message: `Daily limit exceeded. Existing: ${existing}, requested: ${hours}, max: 24.`,
    });
  }

  const entry = await prisma.timeEntry.create({
    data: {
      date: start,
      project,
      hours,
      description,
    },
  });

  return res.status(201).json(entry);
}
