import React, { useRef, useState } from "react";
import { TableBody, TableRow, TableCell, Box } from "@mui/material";
import { formatCurrency } from "../../utils/helper/FormatCurrency";
import TechSummaryIcon from "../Cases/ProjectsTab/TechSummaryModal/TechSummaryIcon";
import TechSummaryModal from "../Cases/ProjectsTab/TechSummaryModal/TechSummaryModal";
import ContentIcon from "./ContentIcon";
import ContentModal from "./ContentModal";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    textAlign: "center",
    py: 0.5,
    fontSize: "12px",
    color: "#404040",
    height: "30px",
};
const currencyCellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "right",
    py: 1.5,
    fontSize: "12px",
};
const styles = {
    flexBoxItem: {
        display: "flex",
        justifyContent: "space-between",
        px: 1,
    },
    label: {
        color: "#404040",
        fontSize: "14px",
        fontWeight: 600,
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        width: "200px",
    },
}

function NewRnDHistoryTableBody({ filledRows, rowsPerPage }) {
    const [showTechSummary, setShowTechSummary] = useState(false);
    const textFieldRef = useRef(null);
    const [selectedId, setselectedId] = useState(null);
    const rows = Array.from(
        { length: rowsPerPage || 10 },
        (_, index) => filledRows?.[index] || null
    ); const handleTechSummaryClose = () => {
        setShowTechSummary(false);
    };


    return (
        <>
            <ContentModal open={showTechSummary} textFieldRef={textFieldRef} handleClose={handleTechSummaryClose} selectedId={selectedId} />
            <TableBody>
                {rows?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell sx={cellStyle}>{row?.sequence_no || ""}</TableCell>
                        <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
                            {row?.type || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, p: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                {row?.id && (
                                    <ContentIcon 
                                        showTechSummary={showTechSummary} 
                                        setShowTechSummary={setShowTechSummary} 
                                        rowId={row.id}
                                        setSelectedId={setselectedId}
                                    />
                                )}
                            </Box>
                        </TableCell>
                        <TableCell sx={{ ...cellStyle, textAlign: "right", color: "#FD5707" }}>
                            {row?.rd_score != null ? row.rd_score.toFixed(2) : ""}
                        </TableCell>
                        <TableCell sx={{ ...currencyCellStyle, textAlign: "center" }}>
                            {row?.date || ""}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
}

export default NewRnDHistoryTableBody;
