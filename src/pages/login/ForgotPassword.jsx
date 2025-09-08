import React, { useEffect, useState } from "react";
// import "./forgotPassword.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputBase,
} from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { BaseURL, NewInstance } from "../../constants/Baseurl";
import OtpInput from "react-otp-input";
import axios from "axios";


const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "1.7rem",
        fontWeight: 500,
        color: "#404040",
        marginLeft: "-26px",
        marginBottom: "10%"
    },
    title1: {
        fontSize: "1.3rem",
        fontWeight: 500,
        color: "#404040",
        // marginLeft: "-32px",
        marginTop: "-7.1%"
    },
    newTitle: {
        fontSize: "1.7rem",
        fontWeight: 500,
        color: "#404040",
        // marginLeft: "-26px",
        marginBottom: "8%"
    },
    newTitle1: {
        fontWeight: 600,
        marginTop: "10px"
    },
    instance: {
        fontSize: "1.2rem",
        fontWeight: 100,
        color: "#A0A0A0",
        paddingBottom: "8px",
        marginTop: "-40px",
        letterSpacing: "4px",
    },
    txt: {
        marginBottom: "2%",
    },
    bluetxt: {
        color: "blue",
        marginBottom: "2%",
    },
    otpInput: {
        height: "1%",
        width: "120%",
    },
    header: {
        margin: "0.5% 0 2% 0",
        fontSize: "1.2rem",
    },
    anchor: {
        "&:hover": {
            fontWeight: 300,
            color: "blue",
            textDecoration: "underline",
        },
    },
    error: {
        color: "red",
    },
    img: {
        marginLeft: "-2%",
    },
    formBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    forgotPassword: {
        textDecoration: "underline",
        fontSize: "13px",
        fontWeight: 500,
        color: "#00A398",
        cursor: "pointer",
    },
    submitButton: {
        color: "black",
        backgroundColor: "#ffdcbf",
        borderRadius: "20px",
        height: "35px",
        width: "50%",
        border: "none",
        cursor: "pointer",
        marginLeft: "-0.5%",
        marginTop: "-2%"
    },
    submitButton1: {
        color: "black",
        backgroundColor: "#ffdcbf",
        borderRadius: "20px",
        height: "35px",
        width: "90%",
        border: "none",
        cursor: "pointer",
        marginLeft: "-0.5%",
        marginTop: "-2%"
    },
};

const validationSchemaemail = yup.object({
    Email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required"),
});

const validationSchemaepassword = yup.object({
    Password: yup
        .string("Enter your password")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("Password"), null], "Passwords must match")
        .required("Required"),
});

