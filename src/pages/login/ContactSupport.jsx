import React, { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { InputBase, FormControl } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { BaseURL, NewInstance } from "../../constants/Baseurl";
import axios from "axios";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "1rem",
        fontWeight: 700,
        color: "black",
        marginLeft: "-8px",
        marginBottom: "0%",
    },
    instance: {
        fontSize: "1.2rem",
        fontWeight: 100,
        color: "#A0A0A0",
        paddingBottom: "8px",
        marginTop: "-40px",
        letterSpacing: "4px",
    },
    formBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    submitButton: {
        color: "black",
        backgroundColor: "#ffdcbf",
        borderRadius: "20px",
        height: "35px",
        width: "100%",
        border: "none",
        cursor: "pointer",
        marginLeft: "-0.5%",
    },
    error: {
        color: "red",
    },
};

const validationSchema = yup.object({
    Email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required"),
    // phoneNumber: yup
    //     .string("Enter your phone number")
    //     .required("Phone number is required"),
    helpRequest: yup
        .string("Enter your query number")
        .required("Query is required")
});

const ContactSupports = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            Email: "",
            phoneNumber: "",
            helpRequest: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleFormSubmit(values);
        },
    });

    const handleFormSubmit = async (values) => {
        try {
            const response = await axios.post(`${BaseURL}/api/v1/auth/contact-support`, {
                email: values.Email,
                phone: values.phoneNumber,
                content: values.helpRequest,
            });
            const msgId = response?.data?.data?.messageId;
            const msg = response?.data?.message;

            if (msgId === 1) {
                setError(null);
                // console.log('Navigating to Thank You page');
                navigate('/thank-you');
            } else {
                setError(msg);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Server Error");
        }
    };

    return (
        <div style={styles.container}>
            {NewInstance && <div style={styles.instance}>Instance: {NewInstance}</div>}

            <div style={styles.title}>
                <Link to="/login">
                    <ArrowBackIcon style={{ color: "#FD5707", fontWeight: 700, height: "18px" }} />
                </Link>
                Contact Support
            </div>
            <form
                onSubmit={formik.handleSubmit}
                style={{ maxWidth: '500px', height: "20px", backgroundColor: '#f9f9f9', }}
            >
                <div className="form-group" style={{ marginBottom: '15px', border: '1px solid #ccc', borderRadius: '10px', position: 'relative' }}>
                    <FormControl fullWidth>
                        <InputBase
                            type="text"
                            sx={{ pl: "10px", width: "300px" }}
                            placeholder="Enter email address"
                            name="Email"
                            value={formik.values.Email}
                            onChange={formik.handleChange}
                            variant="standard"
                        />
                    </FormControl>
                    {formik.touched.Email && formik.errors.Email && (
                        <p style={{ ...styles.error, position: 'absolute', top: '100%', left: '10px', marginTop: '1px' }}>
                            {formik.errors.Email}
                        </p>
                    )}
                </div>

                <div className="form-group" style={{ marginBottom: '15px', border: '1px solid #ccc', borderRadius: '10px', position: 'relative' }}>
                    <FormControl fullWidth>
                        <InputBase
                            type="text"
                            sx={{ pl: "10px" }}
                            placeholder="Enter phone number"
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            variant="standard"
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                            <p style={{ ...styles.error, position: 'absolute', top: '100%', left: '10px', marginTop: '1px' }}>
                                {formik.errors.phoneNumber}</p>
                        ) : null}
                    </FormControl>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <FormControl fullWidth>
                        <textarea
                            style={{
                                width: '100%',
                                height: '100px',
                                padding: '10px',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                overflowY: 'auto',
                                resize: 'none'
                            }}
                            placeholder="How can I help you?"
                            name="helpRequest"
                            value={formik.values.helpRequest}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.helpRequest && formik.errors.helpRequest ? (
                            <p style={{ ...styles.error, position: 'absolute', top: '100%', left: '10px', marginTop: '1px' }}>
                                {formik.errors.helpRequest}</p>
                        ) : null}
                    </FormControl>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                <div className="form-btn" style={{ ...styles.formBtn, paddingTop: "1em" }}>
                    <button type="submit" style={styles.submitButton}>
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactSupports;
