import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
// import ResetPassword from "../../components/ProfileSettings/ResetPassword";
import General from "../../components/ProfileSettings/General/General";


function ProfileSettings() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabStyles = {
    tabContainer: {
      display: "flex",
      width: "98%",
      mx: "auto",
      gap: "20px",
    },
    paper: {
      boxShadow: "0px 3px 6px #0000001F",
      display: "flex",
      flexDirection: "column",
      width: "23%",
      borderRadius: "20px",
      height: "100vh",
      overflowY: "auto",
    },
    getTabStyle: (isSelected) => ({
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: 1,
      borderColor: "divider",
      backgroundColor: isSelected ? "rgba(0,163,152, 0.1)" : "#FFFFFF",
      justifyContent: "flex-end",
      display: "flex",
      flexDirection: "row-reverse",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
      maxWidth: "100%",
    }),
    tabContent: {
      boxShadow: "0px 3px 6px #0000001F",
      display: "flex",
      flexDirection: "column",
      width: "77%",
      borderRadius: "20px",
      height: "100vh",
      overflowY: "auto",
    },
    boxStyle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      mt: 3,
      mb: 3,
    },
    heading: {
      px: 2,
      fontWeight: 500,
      py: 2,
      borderBottom: "2px solid #ddd",
      fontSize: "13px",
    },
    tabStyle: {
      borderRight: 1,
      borderColor: "divider",
      justifyContent: "flex-start",
    },
  };

  const tabLabels = [
    "General",

    //This is required in future so, i am commenting code related to rested password feature in application

    // "Reset Password",
  ];

  return (
    <>
      <Box sx={tabStyles.boxStyle}>
        <Box sx={tabStyles.tabContainer}>
          <Paper sx={tabStyles.paper}>
            <Typography sx={tabStyles.heading}>Profile Settings</Typography>
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={handleTabChange}
              sx={tabStyles.tabStyle}
              textColor="#404040"
              indicatorColor="primary"
            >
              {tabLabels.map((label, index) => (
                <Tab
                  key={label}
                  label={label}
                  sx={tabStyles.getTabStyle(selectedTab === index)}
                />
              ))}
            </Tabs>
          </Paper>
          <Paper sx={tabStyles.tabContent}>
            {selectedTab === 0 && <General />}
            {/* This is required in future so, i am commenting code related to rested password feature in application */}
            {/* {selectedTab === 1 && <ResetPassword />} */}
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default ProfileSettings;
