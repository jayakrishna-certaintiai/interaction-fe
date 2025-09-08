import { TableCell, TableHead, TableRow, IconButton } from "@mui/material";

const headerCellStyle = {
    fontSize: "13px",
    borderLeft: "1px solid #ddd",
    whiteSpace: "nowrap",
    py: 1,
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#ececec",
    cursor: "pointer",
};

const headerRowStyle = {
    backgroundColor: "rgba(64, 64, 64, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1,
};

export default function TableHeaderNonSort({tableData}) {
    return (
        <TableHead>
            <TableRow sx={headerRowStyle}>
                {tableData?.columns?.map((column, index) => (
                    <TableCell key={index} sx={{
                        ...headerCellStyle,
                        textAlign: index === 0 ? "left" : "center",
                    }} >{column}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}