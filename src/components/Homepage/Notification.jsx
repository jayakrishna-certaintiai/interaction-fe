import React, { useState } from "react";
import { Box } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formattedDate } from "../../utils/helper/FormatDatetime";

const boxStyle = {
  
  whiteSpace: "pre",
  backgroundColor: "rgba(253, 87, 7, 0.1)",
  color: "#404040",
  fontSize: "13px",
  p: 1,
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
};
const smallBoxStyle={backgroundColor:"#FD5707", width:"0.5%", height:"40px",};
const mainBox={display:"flex", alignItems:"center", mt: 1.6}

function Notification({ tasks }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tasks.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + tasks.length) % tasks.length
    );
  };

  return (
    <Box sx={mainBox}>
      <Box sx={smallBoxStyle}/>
      <Box sx={boxStyle}>
        {formattedDate(tasks?.[currentIndex]?.timestamp)}{" "} {tasks?.[currentIndex]?.alertDesc}
        <span style={spanStyle}>
          <ChevronLeftIcon
            sx={iconStyle}
            onClick={handlePrevious}
            style={{ cursor: "pointer", marginRight:"5px" }}
          />
          {currentIndex + 1} of {tasks?.length}
          <ChevronRightIcon
            sx={iconStyle}
            onClick={handleNext}
            style={{ cursor: "pointer", marginLeft:"5px" }}
          />
        </span>
      </Box>
    </Box>
  );
}

export default Notification;
