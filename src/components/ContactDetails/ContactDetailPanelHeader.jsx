import React, { useState } from "react";
import { Toolbar, Button } from "@mui/material";

function ContactDetailPanelHeader({ arr, first, onSelectedChange }) {
  const [selectedButton, setSelectedButton] = useState(first);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    onSelectedChange(buttonName); // Invoke the callback function
  };

  const buttonStyle = (buttonName) => ({
    textTransform: "capitalize",
    color: selectedButton === buttonName ? "white" : "#404040",
    fontSize: "11px",
    backgroundColor: selectedButton === buttonName ? "#03A69B" : "transparent",
    px: "4px",
    fontWeight: 600,
    borderRadius: "20px",
    "&:hover": {
      backgroundColor:
        selectedButton === buttonName ? "#03A69B" : "transparent",
    },
  });

  return (
    <>
      <Toolbar variant="dense" sx={{ flexWrap: "wrap", gap: "20px" }}>
        {arr.map((buttonName) => (
          <Button
            key={buttonName}
            sx={buttonStyle(buttonName)}
            onClick={() => handleButtonClick(buttonName)}
          >
            {buttonName}
          </Button>
        ))}
      </Toolbar>
    </>
  );
}

export default ContactDetailPanelHeader;
