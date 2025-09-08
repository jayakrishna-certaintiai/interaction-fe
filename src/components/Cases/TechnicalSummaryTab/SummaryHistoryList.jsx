import React from "react";
import { Typography, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NavigationWithId from "../../Common/NavigationWithId";

const boxStyle = {
    display: "flex",
    justifyContent: "space-between",
    pl: 0.5
};

const textStyle = {
    fontSize: "13px",
    fontWeight: 400,
};

const iconStyle = { mr: -8.1, ml: -10.5, fontSize: "20px", color: "#9F9F9F" };

function SummaryHistoryList({ title, redirectTo }) {
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

export default SummaryHistoryList;
