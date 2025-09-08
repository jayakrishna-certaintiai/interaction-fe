import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  Box,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { BaseURL, NewInstance } from "../../constants/Baseurl";
import { useAuthContext } from "../../context/AuthProvider";
import OtpInput from "react-otp-input";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SetUp2faStep from "../../pages/login/SetUp2faStep";
import toast, { Toaster } from "react-hot-toast";
// import { NotificationContext } from "../../context/NotificationContext";
import { FilterListContext } from "../../context/FiltersListContext";
import { companyInstance } from "../../constants/Baseurl";
import { color } from "highcharts";

const validationSchema = yup.object({
  Email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  Password: yup
    .string("Enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Password is required"),
});

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 500,
    color: "#404040",
    paddingBottom: "15px",
    fontFamily: "Poppins, sans-serif",
  },
  instance: {
    fontSize: "1.2rem",
    fontWeight: 100,
    color: "#A0A0A0",
    paddingBottom: "8px",
    marginTop: "-40px",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: "4px",
  },
  txt: {
    marginBottom: "2%",
  },
  bluetxt: {
    color: "blue",
    marginBottom: "2%",
    fontWeight: 500,
    fontFamily: "Poppins, sans-serif",
  },
  otpInput: {
    height: "1%",
    width: "120%",
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    margin: "0.5% 0 2% 0",
    fontSize: "1.5rem",
    color: "#404040",
    fontFamily: "Poppins, sans-serif",
  },
  anchor: {
    fontWeight: 400, // Initial font weight
    "&:hover": {
      fontWeight: 300,
      textDecoration: "underline",
      fontFamily: "Poppins, sans-serif",
    },
    "&:hover > *": {
      // Increasing specificity
      fontWeight: "300 !important",
      textDecoration: "underline !important",
      fontFamily: "Poppins, sans-serif",
    },
  },
  anchor_hover: {
    color: "#fd5707",
    // textDecoration: "underline",
    fontFamily: "Poppins, sans-serif",
  },
  error: {
    color: "red",
    fontFamily: "Poppins, sans-serif",
  },
  img: {
    display: "block",
    margin: "auto",
  },
  formBtn: {
    // display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1rem",
    marginBottom: "2rem",
    fontFamily: "Poppins, sans-serif",
    width: "97%",
  },
  forgotPassword: {
    textDecoration: "underline",
    fontSize: "13px",
    fontWeight: 500,
    color: "#FD5707",
    cursor: "pointer",
    marginTop: "-1.5%",
    marginLeft: "-55%",
    fontFamily: "Poppins, sans-serif",
  },
  contactSupport: {
    textDecoration: "underline",
    fontSize: "13px",
    fontWeight: 500,
    color: "#00A398",
    cursor: "pointer",
    marginTop: "-4.9%",
    marginLeft: "50%",
    fontFamily: "Poppins, sans-serif",
  },
  signInButton: {
    // color: "white",
    color: "black",
    backgroundColor: "#ffdcbf",
    // backgroundColor: "#00A398",
    borderRadius: "20px",
    height: "35px",
    width: "95%",
    border: "none",
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
  },
  submitButton: {
    color: "white",
    backgroundColor: "#00A398",
    borderRadius: "20px",
    height: "30px",
    width: "",
    border: "none",
    cursor: "pointer",
    margin: "2% 75%",
    fontFamily: "Poppins, sans-serif",
  },
};

