import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  InputBase,
  InputLabel,
  Tooltip,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

const styles = {
  inputBase: {
    border: "1px solid #E4E4E4",
    borderRadius: "20px",
    height: "32px",
    pl: 1,
    mb: 0.5,
    width: "250px",
    transition: "background-color 0.3s ease",

  },
  inputBaseHighlighted: {
    border: "1px solid #E4E4E4",
    borderRadius: "20px",
    width: "250px",
    height: "32px",
    backgroundColor: "#ffead4",
    "&:hover": {
      backgroundColor: "#ffead4",
    },
    "& .edit-icon": {
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover .edit-icon": {
      opacity: 1,
    },
    textAlign: "left",
    paddingLeft: "calc(10% - 10px)",
  },
  label: {
    color: "#404040",
    fontSize: "14px",
  },
  boxStyle: { display: "flex", flexDirection: "column" },
  menuPaper: {
    maxHeight: "250px",
    overflow: "auto",
  },
};

function EditableInput({
  label,
  value,
  onChange,
  disabled,
  display,
  type = "text",
  errors,
  required = false,
  selectOptions = [],
}) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(0);

  // Update input width on render
  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [inputRef.current]);

  // Handle focus and blur to highlight the input
  const handleFocus = () => {
    setIsHighlighted(true);
  };

  const handleBlur = () => {
    setIsHighlighted(false);
  };

  const renderInput = () => {
    const inputStyles = isHighlighted
      ? styles.inputBaseHighlighted
      : styles.inputBase;

    if (type === "select") {
      return (
        <Select
          value={value}
          onChange={onChange}
          disabled={disabled}
          sx={inputStyles}
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                ...styles.menuPaper,
                width: `${inputWidth}px`, // Dynamically set the dropdown width
              },
            },
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputRef={inputRef} // Attach ref to Select component
        >
          <MenuItem disabled value={null || ""}>
            <span style={{ color: "#00A398" }}>Select {label}</span>
          </MenuItem>
          {selectOptions.map((option) => (
            <MenuItem key={option?.id} value={option?.id} sx={{ borderTop: "1px solid #E4E4E4" }}>
              {option?.name}
            </MenuItem>
          ))}
        </Select>
      );
    } else {
      return (
        <InputBase
          type={type}
          sx={inputStyles}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputRef={inputRef} // Attach ref to InputBase component
        />
      );
    }
  };

  return (
    <Box sx={{ ...styles.boxStyle, display: display || "auto" }}>
      <InputLabel sx={styles.label}>
        {label?.length > 50 ? (
          <Tooltip title={label}>
            <span>{label.substring(0, 50)}...</span>
          </Tooltip>
        ) : (
          label
        )}
        {required && <span style={{ color: "red" }}>*</span>}
      </InputLabel>
      {renderInput()}
      {errors && (
        <Typography sx={{ color: "red", fontSize: "13px" }}>
          {errors}
        </Typography>
      )}
    </Box>
  );
}

export default EditableInput;
