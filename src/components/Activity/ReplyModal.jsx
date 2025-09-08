import React from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  Paper,
  InputBase,
} from "@mui/material";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px 20px 0px 0px",
    margin: "auto",
    maxWidth: "90%",
    width: 400,
    position: "absolute",
    right: "2%",
    bottom: "0%",
    transform: "translate(-0%, -0%)",
  },
  titleStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    py: 1,
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
    // mt: 1,
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
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #E4E4E4",
    pl: 1,
    mb: 0.5,
    width: "300px",
  },
};

const ReplyModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          Interaction Reply
        </Typography>
        <div
          style={{
            display: "flex",
            padding: "0 20px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{fontSize:"13px", fontWeight:"600"}}>CC</div>
          <div>
            <InputBase sx={styles.inputBase} />
          </div>
        </div>
        <textarea
          rows={7}
          placeholder="Write a message"
          style={{
            width: "90%",
            margin: "auto",
            border: "1px solid #E4E4E4",
            padding: "10px",
            borderRadius: "10px",
          }}
        />
        <Box sx={styles.buttonBox}>
          <Button
            variant="contained"
            sx={styles.buttonStyle}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={styles.uploadButtonStyle}
            // onClick={handleAddContact}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ReplyModal;