function SignIn({ setIsLoginView }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const { login, setAuthState } = useAuthContext();
  // const { fetchAlertData } = useContext(NotificationContext);
  const { parentFunction } = useContext(FilterListContext);
  const navigate = useNavigate();
  const [loginValues, setLoginValues] = useState("");
  const [authCode, setAuthCode] = React.useState("");
  const [islogin, setIslogin] = useState(false);
  const [is2FaEnable, setIs2FaEnable] = useState(true);
  const [authError, setAuthError] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [reset2FaPage, setReset2FaPage] = useState(false);
  const [emailOtpPage, setEmailOtpPage] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState(null);
  const [cipher, setCipher] = useState("");
  const [verifyUser, setVerifyUser] = useState(false);
  const [resetTwoFa, setResetTwoFa] = useState(false);

  const handleAuthCode = (newValue) => {
    setAuthCode(newValue);
  };
  const formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoginValues(values);
      handleFormSubmit(values);
    },
  });

  const handleCorporateLogin = () => {
    const tenantName = process.env.REACT_APP_AZURE_TENANT_NAME; // Your tenant name
    const policyName = process.env.REACT_APP_AZURE_POLICY_NAME; // Your user flow
    const clientId = process.env.REACT_APP_AZURE_CLIENT_ID; // Your Client ID
    const redirectUri = process.env.REACT_APP_AZURE_REDIRECT_URI; // Your redirect URI
    const scope = process.env.REACT_APP_AZURE_SCOPE; // Scopes
    const nonce = process.env.REACT_APP_AZURE_NONCE; // Use a generated nonce for security
    const responseType = process.env.REACT_APP_AZURE_RESPONSE_TYPE; // Response type

    // Construct the Azure AD B2C login URL
    const azureLoginUrl = `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${policyName}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&nonce=${nonce}&prompt=login`;

    // Redirect to Azure AD B2C login page
    window.location.href = azureLoginUrl;
  };

  const handleVerify = async () => {
    toast.loading("Verifying...");
    if (authCode.toString().length < 6) {
      toast.dismiss();
      setAuthError("Please enter the authentication code.");
      return;
    }
    try {
      const response = await axios.post(`${BaseURL}/api/v1/auth/verify-otp`, {
        email: loginValues.Email,
        password: loginValues.Password,
        totp: authCode,
        verifyTotp: true,
      });
      if (response.data.success) {
        const { rolesInfo, userInfo, tokens } = response?.data?.data;
        login();
        localStorage.setItem(
          "userName",
          userInfo?.firstName + " " + userInfo?.lastName
        );
        localStorage.setItem("userid", userInfo?.userId);
        localStorage.setItem("tokens", JSON.stringify(tokens));
        localStorage.setItem(
          "role",
          JSON.stringify({
            isLoggedIn: true,
            userInfo,
            tokens,
            rolesInfo,
          })
        );
        setAuthState({
          isLoggedIn: true,
          userInfo,
          tokens,
          rolesInfo,
        });
        navigate("/");
        parentFunction();
        // fetchAlertData();
        toast.dismiss();
      } else {
        toast.dismiss();
        setAuthError(
          "Verification failed. Please check the authentication code."
        );
      }
    } catch (error) {
      console.error("Error occurred while verifying user:", error);
      setAuthError(
        "Error occurred while verifying user. Please try again later."
      );
    }
    toast.dismiss();
  };

  const handleFormSubmit = async (values) => {
    setLoginValues(values);
    toast.loading("Login...");
    try {
      const response = await axios.post(`${BaseURL}/api/v1/auth/login`, {
        email: values.Email,
        password: values.Password,
      });
      const TwofaEnable = response?.data?.data?.TwoFA;
      setIs2FaEnable(response?.data?.data?.TwoFA);
      const isMfaRequired = response?.data?.data?.isMfaRequired;
      if (!isMfaRequired) {
        const { rolesInfo, userInfo, tokens } = response?.data?.data?.data;
        login();
        localStorage.setItem(
          "userName",
          userInfo?.firstName + " " + userInfo?.lastName
        );
        localStorage.setItem("userid", userInfo?.userId);
        localStorage.setItem("tokens", JSON.stringify(tokens));
        localStorage.setItem(
          "role",
          JSON.stringify({
            isLoggedIn: true,
            userInfo,
            tokens,
            rolesInfo,
          })
        );
        setAuthState({
          isLoggedIn: true,
          userInfo,
          tokens,
          rolesInfo,
        });
        navigate("/");
        parentFunction();
        // fetchAlertData();
        toast.dismiss();
      } else {
        if (!TwofaEnable) {
          // setVerifyUser(true);
          await handleOtpSend({ ...values, verifyUser: true });
          setEmailOtpPage(true);
        }
        setIslogin(true);
        // if (response?.data?.data?.success) {
        //   setIslogin(true);
        // }
      }
      toast.dismiss();
    } catch (error) {
      console.error(
        "Login error",
        error.response?.data || "Something went wrong"
      );
      setLoginError("Invalid username or password");
      toast.dismiss();
    }
  };

  const handleReset2Fa = async () => {
    // setResetTwoFa(true);
    await handleOtpSend({ ...loginValues, resetTwoFa: true });
    // startResendTimer();
    // setIs2FaEnable(false);
  };

  const handleOtpSend = async (values) => {
    toast.loading("Otp Sending...");
    startResendTimer();
    setVerifyUser(values.verifyUser || false);
    setResetTwoFa(values.resetTwoFa || false);
    try {
      const response = await axios.post(`${BaseURL}/api/v1/auth/send-otp`, {
        email: values.Email,
        password: values.Password,
        verifyUser: values.verifyUser,
        resetTwoFa: values.resetTwoFa,
      });
      const msgId = response?.data?.data?.messageId;
      const msg = response?.data?.message;
      const resCipher = response?.data?.data?.cipher;
      setCipher(resCipher);

      toast.dismiss();
      if (msgId == 1) {
        setAuthError(null);
        setEmailOtpPage(true);
      } else {
        toast.error("Something error occurred");
        setAuthError(msg);
      }
    } catch {
      setEmailOtpPage(true);
      setAuthError("Server Error");
      toast.dismiss();
    }
  };

  const handleOtpVerify = async () => {
    toast.loading("Verifying...");
    try {
      const response = await axios.post(`${BaseURL}/api/v1/auth/verify-otp`, {
        email: loginValues.Email,
        password: loginValues.Password,
        resetTwoFa: true,
        cipher: cipher,
        otp: otp,
      });
      const msg = response?.data?.message;
      const qrcode = response?.data?.data?.QRCode;
      if (response?.data?.success) {
        setAuthError(null);
        setQrCode(qrcode);
        setEmailOtpPage(false);
        setIs2FaEnable(false);
      } else {
        toast.error("Something error occurred");
        setAuthError(msg);
      }
      toast.dismiss();
    } catch {
      setAuthError("Server Error");
      toast.dismiss();
    }
  };

  const handleOtp = (newValue) => {
    setOtp(newValue);
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    const interval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          setResendDisabled(false);
          return 30;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setPassword(formik.values.Password);
  }, [formik.values.Password]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    formik.setFieldValue("Password", e.target.value);
  };

  return (
    <div style={styles.container}>
      {islogin ? (
        <>
          <div className="form-group">
            {emailOtpPage ? (
              <>
                <div>
                  {/* {is2FaEnable && <ArrowBackIcon style={{ cursor: "pointer" }} onClick={() => setEmailOtpPage(false)} />} */}
                  <ArrowBackIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (is2FaEnable) {
                        setEmailOtpPage(false);
                      } else {
                        navigate("/");
                      }
                    }}
                  />
                </div>
                <div style={styles.title}>Verify Email OTP</div>

                <div className="label">Email OTP</div>
                <OtpInput
                  style={{ border: "1px solid black" }}
                  value={otp}
                  onChange={handleOtp}
                  numInputs={6}
                  renderSeparator={<span></span>}
                  isInputNum={true}
                  shouldAutoFocus={true}
                  inputStyle={{
                    border: "1px solid wheat",
                    borderRadius: "5px",
                    padding: "10px",
                    // backgroundClip: "cian",
                    backgroundColor: "#FAF9F6",
                    padding: "4%",
                    margin: "0.5rem 0.5rem 1rem 0",
                    width: "35%",
                    height: "100%",
                    fontSize: "1rem",
                    color: "#000",
                    fontWeight: "400",
                    caretColor: "blue",
                  }}
                  focusStyle={{
                    border: "1px solid #CFD3DB",
                    outline: "none",
                  }}
                  renderInput={(props) => <input {...props} />}
                />
                <div>
                  <button
                    type="button"
                    disabled={resendDisabled}
                    onClick={() =>
                      handleOtpSend({
                        Email: loginValues.Email,
                        Password: loginValues.Password,
                        verifyUser: verifyUser,
                        resetTwoFa: resetTwoFa,
                      })
                    }
                  >
                    Resend OTP ({resendTimer}s)
                  </button>
                  <button
                    style={styles.submitButton}
                    onClick={() => handleOtpVerify()}
                  >
                    {" "}
                    Submit{" "}
                  </button>
                </div>
                {authError && <div style={{ color: "red" }}>{authError}</div>}
              </>
            ) : (
              <>
                <h3
                  style={{
                    ...styles.title,
                    paddingBottom: "2%",
                    paddingTop: "4%",
                  }}
                >
                  Log in to Certainti.ai
                </h3>
                {!is2FaEnable && <SetUp2faStep {...styles} qrCode={qrCode} />}
                <div style={styles.txt}>
                  Please enter the 6-digit authentication code displayed in your
                  authenticator app.
                </div>
                <div className="label">Authentication code</div>
                <OtpInput
                  style={{ border: "1px solid black" }}
                  value={authCode}
                  onChange={handleAuthCode}
                  numInputs={6}
                  renderSeparator={<span></span>}
                  isInputNum={true}
                  shouldAutoFocus={true}
                  inputStyle={{
                    border: "1px solid wheat",
                    borderRadius: "5px",
                    padding: "10px",
                    // backgroundClip: "cian",
                    backgroundColor: "#FAF9F6",
                    padding: "4%",
                    margin: "0.5rem 0.5rem 1rem 0",
                    width: "35%",
                    height: "100%",
                    fontSize: "1rem",
                    color: "#000",
                    fontWeight: "400",
                    caretColor: "blue",
                  }}
                  focusStyle={{
                    border: "1px solid #CFD3DB",
                    outline: "none",
                  }}
                  renderInput={(props) => <input {...props} />}
                />
                {authError && <div style={{ color: "red" }}>{authError}</div>}
                <div className="form-btn" style={styles.formBtn}>
                  {is2FaEnable && (
                    <div
                      style={styles.forgotPassword}
                      onClick={() => handleReset2Fa()}
                    >
                      Reset Code
                    </div>
                  )}
                  <button style={styles.signInButton} onClick={handleVerify}>
                    {" "}
                    Submit{" "}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={styles.instance}>
            {NewInstance ? `Instance: ${NewInstance || "Development"}` : ""}
          </div>
          <div style={{ ...styles.title, fontFamily: "Poppins" }}>
            Sign in to your account{" "}
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              {/* <div className="label">Email Address</div> */}
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
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle
                        sx={{
                          color: "#ffffff",
                          fontSize: "30px",
                          borderRadius: "80%",
                          backgroundColor: "#87CEEB",
                          padding: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "35px",
                          width: "35px",
                          marginLeft: "-10px",
                        }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    backgroundColor: "#ffffff",
                    fontFamily: "Poppins",
                    height: "3px",
                    borderRadius: "4px",
                    padding: "0 0px",
                    display: "flex",
                    alignItems: "center",
                    width: "91%",
                    "& .MuiInputBase-input": {
                      height: "65%",
                      width: "100%",
                      padding: "4px 8px 5px",
                      // Ensure autofilled inputs have white background
                      ":-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px #ffffff inset",
                        WebkitTextFillColor: "#000000",
                      },
                    },
                  }}
                />
                {formik.touched.Email && Boolean(formik.errors.Email) ? (
                  <p style={{ color: "red" }}>
                    {formik.touched.Email && formik.errors.Email}
                  </p>
                ) : null}
              </FormControl>
            </div>
            <div className="form-group">
              {/* <div className="label">Password</div> */}
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
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{
                          color: "#ffffff",
                          fontSize: "30px",
                          borderRadius: "80%",
                          backgroundColor: "#87CEEB",
                          padding: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "34.5px",
                          width: "35px",
                          marginLeft: "-10px",
                        }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    fontFamily: "Poppins",
                    height: "3px",
                    width: "91%",
                    "& .MuiInputBase-input": {
                      height: "65%",
                      width: "160%",
                      padding: "5px 8px 5px",
                      // Ensure autofilled inputs have white background
                      ":-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px #ffffff inset",
                        WebkitTextFillColor: "#000000",
                      },
                    },
                  }}
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
            <div
              className="form-btn"
              style={{
                ...styles.formBtn,
                display: "flex",
                flexDirection: "column",
                marginLeft: "-10px",
                marginBottom: "10px",
              }}
            >
              <button style={styles.signInButton}>Sign In</button>
            </div>
            {/* <div
              style={{
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                fontFamily: "Poppins, sans-serif",
                marginBottom: "0",
                marginTop: "5px",
                transform: "translateX(-10px)",
              }}
            >
              <span style={{ color: "black" }}>OR</span>
            </div>
            <div
              className="form-btn"
              style={{
                ...styles.formBtn,
                display: "flex",
                flexDirection: "column",
                marginLeft: "-10px",
                marginTop: "5px",
              }}
            >
              <button
                type="button" // Make sure the button type is "button" to prevent form submission
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default form submit action
                  handleCorporateLogin(); // Trigger your corporate login function
                }}
                style={{
                  color: "black",
                  backgroundColor: "rgb(255, 220, 191)",
                  borderRadius: "20px",
                  height: "35px",
                  width: "95%",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Sign in with your work email
              </button>
            </div> */}

            {/* Microsoft Login Button */}
            <div
              className="form-btn"
              style={{
                ...styles.formBtn,
                display: "flex",
                flexDirection: "column",
                marginLeft: "-10px",
                marginTop: "20px",
              }}
            >
              <button
                type="button" // Ensure button type is correct to prevent unintended behavior
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submit
                  handleCorporateLogin(); // Trigger Microsoft login logic
                }}
                style={{
                  color: "black",
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  height: "35px",
                  width: "95%",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft"
                  style={{ width: "20px", height: "20px", marginRight: "10px" }}
                />
                Continue with Microsoft
              </button>
            </div>

            {/* <div
              className="form-btn"
              style={{
                ...styles.formBtn,
                display: "flex",
                flexDirection: "column",
                marginLeft: "-10px",
                marginBottom: "5px",
              }}
            >
              <button style={styles.signInButton}>Sign In</button>
            </div>
            <div
              style={{
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                fontFamily: "Poppins, sans-serif",
                marginBottom: "0",
                marginTop: "5px",
                transform: "translateX(-10px)",
              }}
            >
              <span style={{ color: "black" }}>OR</span>
            </div>
            <div
              className="form-btn"
              style={{
                ...styles.formBtn,
                display: "flex",
                flexDirection: "column",
                marginLeft: "-10px",
                marginTop: "5px",
              }}
            >
              <button
                type="button" // Make sure the button type is "button" to prevent form submission
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default form submit action
                  handleCorporateLogin(); // Trigger your corporate login function
                }}
                style={{
                  color: "black",
                  backgroundColor: "rgb(255, 220, 191)",
                  borderRadius: "20px",
                  height: "35px",
                  width: "95%",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Sign in with your work email
              </button>
            </div> */}

            <div
              className="form-btn"
              style={{
                ...styles.formBtn,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Link to="/login/forgot-password" style={styles.forgotPassword}>
                Forgot Password ?
              </Link>
              <Link to="/login/contact-support" style={styles.contactSupport}>
                Contact Support
              </Link>
            </div>
            {loginError && <p style={styles.error}>{loginError}</p>}
          </form>
        </>
      )}
      <Toaster />
    </div>
  );
}

export default SignIn;
