import express from "express";
import cors from "cors";
import { entriesRouter } from "./routes/entries.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/entries", entriesRouter);
