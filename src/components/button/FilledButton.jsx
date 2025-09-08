import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const FilledButton = ({
  btnname,
  onClick,
  Icon = <AddIcon />,
  color = "#00A398",
  type = "button",
  width = "100px",
  disabled = false,
}) => {
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: color,
        borderRadius: "20px",
        py: 0.5,
        px: 1.5,
        textTransform: "none",
        "&:hover": { backgroundColor: color },
        fontSize: "0.82rem",
        height: "32px",
        width: width,
      }}
      startIcon={Icon}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {btnname}
    </Button>
  );
};

export default FilledButton;
