import { Box, InputBase, InputLabel } from "@mui/material";
import React, { useState, useEffect } from "react";
import ClientLineChart from "../Common/ClientLineChart";

const styles = {
    label: {
        color: "#404040",
        fontSize: "13px",
        fontWeight: 500,
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        mb: 1,
        textAlign: "right",
        alignItems: "right",
    },
};

function formatCurrency(amount, locale, currency) {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    let formattedAmount = formatter.format(amount);
    formattedAmount = formattedAmount.replace(/[a-zA-Z]/g, '').trim();
    return formattedAmount;
}

function Graph({ totalExpense, rndExpenseCumulative, date, symbol, cumulativeTotalExpenseDisplay, cumulativeRndDisplay }) {
    const [formattedDays, setFormattedDays] = useState([]);
    const [totalExpensesSum, setTotalExpensesSum] = useState("0");
    const [rndExpenseSum, setRndExpenseSum] = useState("0");

    useEffect(() => {
        if (symbol) {
            const formattedTotal = formatCurrency(cumulativeTotalExpenseDisplay, "en-US", symbol);
            const formattedRnd = formatCurrency(cumulativeRndDisplay, "en-US", symbol);

            setTotalExpensesSum(formattedTotal);
            setRndExpenseSum(formattedRnd);
        }
    }, [cumulativeTotalExpenseDisplay, cumulativeRndDisplay, symbol]);

    const changeDatesFormat = (dates) => {
        const monthMap = {
            "1": "Jan",
            "2": "Feb",
            "3": "Mar",
            "4": "Apr",
            "5": "May",
            "6": "Jun",
            "7": "Jul",
            "8": "Aug",
            "9": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dec",
        };
        const changedDates = dates?.map(d => `${monthMap[d.month]}-${d.year}`);
        setFormattedDays(changedDates);
    };

    useEffect(() => {
        changeDatesFormat(date);
    }, [date]);

    return (
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
                        value={totalExpensesSum || ""}
                        disabled
                    />
                </Box>
                <Box>
                    <InputLabel sx={styles.label}>QRE Expenses</InputLabel>
                    <InputBase
                        type="text"
                        sx={styles.inputBase}
                        value={rndExpenseSum || ""}
                        disabled
                    />
                </Box>
            </Box>
            <Box sx={{ px: 1 }}>
                <ClientLineChart
                    symbol={symbol}
                    totalExpense={totalExpense}
                    rndExpenseCumulative={rndExpenseCumulative}
                    date={formattedDays}
                />
            </Box>
        </Box>
    );
}

export default Graph;
