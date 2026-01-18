import { Box, CircularProgress } from "@mui/material";

export function Loader() {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <CircularProgress />
    </Box>
  );
}
