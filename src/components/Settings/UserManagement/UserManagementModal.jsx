import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Modal,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { FilterListContext } from "../../../context/FiltersListContext";
import ExistingContact from "./ExistingContact";
import NewContact from "./NewContact";

const theme = createTheme({
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          textTransform: "capitalize",
          "&.Mui-selected": {
            color: "white",
            backgroundColor: "#00A398",
            "&:hover": {
              backgroundColor: "#00A398",
              color: "white",
            },
          },
          "&:not(.Mui-selected)": {
            color: "black",
            borderColor: "#E4E4E4",
            "&:hover": {
              borderColor: "#E4E4E4",
              color: "black",
            },
          },
        },
      },
    },
  },
});

const UserManagementModal = ({
  open,
  handleClose,
  fetchUsersList,
  companyId,
}) => {
  const { contactList, userRolesList, clientList } =
    useContext(FilterListContext);
  const [alignment, setAlignment] = useState("existing");
  const [opacity, setOpacity] = useState(1);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setOpacity(0);
      setTimeout(() => {
        setAlignment(newAlignment);
      }, 100);
    }
  };

  useEffect(() => {
    setOpacity(1);
  }, [alignment]);

  const styles = {
    paperStyle: {
      boxShadow: "0px 3px 6px #0000001F",
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px",
      margin: "auto",
      maxWidth: "90%",
      width: alignment === "existing" ? 500 : 700,
    },
    titleStyle: {
      textAlign: "left",
      fontWeight: 600,
      fontSize: "13px",
    },
    buttonStyle: {
      mr: 1,
      borderRadius: "20px",
      textTransform: "capitalize",
      backgroundColor: "#9F9F9F",
      "&:hover": { backgroundColor: "#9F9F9F" },
    },
    uploadButtonStyle: {
      borderRadius: "20px",
      textTransform: "capitalize",
      backgroundColor: "#00A398",
      "&:hover": { backgroundColor: "#00A398" },
    },
    modalStyle: {
      display: "flex",
    },
    buttonBox: {
      mt: 1,
      display: "flex",
      justifyContent: "flex-end",
      px: 2,
      mb: 2,
    },
    flexBox: {
      display: "flex",
      flexDirection: "column",
      borderBottom: "1px solid #E4E4E4",
    },
    flexBoxItem: {
      display: "flex",
      justifyContent: "space-between",
      mt: 1,
      px: 2,
    },
    label: {
      color: "#404040",
      fontSize: "14px",
    },
    inputBase: {
      borderRadius: "20px",
      height: "40px",
      border: "1px solid #E4E4E4",
      pl: 1,
      mb: 0.5,
    },
    expandMoreIcon: {
      borderRadius: "50%",
      fontSize: "15px",
      backgroundColor: "#404040",
      color: "white",
      mr: 1,
      transition: "transform 0.3s ease",
    },
    sectionStyle: { fontWeight: 600, px: 2, cursor: "pointer" },
    box1Style: {
      display: "flex",
      justifyContent: "space-between",
      p: 2,
      borderBottom: "1px solid #E4E4E4",
      alignItems: "center",
    },
    inputStyle: {
      borderRadius: "20px",
      width: "30%",
      height: "32px",
      border: "1px solid #9F9F9F",
      mr: 2,
    },
    toggleButton: {
      borderRadius: "20px",
      height: "32px",
      textTransform: "capitalize",
    },
    transitionStyles: {
      transition: "opacity 0.1s ease-in",
      opacity: opacity,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
        <Paper sx={styles.paperStyle}>
          <Box sx={{ ...styles.box1Style, py: 1 }}>
            <Typography variant="h6" sx={styles.titleStyle}>
              Add User
            </Typography>
            <CancelIcon
              sx={{
                color: "#9F9F9F",
                cursor: "pointer",
                "&: hover": { color: "#FD5707" },
                transition: "",
              }}
              onClick={handleClose}
            />
          </Box>
          <Box sx={{ ...styles.box1Style, py: 1, borderBottom: "none" }}>
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="existing" sx={styles.toggleButton}>
                Existing User
              </ToggleButton>
              <ToggleButton value="new" sx={styles.toggleButton}>
                New User
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={styles.transitionStyles}>
            {alignment === "existing" && (
              <ExistingContact
                contactList={contactList}
                handleClose={handleClose}
                userRolesList={userRolesList}
                fetchUsersList={fetchUsersList}
                clientList={clientList}
                open={open}
                companyId={companyId}
              />
            )}
            {alignment === "new" && (
              <NewContact
                handleClose={handleClose}
                userRolesList={userRolesList}
                fetchUsersList={fetchUsersList}
                clientList={clientList}
                companyId={companyId}
              />
            )}
          </Box>
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default UserManagementModal;
