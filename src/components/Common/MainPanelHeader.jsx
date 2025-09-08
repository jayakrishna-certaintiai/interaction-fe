/////////Case Surveys
import React, { useState, useEffect } from "react";
import { Toolbar, Button } from "@mui/material";
import { Height } from "@mui/icons-material";

function MainPanelHeader({ arr, first, onSelectedChange, page, selectedTab }) {
  const [selectedButton, setSelectedButton] = useState(selectedTab || first);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    onSelectedChange(buttonName); // Invoke the callback function
  };

  useEffect(() => {
    if (!selectedTab) {
      setSelectedButton(first);
    } else {
      setSelectedButton(selectedTab);
    }
  }, [selectedTab, first]);

  const buttonStyle = (buttonName) => ({
    textTransform: "capitalize",
    color: "#404040",
    fontSize: "11px",
    backgroundColor:
      selectedButton === buttonName ? "#03A69B1A" : "transparent",
    borderBottom: selectedButton === buttonName ? "3px solid #00A398" : "none",
    px: 1.5,
    mr: "2px",
    // minHeight: "48px",
    fontWeight: 600,
    borderRadius: "0px",
    mb: -1,
    height: -10,
    "&:hover": {
      backgroundColor: "#03A69B1A",
      borderBottom: "3px solid #00A398",
    },
  });

  return (
    <>
      <Toolbar variant="dense">
        {arr?.map(({ name, isAuth }) => {
          if (isAuth) {
            return (
              <Button
                key={name}
                sx={buttonStyle(name)}
                onClick={() => handleButtonClick(name)}
              >
                {name}
              </Button>
            );
          }
          return null;
        })}
      </Toolbar>
    </>
  );
}

export default MainPanelHeader;
