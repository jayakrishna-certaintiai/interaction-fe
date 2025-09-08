import React, { useState } from "react";
import { TableCell, TextField, IconButton } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const EditableTextCell = ({ value, onSave, onCancel, rowIndex, columnName, highlighted, onEditClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleEditClick = () => {
    onEditClick(rowIndex, columnName, value); // Trigger the edit click to highlight the field
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(rowIndex, columnName, localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    onCancel();
    setIsEditing(false);
  };

  return (
    <TableCell
      sx={{
        textAlign: "right",
        position: "relative",
        backgroundColor: highlighted ? "#ffead4" : "transparent",
        "&:hover .edit-icon": {
          opacity: 1,
        },
      }}
    >
      {isEditing ? (
        <>
          <TextField
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            variant="standard"
            autoFocus
            sx={{ flexGrow: 1 }}
          />
          <div>
            <IconButton onClick={handleSave} sx={{ marginRight: 2 }}>
              Save
            </IconButton>
            <IconButton onClick={handleCancel}>Cancel</IconButton>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{value || ""}</span>
          <IconButton
            size="small"
            onClick={handleEditClick}
            sx={{
              height: 15,
              color: "rgba(64, 64, 64, 0.4)",
              opacity: 0,
              transition: "opacity 0.2s",
              position: "absolute",
              right: 0,
            }}
            className="edit-icon"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </TableCell>
  );
};

export default EditableTextCell;
