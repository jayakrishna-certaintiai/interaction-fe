import React, { useState } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditUserModal from "../Settings/UserManagement/EditUserModal";
import UserDeactivateModal from "../Settings/UserManagement/UserDeactivateModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ContactTableCell from "../Common/ContactTableCell";
import { Link } from "react-router-dom";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  py: 0.5,
  fontSize: "12px",
  height: "32px",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

const menuitemStyle = {
  mx: 0.5,
  fontSize: "13px",
  "&:hover": { backgroundColor: "rgba(253, 87, 7, 0.1)" },
};

const iconStyle = { fontSize: "18px", mr: 0.5 };

function CompanyUsersTableBody({ filledRows, fetchUsers }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [currUserId, setcurrUserId] = useState(null);

  const handleClick = (event, contactId) => {
    setcurrUserId(contactId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModal2Close = () => {
    setModal2Open(false);
  };
  return (
    <>
      <TableBody>
        {filledRows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <ContactTableCell
              id={row?.contactId}
              name={
                row?.firstName && row?.lastName
                  ? row?.firstName + " " + row?.lastName
                  : ""
              }
            />
            <TableCell sx={cellStyle}>{row?.employeeTitle || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.role || ""}</TableCell>
            <TableCell sx={cellStyle}>
              <Link>
                {row?.status
                  ? row?.status
                    .toLowerCase()
                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                    .trim()
                  : ""}
              </Link>
            </TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              {row?.email || ""}
            </TableCell>
            {/* <TableCell sx={cellStyle}>{row?.lastLogin || ""}</TableCell> */}
            <TableCell sx={cellStyle}>
              {row?.firstName && (
                <IconButton
                  onClick={(e) => handleClick(e, row?.userId)}
                  sx={{ padding: 0 }}
                >
                  <MoreVertIcon sx={{ color: "#9F9F9F" }} />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setModal2Open(!modal2Open);
            handleClose();
          }}
          sx={menuitemStyle}
        >
          <EditIcon sx={iconStyle} />
          Edit User
        </MenuItem>
        <MenuItem
          onClick={() => {
            setModalOpen(!modalOpen);
            handleClose();
          }}
          sx={menuitemStyle}
        >
          <DeleteForeverIcon sx={iconStyle} />
          Deactivate User
        </MenuItem>
      </Menu>
      <EditUserModal
        open={modal2Open}
        handleClose={handleModal2Close}
        userToBeEdited={currUserId}
        fetchUsers={fetchUsers}
      />
      <UserDeactivateModal
        open={modalOpen}
        handleClose={handleModalClose}
        userToBeDeleted={currUserId}
        fetchUsers={fetchUsers}
      />
    </>
  );
}

export default CompanyUsersTableBody;
