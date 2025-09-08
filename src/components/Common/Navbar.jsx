import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AppBar, Button, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";

const Navbar = () => {
  const NavbarButtons = [
    { name: "Home", isAuth: true },
    { name: "Accounts", isAuth: useHasAccessToFeature("F005", "P000000003") },
    { name: "Employees", isAuth: useHasAccessToFeature("F033", "P000000003") },
    { name: "Projects", isAuth: useHasAccessToFeature("F013", "P000000003") },
    { name: "Timesheets", isAuth: useHasAccessToFeature("F018", "P000000003") },
    { name: "Documents", isAuth: useHasAccessToFeature("F029", "P000000003") },
    { name: "Cases", isAuth: useHasAccessToFeature("F018", "P000000003") },
    { name: "Projects Team", isAuth: useHasAccessToFeature("F018", "P000000003") },
    { name: "Uploaded Sheets", isAuth: useHasAccessToFeature("F018", "P000000003") },
    { name: "Chat Assistant", isAuth: useHasAccessToFeature("F018", "P000000003") },
  ];

  const [selectedButton, setSelectedButton] = useState("Home");
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = () => {
    navigate("/alerts");
  };

  const isOnAlertsPage = location.pathname === "/alerts";
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const buttonName = NavbarButtons.find(button =>
      path === button.name.split(" ").join("-").toLowerCase()
    )?.name || "Home";
    setSelectedButton(buttonName);
  }, [location]);

  const buttonStyle = (buttonName) => ({
    textTransform: "capitalize",
    color: "#404040",
    fontSize: "0.82rem",
    fontWeight: "500",
    px: 1.5,
    mr: "2px",
    minHeight: "48px",
    borderBottom: selectedButton === buttonName ? "3px solid #00A398" : "none",
    backgroundColor: selectedButton === buttonName ? "#00A3981A" : "transparent",
    borderRadius: "0px",
    "&:hover": {
      backgroundColor: "#03A69B1A",
      borderBottom: "3px solid #00A398",
    },
  });

  const appStyle = {
    backgroundColor: "white",
    boxShadow: "0px 3px 6px #0000001F",
  };

  const iconStyle = { width: "23px", height: "23px", marginRight: "3px" };

  return (
    <AppBar position="static" sx={appStyle}>
      <Toolbar variant="dense">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginLeft: "-1.6rem",
            padding: "0px 5px",
            marginBottom: "-3px"
          }}
        >
          <div>
            {NavbarButtons.map(({ name, isAuth }) => {
              if (isAuth) {
                return (
                  <Button
                    key={name}
                    sx={buttonStyle(name)}
                    component={Link}
                    to={name === "Home" ? "/" : `/${name.split(" ").join("-").toLowerCase()}`}
                    onClick={() => setSelectedButton(name)}
                  >
                    {name}

                  </Button>
                );
              }
              return null;
            })}
          </div>
          <div
            style={{ display: "flex", marginTop: "1%", marginRight: "-38px" }}
          ></div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
