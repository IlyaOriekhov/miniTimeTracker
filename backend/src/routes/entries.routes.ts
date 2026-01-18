import { Router } from "express";
import { createEntryController } from "../controllers/createEntry.controller";
import { deleteEntryController } from "../controllers/deleteEntry.controller";
import { listEntriesController } from "../controllers/listEntries.controller";
import { entriesSummaryController } from "../controllers/entriesSummary.controller";

export const entriesRouter = Router();

entriesRouter.get("/", listEntriesController);
entriesRouter.get("/summary", entriesSummaryController);
entriesRouter.post("/", createEntryController);
entriesRouter.delete("/:id", deleteEntryController);
