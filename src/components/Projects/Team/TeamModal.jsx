import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  InputBase,
  InputLabel,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { default as React } from "react";
import * as yup from "yup";
import InputBox from "../../Common/InputBox";
import { BaseURL } from "../../../constants/Baseurl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Authorization_header } from "../../../utils/helper/Constant";

const validationSchema = yup.object({
  firstName: yup
    .string("Enter your First Name")
    .required("First Name is required"),
  lastName: yup
    .string("Enter your Last Name")
    .required("Last Name is required"),
  role: yup.string("Enter your Team Role").required("Team Role is required"),
  email: yup
    .string("Enter your Email")
    .required("Email is required")
    .email("Enter a valid email"),
});
const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 680,
    maxHeight: "90vh",
    overflowY: "auto",
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer 10+
    "&::-webkit-scrollbar": {
      display: "none", // For WebKit browsers like Chrome and Safari
    },
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
    // borderBottom: "1px solid #E4E4E4",
  },
  flexBoxItem: {
    display: "flex",
    // justifyContent: "space-between",
    mt: 1,
    gap: 3,
    px: 2,
  },
  label: {
    color: "#404040",
    fontSize: "13px",
    mb: -2.5,
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
  topBoxStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    py: 1,
  },
};

const TeamModal = ({ open, handleClose, fetchTeamMembers, details }) => {
  const addTeamFormik = useFormik({
    initialValues: {
      existingContact: false,
      contactId: null,
      role: null,
      sourceEmployeeId: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      address: null,
      city: null,
      country: null,
      employeeTitle: null,
      description: null,
      status: null,
      language: null,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      addTeamMember(values);
    },
  });
  const addTeamMember = async (values) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${details?.companyId
            }/${details?.projectId}/add-team-member`,
            values, Authorization_header()
          );
          if (response.data.success) {
            handleClose();
            fetchTeamMembers();
          }
          return response;
        } catch (error) {
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Adding New Team Member...",
        success: (response) =>
          response.data.message || "Team Member added successfully",
        error: (response) =>
          response.data.error.message || "Failed to adding new team member.",
      }
    );
  };
  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Box
          sx={{
            ...styles.topBoxStyle,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={styles.titleStyle}>
            Add New Team Member
          </Typography>
          <CancelIcon
            sx={{
              color: "#9F9F9F",
              cursor: "pointer",
              "&: hover": { color: "#FD5707" },
            }}
            onClick={handleClose}
          />
        </Box>
        <form onSubmit={addTeamFormik.handleSubmit}>
          <Box sx={styles.flexBox}>
            <Typography sx={{ fontWeight: 600, px: 2 }}>General</Typography>
            <Box sx={styles.flexBoxItem}>
              <InputBox
                label="First Name"
                name="firstName"
                formik={addTeamFormik}
                required={true}
              />
              <InputBox
                label="Last Name"
                name="lastName"
                formik={addTeamFormik}
                required={true}
              />
              <InputBox
                label="Team Role"
                name="role"
                formik={addTeamFormik}
                required={true}
              />
              {/* <InputBox
                label="Pick a Contact"
                name="pickContact"
                formik={addTeamFormik}
                required={true}
              /> */}
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              {/* <InputBox
                label="Company"
                name="companyName"
                formik={addTeamFormik}
                required={true}
              /> */}
              <InputBox
                label="Title"
                name="employeeTitle"
                formik={addTeamFormik}
              />
              <InputBox
                label="Email Address"
                name="email"
                formik={addTeamFormik}
                required={true}
              />
              <InputBox
                label="Preferred Language"
                name="language"
                formik={addTeamFormik}
              />
            </Box>
          </Box>
          {/* Contact */}
          <Box sx={styles.flexBox}>
            <Typography sx={{ fontWeight: 600, px: 2 }}>Contact</Typography>
            <Box sx={styles.flexBoxItem}>
              <InputBox label="Phone" name="phone" formik={addTeamFormik} />
              <InputBox
                label="Address Line"
                name="address"
                formik={addTeamFormik}
              />
              <InputBox label="City" name="city" formik={addTeamFormik} />
            </Box>
            <Box sx={styles.flexBoxItem}>
              <InputBox label="State" name="state" formik={addTeamFormik} />
              <InputBox label="Country" name="country" formik={addTeamFormik} />
              <InputBox label="Zip Code" name="zip" formik={addTeamFormik} />
            </Box>
          </Box>
          <Box sx={styles.flexBox}>
            <Typography sx={{ fontWeight: 600, px: 2 }}>
              Additional Details
            </Typography>
            <Box sx={{ ...styles.flexBoxItem, flexDirection: "column" }}>
              <InputLabel sx={styles.label}>Description</InputLabel>
              <InputBase
                multiline
                rows={2}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #E4E4E4",
                  pl: 1,
                  mb: 0.5,
                }}
                name="description"
                value={addTeamFormik.values.description}
                onChange={addTeamFormik.handleChange}
              />
            </Box>
          </Box>
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
              type="submit"
              sx={styles.uploadButtonStyle}
            >
              Add New Team Member
            </Button>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default TeamModal;
