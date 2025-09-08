import InputBox from "../../Common/InputBox";
import { Box, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BaseURL } from "../../../constants/Baseurl";
import { Authorization_header } from "../../../utils/helper/Constant";

const ResetPassword = () => {
  const validationSchema = yup.object({
    oldPassword: yup
      .string("Enter your old password")
      .required("Old Password is required"),
    newPassword: yup
      .string("Enter your new password")
      .required("new password is required"),
    confirmNewPassword: yup
      .string("Confirm your new password")
      .required("confirm new password is required"),
  });

  const resetPasswordFormik = useFormik({
    initialValues: {
      oldPassword: "",
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
          const email = JSON.parse(localStorage.getItem("role"))?.userInfo
            ?.email;
          const response = await axios.post(
            `${BaseURL}/api/v1/auth/reset-password`,
            {
              email,
              password: values.oldPassword,
              newPassword: values.newPassword,
              confirmNewPassword: values.confirmNewPassword,
            }
          );
          if (response.status) {
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
        loading: "Loading...",
        success: (response) =>
          response.data.message || "Password updated successfully",
        error: (response) =>
          response.data?.error?.message || "Failed to change password.",
      }
    );
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

  const styles = {
    tabContainer: {
      display: "flex",
      width: "98%",
      mx: "auto",
      gap: "20px",
    },
    buttonStyle2: {
      textTransform: "capitalize",
      borderRadius: "20px",
      backgroundColor: "#9F9F9F",
      mr: 2,
      "&:hover": {
        backgroundColor: "#9F9F9F",
      },
      whiteSpace: "nowrap",
    },
    buttonStyle: {
      textTransform: "capitalize",
      borderRadius: "20px",
      backgroundColor: "#00A398",
      mr: 2,
      "&:hover": {
        backgroundColor: "#00A398",
      },
      whiteSpace: "nowrap",
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
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      borderBottom: "2px solid #ddd",
      padding: "16px",
      marginBottom: "15px",
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
  return (
    <>
      <Box sx={styles.boxStyle}>
        <Typography sx={{ fontSize: "23px", fontWeight: "500" }}>
          Reset Password
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            sx={styles.buttonStyle}
            type="submit"
            onClick={resetPasswordFormik.handleSubmit}
          >
            Update password
          </Button>
          <button> </button>
        </Box>
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <InputBox
          label="Old Password"
          name="oldPassword"
          formik={resetPasswordFormik}
        />
        <InputBox
          label="New Password"
          name="newPassword"
          formik={resetPasswordFormik}
        />
        <InputBox
          label="Confirm New Password"
          name="confirmNewPassword"
          formik={resetPasswordFormik}
          type="password"
        />
      </Box>
      <Toaster />
    </>
  );
};

export default ResetPassword;
