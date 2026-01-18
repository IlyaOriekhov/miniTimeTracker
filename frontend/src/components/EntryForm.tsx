import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { CreateEntryPayload } from "../api/entries";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";

const PROJECTS = [
  "Viso Internal",
  "Client A",
  "Client B",
  "Personal Development",
];

type Props = {
  onSave: (payload: CreateEntryPayload) => Promise<void>;
};

export function EntryForm({ onSave }: Props) {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [project, setProject] = useState(PROJECTS[0]);
  const [hours, setHours] = useState("1");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    const h = Number(hours);
    return (
      date !== null &&
      project &&
      description.trim().length > 0 &&
      Number.isFinite(h) &&
      h > 0
    );
  }, [date, project, hours, description]);

  async function submit() {
    setError(null);

    if (!date) {
      setError("Date is required.");
      return;
    }

    const h = Number(hours);
    if (!Number.isFinite(h) || h <= 0) {
      setError("Hours must be a positive number.");
      return;
    }

    const ymd = date.format("YYYY-MM-DD"); // для бекенда

    setSaving(true);
    try {
      await onSave({
        date: ymd,
        project,
        hours: h,
        description: description.trim(),
      });
      setDescription("");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">New entry</Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
      >
        <DatePicker
          label="Date"
          value={date}
          onChange={(v) => setDate(v)}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <TextField
          select
          label="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          fullWidth
        >
          {PROJECTS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Hours"
          type="number"
          inputProps={{ min: 0, step: 0.25 }}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          fullWidth
        />

        <TextField
          label="Work description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </Box>

      <Button
        variant="contained"
        onClick={submit}
        disabled={!canSave || saving}
      >
        {saving ? "Saving..." : "Save"}
      </Button>

      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
