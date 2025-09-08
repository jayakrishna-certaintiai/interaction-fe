import React from "react";
import { TableBody, TableRow, TableCell, Tooltip } from "@mui/material";
import FormatDatetime, {
    formattedDateOnly,
} from "../../utils/helper/FormatDatetime";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    textAlign: "center",
    py: 1.5,
    fontSize: "12px",
};
const currencyCellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "right",
    py: 1.5,
    fontSize: "12px",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
};

function TaskTableBody({ filteredProjectTask, rowsPerPage, symbol }) {
    const rows = Array.from(
        { length: rowsPerPage || 10 },
        (_, index) => filteredProjectTask?.[index] || null
    );
    return (
        <>
            <TableBody>
                {rows?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textTransform: "capitalize",
                                textAlign: "left",
                            }}
                        >
                            {row?.taskDescription && row?.taskDescription.length > 20 ? (
                                <Tooltip title={row?.taskDescription}>
                                    <span>{row?.taskDescription.substring(0, 20)}...</span>
                                </Tooltip>
                            ) : (
                                row?.taskDescription || ""
                            )}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                            {formattedDateOnly(row?.taskDate) || ""}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                            {row?.name}
                        </TableCell>
                        <TableCell sx={cellStyle}>{row?.taskHourlyRate
                            ? parseFloat(row?.taskHourlyRate?.toLocaleString('en-US'))?.toFixed(2)
                            : ""}</TableCell>
                        <TableCell sx={cellStyle}>{row?.taskEffort?.toLocaleString('en-US') || ""}</TableCell>
                        <TableCell sx={{ ...currencyCellStyle, color: "#FD5707" }}>
                            {row?.taskTotalExpense && (String.fromCharCode(parseInt(row?.symbol, 16)))}
                            {row?.taskTotalExpense
                                ? parseFloat(row?.taskTotalExpense)?.toFixed(2)
                                : ""}
                        </TableCell>
                        <TableCell sx={{ ...currencyCellStyle, color: "#FD5707" }}>
                            {row?.RnDExpense && (String.fromCharCode(parseInt(row?.symbol, 16)))}
                            {row?.RnDExpense
                                ? parseFloat(row?.RnDExpense)?.toFixed(2)
                                : ""}
                        </TableCell>
                        {/* <TableCell sx={currencyCellStyle}>
                            {symbol}{row?.taskTotalExpense
                                ? parseFloat(row?.taskTotalExpense?.toLocaleString('en-US'))?.toFixed(2)
                                : ""}
                        </TableCell> */}
                        {/* <TableCell sx={currencyCellStyle}>
                            {symbol}{row?.RnDExpense ? parseFloat(row?.RnDExpense?.toLocaleString('en-US'))?.toFixed(2) : "0"}
                        </TableCell> */}

                    </TableRow>
                ))}
            </TableBody>
        </>
    );
}

export default TaskTableBody;
