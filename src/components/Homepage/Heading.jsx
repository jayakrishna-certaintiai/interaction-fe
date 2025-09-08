import React from "react";
import { Typography, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import NavigationWithId from "../Common/NavigationWithId";

const boxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #e0e0e0",
};

const textStyle = {
  padding: 1,
  fontSize: "13px",
  fontWeight: 600,
};

const iconStyle = { mr: 1, fontSize: "20px", color: "#9F9F9F" };
function Heading({ title, redirectTo }) {
  return (
    <Box sx={boxStyle}>
      <Typography component="div" sx={textStyle}>
        {title}
      </Typography>
      <NavigationWithId route={redirectTo}>
        <OpenInNewIcon sx={iconStyle} />
      </NavigationWithId>
    </Box>
  );
}

export default Heading;
