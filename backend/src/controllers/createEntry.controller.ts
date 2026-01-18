import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

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

  if (!isValidDate(date)) {
    return res.status(400).json({ message: "Invalid date." });
  }

  if (typeof hours !== "number" || hours <= 0) {
    return res
      .status(400)
      .json({ message: "Hours must be a positive number." });
  }

  const entry = await prisma.timeEntry.create({
    data: {
      date: new Date(date),
      project,
      hours,
      description,
    },
  });

  return res.status(201).json(entry);
}
