import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import UserManagement from "../../components/Settings/UserManagement/UserManagement";
import UserRoleManagement from "../../components/Settings/UserRoleManagement/UserRoleManagement";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

function Settings() {
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
      width: "20%",
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
      width: "80%",
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
    // { name: "Tool Settings", isAuth: false },
    {
      name: "User Management",
      isAuth: useHasAccessToFeature("F001", "P000000003"),
    },
    {
      name: "User Role Management",
      isAuth: useHasAccessToFeature("F002", "P000000003"),
    },
    // { name: "Alert Management", isAuth: false },
    // { name: "Company Profile Management", isAuth: false },
  ];

  return (
    <>
      <Box sx={tabStyles.boxStyle}>
        <Box sx={tabStyles.tabContainer}>
          <Paper sx={tabStyles.paper}>
            <Typography sx={tabStyles.heading}>Settings</Typography>
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={handleTabChange}
              sx={tabStyles.tabStyle}
              textColor="#404040"
              indicatorColor="primary"
            >
              {tabLabels.map((label, index) => {
                if (label.isAuth) {
                  return (
                    <Tab
                      key={label.name}
                      label={label.name}
                      sx={tabStyles.getTabStyle(selectedTab === index)}
                    />
                  );
                }
                return null;
              })}
            </Tabs>
          </Paper>
          <Paper sx={tabStyles.tabContent}>
            {/* {selectedTab === 0 && <ToolSettings />} */}
            {useHasAccessToFeature("F001", "P000000003") &&
              selectedTab === 0 && <UserManagement />}
            {useHasAccessToFeature("F002", "P000000003") &&
              selectedTab === 1 && <UserRoleManagement />}
            {/* {selectedTab === 3 && <AlertManagement />}
            {selectedTab === 4 && <CompanyProfileManagement />} */}
          </Paper>
        </Box>
      </Box>
    </>
  );
}

export default Settings;
