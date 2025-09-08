import { useState } from "react";
import { TableBody, TableRow, TableCell, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProjectTableCell from "../Common/ProjectTableCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  py: 0.5,
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

const ContactsRndTableBody = ({ filledRows = [] }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  return (
    <>
      <TableBody>
        {filledRows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>

            {/* <TableCell sx={{ ...cellLinkStyle, textAlign: "left" }}>
              {row?.surveyId}
            </TableCell> */}
            {/* <TableCell sx={{ ...cellStyle, color: "#00A398", textAlignLast: "left" }}>{row?.projectName || ""}</TableCell> */}
            <ProjectTableCell id={row?.projectId} name={row?.projectCode} />
            <ProjectTableCell id={row?.projectId} name={row?.projectName} />
            <TableCell sx={cellStyle}>{row?.totalHours || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.hourlyRate || ""}</TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>{row?.rndExpense || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ContactsRndTableBody;
