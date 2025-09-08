import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Divider, List, Typography } from "@mui/material";
import React, { useContext } from "react";
import Heading from "./Heading";
import moment from "moment";
import { Link } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";

const containerStyle = { height: "100%" };
const boxStyle = { overflowY: "auto", height: "calc(100% - 48px)" };
const listStyle = { width: "100%" };
const listItemBoxStyle = { px: 2, mt: 1 };
const dateIconBoxStyle = { display: "flex", justifyContent: "space-between" };
const dateTextStyle = { fontSize: "13px" };
const iconStyle = { ml: 1, fontSize: "18px", color: "#9F9F9F" };
const contentTextStyle = { fontSize: "13px", mt: 0.5 };

function Alerts() {
  const { alerts } = useContext(NotificationContext);
  
  return (
    <div style={containerStyle}>
      <Heading title={"Recent Alerts"} redirectTo="/alerts" />
      <Box sx={boxStyle}>
        <List sx={listStyle}>
          {alerts?.map((alert, index) => (
            <React.Fragment key={index}>
              <Box sx={listItemBoxStyle}>
                <Box sx={dateIconBoxStyle}>
                  <Typography sx={dateTextStyle}>
                    {moment(alert?.timestamp)?.format("DD/MM/YYYY HH:mm:ss")}
                  </Typography>
                  <Link to={"/alerts"}>
                    <OpenInNewIcon sx={iconStyle} />
                  </Link>
                </Box>
                <Typography sx={contentTextStyle}>
                  {alert?.alertDesc}
                </Typography>
              </Box>
              {index < alerts?.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </div>
  );
}

export default Alerts;
