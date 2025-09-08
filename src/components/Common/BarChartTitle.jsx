import React from "react";
import { Typography, Button } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NorthIcon from "@mui/icons-material/North";
import { Link } from "react-router-dom";

const titleStyle = {
  color: "#404040",
  fontSize: "10px",
  ml: 1,
  mt: 1,
  alignItems: "center",
  display: "inline-flex",
  fontWeight: 600,
};

const detailsTextStyle = {
  color: "#9F9F9F",
  fontSize: "10px",
  ml: 1,
  mt: 1,
  mr: 0.2,
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "underline",
  cursor: "pointer",
  "&:hover": {
    color: "#FD5707",
    "& svg": {
      backgroundColor: "#FD5707",
    },
  },
};

const chevronRightIconStyle = {
  backgroundColor: "#9F9F9F",
  borderRadius: "50%",
  color: "white",
  height: "13px",
  width: "13px",
  ml: "4px",
};

function BarChartTitle({
  title,
  onSortClick,
  onSortByNameClick,
  ascending,
  redirect,
  sortBy,
  icon = true,
}) {
  const northIconStyle = {
    fontSize: "15px",
    transform: ascending ? "rotate(180deg)" : "rotate(0deg)",
    "&:hover": {
      transform: ascending ? "rotate(180deg)" : "rotate(0deg)",
      color: "#FD5707",
    },
    color: "#9F9F9F",
  };

  const capitalizeText = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Typography sx={titleStyle}>
        {title}
        {icon && <NorthIcon sx={northIconStyle} onClick={onSortClick} />}
      </Typography>
      <Button onClick={onSortByNameClick} style={{ fontSize: "10px", color: "#404040", fontWeight: 600, textTransform: "none" }}>
        Sort By {capitalizeText(sortBy === "value" ? "name" : "value")}
      </Button>
      {redirect && (
        <Link to="/reports">
          <Typography sx={detailsTextStyle}>
            View More Details
            <ChevronRightIcon sx={chevronRightIconStyle} />
          </Typography>
        </Link>
      )}
    </>
  );
}

export default BarChartTitle;
