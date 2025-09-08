import { Box, InputBase, InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
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
    // pl: 1,
    mb: 1,
    textAlign: "right",
    alignItems: "right",
  },
};

function Financial({
  currency,
  totalExpense,
  totalBudget,
  rndExpense,
  date,
  symbol,
  info,
  fetchData
}) {
  const [formattedDays, setFormattedDays] = useState([]);
  const totalExpenseSum = totalExpense?.reduce((acc, expense) => acc + expense, 0) || "0";
  const rndExpenseSum = rndExpense?.reduce((acc, expense) => acc + expense, 0) || "0";

  const changeDatesFormat = (dates) => {
    const hash = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec"
    }
    const changedDates = Array.isArray(dates)
      ? dates.map(d => {
        const day = d.slice(-2);
        const year = d.slice(2, 4);
        return `${hash[day]}-${year}`;
      })
      : []; // Fallback to an empty array if dates is not an array

    setFormattedDays(changedDates);
  }

  useEffect(() => {
    changeDatesFormat(date);
  }, [date])

  return (
    <>

      <Box sx={{ borderTop: "1px solid #E4E4E4", p: 1 }}>
        {/* <UpdationDetails
          isAuth={useHasAccessToFeature("F014", "P000000001")}
          latestUpdateTime={latestUpdateTime}
          modifiedBy={modifiedBy}
        /> */}
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
              // value={`${symbol} ${info?.totalCosts?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ""}`}
              value={
                info?.totalCosts !== undefined
                  ? `${symbol} ${(+info.totalCosts).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
                  : `${symbol} 0.00`
              }
              disabled
            />
          </Box>
          <Box>
            <InputLabel sx={styles.label}>QRE Expenses</InputLabel>
            <InputBase
              type="text"
              sx={styles.inputBase}
              value={
                info?.totalRnDCosts !== undefined
                  ? `${symbol} ${(+info.totalRnDCosts).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`
                  : `${symbol} 0.00`
              }
              disabled
            />
          </Box>
        </Box>
        <Box sx={{ px: 1 }}>
          <LineChart
            symbol={symbol}
            currency={currency}
            totalBudget={totalBudget}
            totalExpense={totalExpense}
            rndExpense={rndExpense}
            date={formattedDays}
          />
        </Box>
      </Box>
    </>
  );
}

export default Financial;
