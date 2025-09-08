import React from "react";
import { Modal, Button, Box, Typography, Paper } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Authorization_header } from "../../utils/helper/Constant";

const validationSchema = yup.object({
  notes: yup.string("Enter your Note here").required("Note is required"),
});

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: 3,
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

const AddNoteModal = ({ open, handleClose, comId }) => {
  const addNoteFormik = useFormik({
    initialValues: {
      companyId: comId,
      relatedTo: "account",
      relationId: comId,
      notes: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {

      addNote(values);
    },
  });

  const addNote = async (values) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/notes/${localStorage.getItem(
              "userid"
            )}/${comId}/add-new-note`,
            values, Authorization_header()
          );

          if (response.data.success) {
            handleClose();
          }
          return response;
        } catch (error) {
          console.error(error);
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Adding Notes...",
        success: (response) =>
          response.data.message || "Notes added successfully",
        error: (response) =>
          response.data.error.message || "Failed to add notes.",
      }
    );
  };
  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          Add New Note
        </Typography>
        <form
          onSubmit={addNoteFormik.handleSubmit}
          style={{ margin: "auto", width: "90%" }}
        >
          <textarea
            name="notes"
            rows={7}
            style={{
              border: "1px solid #E4E4E4",
              padding: "5px",
              borderRadius: "10px",
            }}
            value={addNoteFormik.values.notes}
            onChange={addNoteFormik.handleChange}
            onBlur={addNoteFormik.handleBlur}
          />
          {addNoteFormik.touched.notes && addNoteFormik.errors.notes ? (
            <div style={{ color: "red", marginTop: "0.5rem" }}>
              {addNoteFormik.errors.notes}
            </div>
          ) : null}

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
              type="submit"
            >
              Add Note
            </Button>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default AddNoteModal;
