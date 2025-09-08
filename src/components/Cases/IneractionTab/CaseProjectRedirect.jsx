import React from 'react'
import { Typography, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NavigationWithId from '../../Common/NavigationWithId';

const boxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderBottom: "1px solid #e0e0e0",
  };

  const textStyle = {
    padding: 1,
    fontSize: "12px",
    fontWeight: 400,
  };
  
const iconStyle = { mr: 1, fontSize: "20px", color: "#9F9F9F" };

const CaseProjectRedirect = ({ title, redirectTo }) => {
  return (
    <Box sx={boxStyle}>
        <Typography component="div" sx={textStyle}> {title} </Typography>
        <NavigationWithId route={redirectTo}>
            <OpenInNewIcon sx={iconStyle}/>
        </NavigationWithId>
    </Box>
  )
}

export default CaseProjectRedirect;