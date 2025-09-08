import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Modal, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../../constants/Baseurl";
import { FilterListContext } from "../../../context/FiltersListContext";
import EditUser from "./EditUser";
import { Authorization_header } from "../../../utils/helper/Constant";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 700,
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
  },
};

const EditUserModal = ({ open, handleClose, fetchUsers, userToBeEdited }) => {
  const { contactList, userRolesList, clientList } =
    useContext(FilterListContext);
  const [details, setDetails] = useState([]);

  const fetchUserDetail = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/users/${localStorage.getItem(
            "userid"
          )}/1/get-user-details?userIds=["${userToBeEdited}"]`, Authorization_header()
        );
        setDetails(response?.data?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [open, userToBeEdited]);

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Box sx={{ ...styles.box1Style, py: 1 }}>
          <Typography variant="h6" sx={styles.titleStyle}>
            Edit User
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
        <Box sx={styles.transitionStyles}>
          <EditUser
            fetchUsersList={fetchUsers}
            data={details?.[0]}
            userToBeEdited={userToBeEdited}
            handleClose={handleClose}
          />
        </Box>
      </Paper>
    </Modal>
  );
};

export default EditUserModal;
