import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import ProjectTableCell from "../../Common/ProjectTableCell";
import DataProjectTableCell from "../../Common/DataProjectTableCell";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    fontSize: "13px",
    py: 1,
};

const currencyCellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "right",
    fontSize: "13px",
    py: 1,
    color: "#FD5707",
}

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
};

const TimesheetProjectTableBody = ({ data }) => {

    function formatCurrency(amount, locale, currency) {
        // Create a new Intl.NumberFormat instance
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        });

        // Format the amount
        let formattedAmount = formatter.format(amount);

        // Remove only alphabetic characters from the formatted string
        formattedAmount = formattedAmount.replace(/[a-zA-Z]/g, '').trim();

        return formattedAmount;
    }


    return (
        <>
            <TableBody>
                {data?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>

                        <DataProjectTableCell id={row?.projectId} name={row?.projectCode} />
                        <DataProjectTableCell id={row?.projectId} name={row?.projectName} />
                        <TableCell sx={{ ...cellStyle, color: "#FD5707", textAlign: "left" }}>
                            {row?.spocName || ""}
                        </TableCell>
                        <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left" }}>
                            {row?.spocEmail || ""}
                        </TableCell>
                        <TableCell sx={currencyCellStyle}>

                            {row?.TotalExpense ? formatCurrency(row?.TotalExpense, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        <TableCell sx={currencyCellStyle}>
                            {row?.rndExpense !== null & row?.rndExpense !== undefined ? formatCurrency(row?.rndExpense, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        <TableCell sx={currencyCellStyle}>
                            {row?.rndPotential !== null & row?.rndPotential !== undefined
                                ? parseFloat(row?.rndPotential).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : ""}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
}

export default TimesheetProjectTableBody;
