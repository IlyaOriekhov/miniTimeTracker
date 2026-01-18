import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function deleteEntryController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid id." });
  }

  await prisma.timeEntry.delete({ where: { id } });

  return res.status(204).send();
}
