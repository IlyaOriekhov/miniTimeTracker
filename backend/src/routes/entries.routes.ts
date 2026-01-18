import { Router } from "express";
import { createEntryController } from "../controllers/createEntry.controller";
import { listEntriesController } from "../controllers/listEntries.controller";

export const entriesRouter = Router();

entriesRouter.get("/", listEntriesController);
entriesRouter.post("/", createEntryController);
