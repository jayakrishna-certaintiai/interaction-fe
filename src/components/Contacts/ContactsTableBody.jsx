import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  IconButton,
  Menu,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import CompanyTableCell from "../Common/CompanyTableCell";
import ContactTableCell from "../Common/ContactTableCell";
import ContactDeleteModal from "./ContactDeleteModal";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  borderLeft: "1px solid #ddd",
  py: 1,
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
  borderLeft: "1px solid #ddd",
};

const menuitemStyle = {
  mx: 0.5,
  fontSize: "15px",
  borderLeft: "1px solid #ddd",
  "&:hover": { backgroundColor: "rgba(253, 87, 7, 0.1)" },
};

function ContactsTableBody({ data, currentPage, itemsPerPage }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const isEdit = useHasAccessToFeature("F033", "P000000005");

  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* <TableCell sx={{ ...cellStyle, textAlign: "left", color: "#FD5707" }}>
              {row?.employeeId || ""}
            </TableCell> */}
            <ContactTableCell
              id={row?.contactId}
              name={row?.employeeId}
            />
            <ContactTableCell
              id={row?.contactId}
              name={
                  row?.firstName ? row?.firstName : "" + " " + row?.lastName? row?.lastName : ""
                  
              }
            />
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              {row?.employementType || ""}
            </TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              {row?.employeeTitle || ""}
            </TableCell>
            {/* <TableCell sx={cellStyle}>{row?.employeeWages || ""}</TableCell> */}
            <CompanyTableCell id={row?.companyId} name={row?.companyName} />
            {/* <TableCell sx={cellStyle}>{row?.phone || ""}</TableCell> */}
            {/* <TableCell sx={cellStyle}>
              {isEdit && row?.companyId && (
                <IconButton onClick={(e) => handleClick(e)} sx={{ padding: 0 }}>
                  <MoreVertIcon sx={{ color: "#9F9F9F" }} />
                </IconButton>
              )}
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setModalOpen(!modalOpen);
            handleClose();
          }}
          sx={menuitemStyle}
        >
          <DeleteForeverIcon sx={{ fontSize: "23px", mr: 0.5 }} />
          Delete
        </MenuItem>
      </Menu>
      <ContactDeleteModal open={modalOpen} handleClose={handleModalClose} />
    </>
  );
}

export default ContactsTableBody;
