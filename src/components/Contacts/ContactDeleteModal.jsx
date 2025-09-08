import WarningIcon from "@mui/icons-material/Warning";
import { Box, Modal, Paper, Typography } from "@mui/material";
import React from "react";
import FilledButton from "../button/FilledButton";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 400,
  },
  titleStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    py: 1,
    display: "flex",
    alignItems: "center",
  },
  buttonStyle: {
    mr: 1,
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#9F9F9F",
    "&:hover": { backgroundColor: "#9F9F9F" },
    fontSize: "13px",
  },
  uploadButtonStyle: {
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#FD5707",
    "&:hover": { backgroundColor: "#FD5707" },
    fontSize: "13px",
  },
  modalStyle: {
    display: "flex",
  },
  buttonBox: {
    // mt: 1,
    display: "flex",
    justifyContent: "flex-end",
    px: 2,
    mb: 2,
    gap: "10px",
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
    gap: 2,
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
};

const ContactDeleteModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          <WarningIcon sx={{ color: "#FD5707", mr: 0.5, fontSize: "17px" }} />
          Delete Contact
        </Typography>
        <Typography sx={{ px: 2, color: "#404040", fontSize: "13px" }}>
          This action will delete the contact and its related data permanently.
          Are you sure you want to delete this contact?
        </Typography>

        <Box sx={styles.buttonBox}>
          <FilledButton
            btnname={"Cancel"}
            onClick={handleClose}
            color={"#9F9F9F"}
            Icon={<></>}
          />
          <FilledButton
            btnname={"Delete Contact"}
            onClick={handleClose}
            color={"#FD5707"}
            Icon={<></>}
            width="150px"
          />
        </Box>
      </Paper>
    </Modal>
  );
};

export default ContactDeleteModal;
