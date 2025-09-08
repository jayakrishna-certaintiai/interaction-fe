import {
  AccountCircle as AccountCircleIcon,
  Help as HelpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
  Notifications as NotificationsIcon,
  // Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  InputBase,
  Link,
  Paper,
  Typography,
  Popover,
} from "@mui/material";
import React, { useState } from "react";
import { NewInstance } from "../../constants/Baseurl";
import { useLocation, useNavigate } from "react-router-dom";
import CertaintiLogo from "../../assets/Certainti.png";
import CertaintiIcon from "../../assets/login-certainti.png";
import { useAuthContext } from "../../context/AuthProvider";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { CompanyLogo } from "../../constants/Baseurl";
import defaultCompanyLogo from "../../assets/artificial-intelligence.png";
import BeaconRdText from "../../assets/BeaconRd-text.png";
import { color } from "highcharts";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "4px 15px",
  borderBottom: "1px solid rgba(159, 159, 159, 0.2)",
  backgroundColor: "white",
  height: "90%"

};
const divStyle = { textAlign: "center" };
const searchIconStyle = {
  color: "#9F9F9F",
  ml: "3px",
  mr: "-3px",
  width: "20px",
  height: "20px",
};
const inputStyle = {
  borderRadius: "20px",
  width: "60%",
  height: "36px",
  border: "1px solid #9F9F9F",
};
const instance = {
  fontSize: "1rem",
  fontWeight: 150,
  color: "#A0A0A0",
  fontFamily: "Poppins, sans-serif",
  letterSpacing: "1.5px",
  marginLeft: "20px",
  marginBottom: "8px"
};
const iconStyle = {
  "&:hover": { color: "#FD5707" },
  cursor: "pointer",
  color: "#404040",
};
const keyboardArrowIconStyle = {
  width: "20px",
  height: "20px",
  ml: "-1px",
  mb: "2px",
};
const boxStyle = {
  fontSize: "13px",
  p: 1,
  "&:hover": { backgroundColor: "rgba(253, 87, 7, 0.1)" },
  cursor: "pointer",
  color: "#404040",
};
const paperStyle = {
  position: "absolute",
  top: 50,
  right: 20,
  width: "200px",
  height: "130px",
  display: "flex",
  flexDirection: "column",
  zIndex: 999,
  backgroundColor: "white",
  margin: "auto",
  p: 1,
  justifyContent: "space-between",
  boxShadow: "0px 3px 6px #0000001F",
};
const iconStyle2 = {
  mb: -0.5,
  width: "20px",
  height: "20px",
  color: "#404040",
};
const flexBoxStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "baseline",
};
const greetingTextStyle = {
  color: "#FD5707",
  display: "inline-flex",
  fontSize: "13px",
  fontWeight: "500",
  marginTop: "6px",
};

function Header() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // const handleBoxClick = () => {
  //   setDropdownVisible(!isDropdownVisible);
  // };

  const handleLogout = () => {
    logout();
  };
  const handleBoxClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleNotificationClick = () => {
    navigate("/alerts");
  };
  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfileSettingClick = () => {
    navigate("/profile-settings");
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const isOnAlertsPage = location.pathname === "/alerts";
  const isOnSettingsPage = location.pathname === "/settings";

  const userAccess = useHasAccessToFeature("F001", "P000000003");
  const roleAccess = useHasAccessToFeature("F002", "P000000003");

  return (
    <>
      <div style={containerStyle}>
        <div
          style={{
            ...divStyle,
            flex: 2,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginBottom: "7px",
            marginTop: "7px"
          }}
        >
          <img
            src={CompanyLogo || defaultCompanyLogo}
            alt="header"
            width="90px"

          />
          {/* <p
            style={{
              color: "#9F9F9F",
              fontSize: "13px",
              fontWeight: 500,
              height: "20px",
              marginBottom: "6px",
            }}
          >
            &
          </p> */}
          <img
            src={BeaconRdText || defaultCompanyLogo}
            alt="header"
            width="90px"
            style={{ marginLeft: "0.15rem", marginBottom: "0.65rem" }}
          />
          <p
            style={{
              marginLeft: "8px",
              color: "#9F9F9F",
              fontSize: "13px",
              fontWeight: 500,
              height: "20px",
              marginBottom: "6px",
            }}
          >
            powered by
          </p>
          <img
            src={CertaintiIcon}
            alt="header"
            style={{ marginLeft: "5px", marginBottom: "8px" }}
            // height="25px"
            width="95px"
          />
          <div style={instance}>{NewInstance ? `${NewInstance || "Development"}` : ""}</div>
        </div>
        {/* <div style={instance}>
          {NewInstance ? `${NewInstance.charAt(0).toUpperCase() + NewInstance.slice(1) || "Development"}` : ""}
        </div> */}
        <div style={{ ...divStyle, flex: 2.5 }}>
          {/* <InputBase
            type="text"
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={searchIconStyle} />
              </InputAdornment>
            }
            sx={inputStyle}
          /> */}
        </div>
        <div
          style={{
            ...divStyle,
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Box sx={{ ...flexBoxStyle, display: "inline" }}>
            <Typography sx={greetingTextStyle}>
              {localStorage?.getItem("userName")?.split(" ")?.map((el) => " " + el.charAt(0)?.toUpperCase() + el?.slice(1))}
            </Typography>
          </Box>
          <Link
            to={isOnAlertsPage ? "#" : "/alerts"}
            style={{ textDecoration: "none" }}
          >
            <NotificationsIcon
              sx={{
                ...iconStyle,
                color: isOnAlertsPage ? "#00A398" : "#404040",
              }}
              onClick={handleNotificationClick}
            />
          </Link>
          {userAccess || roleAccess ? (
            <Link
              to={isOnSettingsPage ? "#" : "/settings"}
              style={{ textDecoration: "none" }}
            >
              <SettingsIcon
                sx={{
                  ...iconStyle,
                  color: isOnSettingsPage ? "#00A398" : "#404040",
                }}
                onClick={handleSettingsClick}
              />
            </Link>
          ) : null}
          <Box sx={iconStyle} onClick={handleBoxClick}>
            <AccountCircleIcon />
            <KeyboardArrowDownIcon sx={keyboardArrowIconStyle} />
          </Box>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ p: 1 }}>
              <Box
                sx={boxStyle}
                onClick={() => {
                  handleProfileSettingClick();
                  handleClose();
                }}
              >
                <ManageAccountsIcon sx={iconStyle2} /> Profile Settings
              </Box>
              <Box sx={boxStyle} onClick={handleClose}>
                <HelpIcon sx={iconStyle2} /> Walkthrough
              </Box>
              <Box
                sx={boxStyle}
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
              >
                <LogoutIcon sx={iconStyle2} /> Sign Out
              </Box>
            </Box>
          </Popover>
        </div>
      </div>
    </>
  );
}

export default Header;