const ForgotPasswords = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [loginValues, setLoginValues] = useState("");
    const [isOtpSend, setIsOtpSend] = useState(false);
    const [otp, setOtp] = useState("")
    const [otpValid, setOtpValid] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [cipher, setCipher] = useState("");
    const [errorID, setErrorId] = useState(null);
    const [passwordChangeSucess, setPasswordChangeSucess] = useState(false);

    const navigate = useNavigate();
    const handleOtp = (newValue) => {
        setOtp(newValue);
    };

    const formik = useFormik({
        initialValues: {
            Email: "",
            Password: "",
        },
        validationSchema: otpValid ? validationSchemaepassword : validationSchemaemail,
        onSubmit: (values) => {
            setLoginValues(values);
            handleFormSubmit(values);
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickConfirmShowPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        setEmail(formik.values.Email);
    }, [formik.values.Email]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        formik.setFieldValue("Email", e.target.value);
    };

    useEffect(() => {
        setPassword(formik.values.Password);
    }, [formik.values.Password]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        formik.setFieldValue("Password", e.target.value);
    };

    const handleVerify = async () => {
        if (otp.toString().length < 6) {
            setError("Please enter the OTP");
            return;
        } else {
            try {
                const response = await axios.post(`${BaseURL}/api/v1/auth/verify-otp`, {
                    email: email,
                    otp: otp,
                    forgotPassword: true,
                });
                const msgId = response?.data?.data?.messageId;
                const msg = response?.data?.message;
                const resCipher = response?.data?.data?.cipher;
                if (msgId === 1) {
                    setError(null);
                    setIsOtpSend(false);
                    setOtpValid(true);
                    setCipher(resCipher);
                } else {
                    setError(msg);
                    setErrorId(-1);
                }

            } catch {
                setError("Server Error");
                setErrorId(-1);
            }
            return;
        }
    }

    const handleOtpSend = async (values) => {
        try {
            const response = await axios.post(`${BaseURL}/api/v1/auth/send-otp`, {
                email: values.Email,
                forgotPassword: true
            });
            const msgId = response?.data?.data?.messageId;
            const msg = response?.data?.message;
            const resCipher = response?.data?.data?.cipher;
            if (msgId === 1) {
                setError(null);
                setIsOtpSend(true);
                startResendTimer();

            } else {
                setError(msg);
                setErrorId(msgId);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Server Error");
            setErrorId(-1);
        }
    }

    const handleSetNewPassword = async (values) => {
        try {
            const response = await axios.post(`${BaseURL}/api/v1/auth/change-password`, {
                email: values.Email,
                newPassword: values.confirmPassword,
                cipher: cipher
            });
            const msgId = response?.data?.data?.messageId;
            const msg = response?.data?.message;
            if (msgId === 1) {
                setPasswordChangeSucess(true)
                setError(null);
                setResendTimer(3);
                startResendTimer();
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(msg);
                setErrorId(msgId);
            }
        } catch {
            setError("Server Error");
            setErrorId(-1);
        }
    }

    const handleFormSubmit = async (values) => {

        if (!otpValid && !isOtpSend) {
            handleOtpSend(values);
        } else {
            if (otpValid) {
                handleSetNewPassword(values);
            }
        }
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

    return (
        <div style={styles.container}>
            {passwordChangeSucess ?
                <>
                    <div style={{ textAlign: 'center', margin: '50px auto' }}>
                        <span style={{ fontSize: '1.5rem', color: 'green', marginRight: '10px' }}>&#10004;</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'green', display: 'inline-block' }}>
                            Password changed successfully!
                        </p>
                        <p>Redirecting to login page in {resendTimer} seconds...</p>
                    </div>
                </>
                :
                <>
                    {/* <div style={styles.instance}>{NewInstance}</div> */}
                    {!otpValid ?
                        <>
                            {/* <Link to="/login">
                                <ArrowBackIcon />
                            </Link> */}
                            {NewInstance && <div style={styles.instance}>Instance: {NewInstance}</div>}
                            <div style={styles.title}>
                                <Link to="/login">
                                    <ArrowBackIcon style={{ color: "#FD5707" }} />
                                </Link>
                                Forgot Password
                            </div>

                        </>
                        :
                        <div style={styles.newTitle}>Reset Password</div>
                    }
                    <div style={styles.title1}>Enter your register email address.</div>
                    <form onSubmit={formik.handleSubmit}>
                        {!otpValid ?
                            <div className="form-group">
                                {/* <a>Enter your register email address.</a> */}
                                {/* <div className="label">Email Address</div> */}
                                <FormControl>
                                    <InputBase
                                        fullWidth
                                        style={{ width: '300px' }}
                                        type="text"
                                        className="input-border"
                                        placeholder="Enter email address"
                                        name="Email"
                                        value={email}
                                        onChange={formik.handleChange}
                                        variant="standard"
                                        disabled={isOtpSend ? true : false}
                                    />
                                    {formik.touched.Email && Boolean(formik.errors.Email) ? (
                                        <p style={{ color: "red" }}>
                                            {formik.touched.Email && formik.errors.Email}
                                        </p>
                                    ) : null}
                                    {isOtpSend &&
                                        <>
                                            <div style={styles.newTitle1}>OTP</div>
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
                                                    padding: "2%",
                                                    margin: "0.5rem 0.5rem 1rem 0",
                                                    width: "7.2%",
                                                    height: "100%",
                                                    fontSize: "1rem",
                                                    color: "#000",
                                                    fontWeight: "400",
                                                    caretColor: "blue",
                                                    textAlign: "left"
                                                }}

                                                focusStyle={{
                                                    border: "1px solid #CFD3DB",
                                                    outline: "none",
                                                }}
                                                renderInput={(props) => <input {...props} />}
                                            />
                                            <div>
                                                <button type="button" disabled={resendDisabled} onClick={() => handleOtpSend({ Email: email })}>Resend OTP ({resendTimer}s)</button>
                                            </div>
                                            {/* {authError && <div style={{ color: "red" }}>{authError}</div>} */}
                                        </>
                                    }
                                </FormControl>
                            </div>
                            :
                            <>
                                <div className="form-group">
                                    {/* <div className="label">Password</div> */}
                                    <FormControl fullWidth>
                                        <InputBase
                                            fullWidth
                                            style={{ width: '90%' }}
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
                                                        edge="end">
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
                                    {/* <div className="label">Confirm Password</div> */}
                                    <FormControl fullWidth>
                                        <InputBase
                                            fullWidth
                                            style={{ width: '90%' }}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm password"
                                            name="confirmPassword"
                                            className="input-border"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            variant="standard"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickConfirmShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end">
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                            <p style={styles.error}>{formik.errors.confirmPassword}</p>
                                        ) : null}
                                    </FormControl>
                                </div>
                            </>
                        }

                        {error && <p style={styles.error}>{error}</p>}

                        <div className="form-btn" style={styles.formBtn}>
                            {!isOtpSend ?
                                <button style={styles.submitButton1}>{otpValid ? "Submit" : "Continue"}</button>
                                :
                                <button style={styles.submitButton} onClick={() => { handleVerify() }}> Submit </button>
                            }
                        </div>
                    </form>
                </>
            }
        </div>
    );
};

export default ForgotPasswords;

