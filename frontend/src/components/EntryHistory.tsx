import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { SummaryResponse } from "../types";

type Props = {
  summary: SummaryResponse;
};

export function EntryHistory({ summary }: Props) {
  if (summary.days.length === 0) {
    return <Typography color="text.secondary">No entries yet.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Entry history</Typography>

      <Typography>
        <strong>Grand total:</strong> {summary.grandTotalHours}
      </Typography>

      {summary.days.map((day) => (
        <Card key={day.date} variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontWeight={600}>{day.date}</Typography>
              <Typography>Total: {day.totalHours}</Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell width={90}>Hours</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {day.entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.project}</TableCell>
                    <TableCell>{e.hours}</TableCell>
                    <TableCell>{e.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
