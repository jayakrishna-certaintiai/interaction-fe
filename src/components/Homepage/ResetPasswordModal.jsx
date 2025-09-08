import React from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  Paper,
  InputBase,
} from "@mui/material";
import InputBox from "../Common/InputBox";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import toast, { Toaster } from "react-hot-toast";
import { Authorization_header } from "../../utils/helper/Constant";

const validationSchema = yup.object({
  password: yup
    .string("Enter your old password")
    .required("Old Password is required"),
  newPassword: yup
    .string("Enter your new password")
    .required("new password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
  confirmNewPassword: yup
    .string("Enter your new password")
    .required("Confirm new password is required")
    .oneOf(
      [yup.ref("newPassword")],
      "The new password and confirmation password do not match."
    ),
});

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "20px",
    margin: "auto",
    width: 300,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
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

const ResetPasswordModal = ({ open, handleClose }) => {
  const { authState, setAuthState } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      email: authState?.userInfo?.email,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {

      handleResetFormSubmit(values);
    },
  });

  const handleResetFormSubmit = async (values) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/auth/reset-password`,
            values
          );
          if (response.status) {
            updateAuthAndLocalStorage();
            handleClose();
            updateIsPassResetRequired();
          }
          return response;
        } catch (error) {
          console.error(
            "Login error",
            error.response?.data || "Something went wrong"
          );
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Updating new password...",
        success: (response) =>
          response.data.message || "Password updated successfully",
        error: (response) =>
          response.data?.error?.message || "Failed to change password.",
      }
    );
  };

  const updateAuthAndLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("role"));
    const updatedJson = {
      ...data,
      isLoggedIn: data?.isLoggedIn,
      userInfo: {
        ...data?.userInfo,
        isPassResetRequired: 0,
      },
      tokens: data?.tokens,
      rolesInfo: data?.rolesInfo,
    };

    setAuthState(updatedJson);
    localStorage.setItem("role", JSON.stringify(updatedJson));
  };

  const updateIsPassResetRequired = async () => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.put(
            `${BaseURL}/api/v1/users/${localStorage.getItem(
              "userid"
            )}/edit-user`,
            { isPassResetRequired: 0 }
          );
          return response;
        } catch (error) {
          console.error(
            "error",
            error.response?.data || "Something went wrong"
          );
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Updating user deatils...",
        success: (response) =>
          response.data.message || "User deatils updated successfully",
        error: (response) =>
          response.data?.error?.message || "Failed to change password.",
      }
    );
  };
  return (
    <Modal open={open || false} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6" sx={styles.titleStyle}>
            Reset Password
          </Typography>
          <Box sx={{ p: 2 }}>
            <InputBox label="Old Password" name="password" formik={formik} />
            <InputBox label="New Password" name="newPassword" formik={formik} />
            <InputBox
              label="Confirm New Password"
              name="confirmNewPassword"
              formik={formik}
              type="password"
            />
          </Box>
          <Box sx={styles.buttonBox}>
            <Button
              variant="contained"
              sx={styles.uploadButtonStyle}
              type="submit"
            >
              Reset
            </Button>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default ResetPasswordModal;
