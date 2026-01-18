import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export async function deleteEntryController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid id." });
  }

  try {
    await prisma.timeEntry.delete({ where: { id } });
    return res.status(204).send();
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res.status(404).json({ message: "Entry not found." });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
