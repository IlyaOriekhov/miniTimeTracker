import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Chip,
  Container,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { createEntry, getSummary } from "../api/entries";
import type { CreateEntryPayload } from "../api/entries";
import type { SummaryResponse } from "../types";
import { EntryForm } from "../components/EntryForm";
import { EntryHistory } from "../components/EntryHistory";
import { Loader } from "../components/Loader";

export function HomePage() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  async function refresh() {
    setError(null);
    const data = await getSummary();
    setSummary(data);
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await refresh();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) setError(message);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave(payload: CreateEntryPayload) {
    await createEntry(payload);
    await refresh();
    setToastOpen(true);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eef2ff 0%, #f6f7fb 35%, #f6f7fb 100%)",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <Typography fontWeight={700}>Mini Time Tracker</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label="React + Express + Prisma"
            color="primary"
            variant="outlined"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(6,182,212,0.08))",
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800}>
              Track work hours
            </Typography>
            <Typography color="text.secondary">
              Save daily time entries and see totals per day + overall.
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={3}>
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}
          >
            <EntryForm onSave={onSave} />
          </Paper>

          {error && <Alert severity="error">{error}</Alert>}

          {!summary && !error && (
            <Paper variant="outlined" sx={{ borderRadius: 3 }}>
              <Loader />
            </Paper>
          )}

          {summary && (
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}
            >
              <EntryHistory summary={summary} />
            </Paper>
          )}
        </Stack>

        <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">
            Built for the Viso Academy test task.
          </Typography>
        </Box>
      </Container>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message="Saved"
      />
    </Box>
  );
}
