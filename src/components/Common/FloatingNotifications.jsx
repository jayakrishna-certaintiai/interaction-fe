import React, { useState, useContext } from "react";
import { Box, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelIcon from "@mui/icons-material/Cancel";
import { formattedDate } from "../../utils/helper/FormatDatetime.jsx";
import { NotificationContext } from "../../context/NotificationContext.jsx";

const boxStyle = {
  whiteSpace: "pre",
  backgroundColor: "rgba(253, 87, 7, 0.1)",
  color: "#404040",
  fontSize: "13px",
  px: 2,
  py: 0.5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "99.5%",
};
const spanStyle = { display: "flex", alignItems: "center" };
const iconStyle = {
  backgroundColor: "#FD5707",
  borderRadius: "50%",
  color: "white",
  cursor: "pointer",
};
const cancelIconStyle = {
  color: "#FD5707",
  fontSize: "28px",
  ml: 3,
  cursor: "pointer",
};
const openIconStyle = {
  color: "#FD5707",
  cursor: "pointer",
  ml: 1,
};
const textStyle = {
  display: "flex",
  alignItems: "center",
  fontSize: "0.82rem",
  fontWeight: "500",
};
const smallBoxStyle = {
  backgroundColor: "#FD5707",
  width: "0.5%",
  height: "36px",
};
const mainBox = { display: "flex", alignItems: "center" };

function FloatingNotifications({ tasks }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { hideNotification } = useContext(NotificationContext);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tasks?.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + tasks?.length) % tasks?.length
    );
  };

  return (
    <Box sx={mainBox}>
      {/* <Box sx={smallBoxStyle} />
      <Box sx={boxStyle}>
        <Typography sx={textStyle}>
          {formattedDate(tasks?.[currentIndex]?.createdTime)}
          {"       "}
          {tasks?.[currentIndex]?.alertDesc} */}
      {/* <OpenInNewIcon fontSize="small" sx={openIconStyle} /> */}
      {/* </Typography>
        <span style={spanStyle}>
          <ChevronLeftIcon
            sx={{ ...iconStyle, mr: 1 }}
            onClick={handlePrevious}
          />{" "}
          {currentIndex + 1} of {tasks?.length}{" "}
          <ChevronRightIcon sx={{ ...iconStyle, ml: 1 }} onClick={handleNext} />
          <CancelIcon sx={cancelIconStyle} onClick={hideNotification} />
        </span>
      </Box> */}
    </Box>
  );
}

export default FloatingNotifications;
