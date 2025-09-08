import React, { useState } from "react";
// import "./login.css";
import "./login.css";
import SignIn from "../../components/Common/SignIn";
import { CompanyLogo } from "../../constants/Baseurl";
import NameLogo from "../../assets/login-certainti.png";
import ForgotPassword from "./ForgotPassword";
import ContactSupport from "./ContactSupport";
import R_and_D_logo from "../../assets/r&d-credits.png";
import defaultCompanyLogo from "../../assets/artificial-intelligence.png";
import BeaconRD from "../../assets/MicrosoftTeams-image.png"
import Image from "../../assets/n.png"
import { Box, CircularProgress } from "@mui/material";

const Login = (page) => {
  const [isLoading, setisLoading] = useState(false);
  return (
    <>
      {!isLoading && (<div className="login">
        <div
          style={{
            width: "70%",
            height: "30%",
            display: "flex",
            marginTop: "-1%"
          }}
        >
          <div
            style={{
              flex: 110,
              display: "flex",
              alignItems: "left",
              justifyContent: "left",
              padding: "6%",
              // paddingTop: "65px"
            }}
          >
            {page.page == "signIn" && <SignIn />}
            {page.page == "forgotPass" && <ForgotPassword />}
            {page.page == "contactsupport" && <ContactSupport />}
          </div>
          <div
            style={{
              display: "flex",
              // justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "46%",
              marginLeft: "-95%",
              marginRight: "-20%",
              marginBottom: "8%",
            }}
          >
            {/* <img src={R_and_D_logo} alt="header" height="17rem" /> */}
            <p
              style={{
                // fontFamily: "alderypro",
                fontFamily: "monospace",
                marginRight: "0.1rem",
                color: "#00004B",
                fontSize: "1.6rem",
                fontWeight: 700,
                // marginTop: "0.3rem",
                marginBottom: "1.2rem",
              }}
            >
              R&D Credits
            </p>
            <p
              style={{
                // fontFamily: "alderypro",
                // fontFamily: "monospace",
                fontFamily: `"Qwitcher Grypen", cursive !important`,
                marginRight: "0.4rem",
                color: "#9F9F9F",
                fontSize: "1rem",
                fontWeight: 1500,
                marginTop: "0.3rem",
                marginLeft: "0.1rem",
                marginBottom: "2rem",
              }}
              className="qwitcher-grypen-important"
            >
              powered by
            </p>
            <img src={NameLogo} alt="logo" width={"150px"} height={"35px"} style={{ marginBottom: "1.5rem" }} />
          </div>
          {/* <Box >
          <img src={Image} alt="logo" style={{ marginTop: "-35.5rem", width: "100%", height: "60%", marginBottom: "40%", marginLeft: "280%", position: "relative" }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "right" }}>
          <Box >
            <img
              src={CompanyLogo || defaultCompanyLogo}
              alt="logo"
              width="320rem"
              style={{ marginTop: "-20.8rem", marginBottom: "-10%", marginLeft: "90%" }}
            />
          </Box>
          <Box >
            <img src={BeaconRD} alt="logo" width={"270rem"} style={{ marginTop: "-9.5rem", marginBottom: "90%", marginLeft: "80%" }} />
          </Box>
        </Box> */}
          <Box sx={{ display: "flex", alignItems: "right" }}>
            <Box >
              <img
                src={CompanyLogo || defaultCompanyLogo}
                alt="logo"
                width={"300rem"}
                // height={"100px"}
                style={{ marginTop: "-20.8rem", marginBottom: "11%", marginLeft: "92%" }}
              />
            </Box>
            <Box >
              <img src={BeaconRD} alt="logo" width={"270rem"} style={{ marginTop: "-13.5rem", marginBottom: "2%", marginLeft: "70%" }} />
            </Box>
          </Box>
        </div>
      </div >)}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
            minHeight: "47vh",
          }}
        >
          <CircularProgress sx={{ color: "#00A398" }} />
        </div>
      )}
    </>
  );
};

export default Login;
