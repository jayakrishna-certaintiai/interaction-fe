import React from "react";
import { Button } from "@mui/material";

const ActionButton = ({ label, color, onClick }) => (
  <Button
    sx={{
      width: "70px",
      height: "30px",
      borderRadius: "20px",
      textTransform: "capitalize",
      fontWeight: "500",
      fontSize: "13px",
      color: "white",
      backgroundColor: color,
      "&:hover": { backgroundColor: color },
    }}
    onClick={onClick}
  >
    {label}
  </Button>
);

export default ActionButton;
