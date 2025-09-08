import { Box, InputBase, InputLabel } from "@mui/material";
import React from "react";
import LineChart from "../Common/LineChart";

const styles = {
  label: {
    color: "#404040",
    fontSize: "13px",
    fontWeight: 500,
  },
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    // border: "1px solid #E4E4E4",
    pl: 1,
    mb: 1,
  },
};

function Highlights({ data, totalExpense, rndExpense, date, currencySymbol }) {
  return (
    <>
      <Box sx={{ borderTop: "1px solid #E4E4E4", p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            gap: 2,
            px: 1,
          }}
        >
          <Box>
            <InputLabel sx={styles.label}>Total Expenses</InputLabel>
            <InputBase
              type="text"
              sx={styles.inputBase}
              value={`${currencySymbol} ${data?.highlights?.[0]?.totalExpense?.toLocaleString() || ""}`}
              disabled
            />

          </Box>
          <Box>
            <InputLabel sx={styles.label}>QRE Expenses</InputLabel>
            <InputBase
              type="text"
              sx={styles.inputBase}
              value={`${currencySymbol} ${data?.highlights?.[0]?.rndExpenseCumulative?.toLocaleString() || ""}`}
              disabled
            />
          </Box>
        </Box>
        <Box sx={{ px: 1 }}>

          <LineChart
            symbol={currencySymbol}
            totalExpense={totalExpense}
            rndExpense={rndExpense}
            date={date}
          />
        </Box>
      </Box>
    </>
  );
}

export default Highlights;
