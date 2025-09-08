import { useState, useEffect } from "react";
import { TableBody, TableRow, TableCell, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProjectTableCell from "../Common/ProjectTableCell";
import FormatDatetime from "../../../src/utils/helper/FormatDatetime";
import { formattedDate } from "../../utils/helper/FormatDatetime";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    py: 1.5,
    fontSize: "12px",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
};

const tableData = {
    columns: [
        "Project ID",
        "Timesheet",
        "Month",
        "Total QRE Hours",
        "Hourly Rate",
        "QRE Expense",

    ],
    rows: [
        {
            id: 1,
            projectId: "",
            timesheet: "",
            month: "",
            rndHours: "",
            hourlyRate: "",
            rndExpense: "",
        },
    ],
};

const ContactsSalaryTableBody = ({ filledRows = [], currencySymbol }) => {

    return (
        <>
            <TableBody>
                {filledRows?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell sx={{ ...cellStyle, color: "#00A398" }}>
                            {row?.annualRate ? `${currencySymbol}` + new Intl.NumberFormat('en-US').format(row?.annualRate) : ""}
                        </TableCell>
                        <TableCell sx={cellStyle}>{row?.hourlyRate || ""}</TableCell>
                        <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>{formattedDate(row?.startDate).split(" ")[0]}</TableCell>
                        <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>{formattedDate(row?.endDate).split(" ")[0]}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
};

export default ContactsSalaryTableBody;
