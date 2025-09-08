import React from "react";
import { TableCell, IconButton, Menu, MenuItem } from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";

const DropdownStatusCell = ({
  value,
  options,
  onSelect,
  rowIndex,
  columnName,
  highlighted,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (option) => {
    onSelect(rowIndex, columnName, option);
    handleClose();
  };

  return (
    <TableCell
      sx={{
        textAlign: "right",
        position: "relative",
        backgroundColor: highlighted ? "#ffead4" : "transparent",
        "&:hover .dropdown-icon": {
          opacity: 1,
        },
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>{value || ""}</span>
        <IconButton
          size="small"
          onClick={handleOpen}
          sx={{
            height: 15,
            color: "rgba(64, 64, 64, 0.4)",
            opacity: 0,
            transition: "opacity 0.2s",
            position: "absolute",
            right: 0,
          }}
          className="dropdown-icon"
        >
          <ArrowDropDownIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {options.map((option) => (
            <MenuItem key={option} onClick={() => handleSelect(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </TableCell>
  );
};

export default DropdownStatusCell;
