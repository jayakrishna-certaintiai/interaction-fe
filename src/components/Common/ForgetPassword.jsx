import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { BaseURL } from "../../constants/Baseurl";
import toast, { Toaster } from "react-hot-toast";

const validationSchema = yup.object({
  Email: yup
    .string("Enter your email")
    .required("Email is required")
    .email("Email is not valid"),
  Password: yup
    .string("Enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Password is required"),
  ResetPassword: yup
    .string("Enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Password is required"),
  OTP: yup
    .string("Enter your OTP")
    .required("OTP is required")
});

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: '260px'
  },
  title: {
    fontSize: "25px",
    fontWeight: 500,
    color: "#404040",
  },
  error: {
    color: "red",
  },
  formBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  forgotPassword: {
    textDecoration: "underline",
    fontSize: "13px",
    fontWeight: 500,
    color: "#00A398",
    cursor: "pointer",
  },
  signInButton: {
    color: "white",
    backgroundColor: "#00A398",
    borderRadius: "20px",
    height: "30px",
    width: "70px",
    border: "none",
    cursor: "pointer",
  },
  forgotPasswordButton: {
    color: "white",
    backgroundColor: "#00A398",
    borderRadius: "20px",
    height: "30px",
    width: "150px",
    border: "none",
    cursor: "pointer",
  },
  forgotPasswordEmail: {
    color: "rgb(0, 163, 152)"
  }
};

function ForgetPassword({ setIsLoginView }) {
  const Header = ["Forgot Password", "Enter OTP"];
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [step, setStep] = useState(0);
  const formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
      ResetPassword: "",
      OTP: ""
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  const intiateOTP = () => {
    toast.promise(
      (async () => {
        try {
          // initiate otp
          let response = await axios.post(`${BaseURL}/api/v1/auth/forgot-password`, {
            email: formik.values.Email
          });
          setStep(1)
          return response
        } catch (error) {
          console.error(
            "Error eith OTP initiation for forgot Password",
            error.response?.data || "Something went wrong"
          );
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Initiated password change. Check you mail for OTP",
        success: (response) => response.data.message || "Password Change Initialted",
        error: (response) => {
          return response.data?.error?.message || "Failed to Change Password."
        }
      }
    );

  }


  const handleFormSubmit = async (values) => {
    toast.promise(
      (async () => {
        try {
          // check password and confirm password.
          if (values.Password !== values.ResetPassword) {
            throw new Error("Password and reset Password doesn't match")
          }
          // check otp
          const response = await axios.post(`${BaseURL}/api/v1/auth/verify-otp`, {
            inputedOtp: parseInt(values.OTP),
            email: values.Email,
            newPassword: values.Password
          });
          setIsLoginView(true);
          return response
        } catch (error) {
          console.error(
            "Forgot Password error, something went wrong",
            error.response?.data || "Something went wrong"
          );
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Password Change",
        success: (response) => response.data.message || "Password Change Successful",
        error: (response) => {
          return response.data?.error?.message || "Failed to Change Password."
        }
      }
    );
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowResetPassword = () => {
    setShowResetPassword(!showResetPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    formik.setFieldValue("Password", e.target.value);
  };

  const handleResetPasswordChange = (e) => {
    setResetPassword(e.target.value);
    formik.setFieldValue("ResetPassword", e.target.value);
  };

  const renderSteps = (step) => {
    if (step === 0) {
      return (
        <>
          <div className="form-group">
            <div>
              Enter the email address associated with your Certainti account.
            </div>
          </div>
          <div className="form-group">
            <div className="label">Email Address</div>
            <FormControl fullWidth>
              <InputBase
                fullWidth
                type="text"
                className="input-border"
                placeholder="enter email address"
                name="Email"
                value={formik.values.Email}
                onChange={formik.handleChange}
                variant="standard"
              />
              {formik.touched.Email && Boolean(formik.errors.Email) ? (
                <p style={{ color: "red" }}>
                  {formik.touched.Email && formik.errors.Email}
                </p>
              ) : null}
            </FormControl>
          </div>
          <div className="form-btn" style={styles.formBtn}>
            <div
              style={styles.forgotPassword}
              onClick={
                (e) => setIsLoginView(true)
              }
            >
              Back to SignIn
            </div>
            <button
              style={styles.signInButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                intiateOTP()
              }}
            >
              Continue
            </button>
          </div>
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          <div className="form-group">
            <div className="label">
              Enter the OTP received on
              <span style={styles.forgotPasswordEmail}>{` ${formik.values.Email}`}</span>
            </div>
          </div>
          <div className="form-group">
            <div className="label">OTP</div>
            <FormControl fullWidth>
              <InputBase
                fullWidth
                type="text"
                className="input-border"
                placeholder="enter OTP"
                name="OTP"
                value={formik.values.OTP}
                onChange={formik.handleChange}
                variant="standard"
              />
            </FormControl>
          </div>
          <div className="form-group">
            <div className="label">Password</div>
            <FormControl fullWidth>
              <InputBase
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="enter password"
                name="Password"
                className="input-border"
                value={password}
                onChange={handlePasswordChange}
                variant="standard"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                key={showPassword ? "visible" : "hidden"}
              />
              {formik.touched.Password && Boolean(formik.errors.Password) ? (
                <p style={styles.error}>
                  {formik.touched.Password && formik.errors.Password}
                </p>
              ) : null}
            </FormControl>
          </div>
          <div className="form-group">
            <div className="label">Confirm Password</div>
            <FormControl fullWidth>
              <InputBase
                fullWidth
                type={showResetPassword ? "text" : "password"}
                placeholder="Re-enter password"
                name="ResetPassword"
                className="input-border"
                value={resetPassword}
                onChange={handleResetPasswordChange}
                variant="standard"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowResetPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showResetPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                key={showPassword ? "visible" : "hidden"}
              />
              {formik.touched.Password && Boolean(formik.errors.Password) ? (
                <p style={styles.error}>
                  {formik.touched.Password && formik.errors.Password}
                </p>
              ) : null}
            </FormControl>
          </div>
          <div className="form-btn" style={styles.formBtn}>
            <div style={styles.forgotPassword} onClick={(e) => setStep(0)}>
              Change Email
            </div>
            <button
              style={styles.forgotPasswordButton}
              type="submit"
            >
              Change Password
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>{Header[step]}</div>
      <form onSubmit={formik.handleSubmit}>{renderSteps(step)}</form>
      <Toaster />
    </div>
  );
}

export default ForgetPassword;
