import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { SummaryResponse } from "../types";

type Props = {
  summary: SummaryResponse;
  onDelete: (id: number) => Promise<void>;
};

export function EntryHistory({ summary, onDelete }: Props) {
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
        <Card key={day.date} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontWeight={700}>{day.date}</Typography>
              <Typography>Total: {day.totalHours}</Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 320 }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} width={90}>
                      Hours
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell
                      sx={{ fontWeight: 700 }}
                      width={70}
                      align="right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {day.entries.map((e) => (
                    <TableRow key={e.id} hover>
                      <TableCell>{e.project}</TableCell>
                      <TableCell>{e.hours}</TableCell>
                      <TableCell>{e.description}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(e.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
