import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";
import InputBox from "../Common/InputBox";
import SelectBox from "../Common/SelectBox";
import YearPicker from "../Common/YearPicker";

const validationSchema = yup.object({
  companyName: yup
    .string("Enter your Account Name")
    .required("Account Name is required"),
  countryName: yup
    .string("Select a Billing Country")
    .required("Billing Country is required"),
  fiscalYear: yup
    .number("Select a Fiscal Year")
    .typeError("Fiscal Year must be a number")
    .required("Fiscal Year is required"),
  parentCompanyId: yup.string().nullable(), // Optional field
  annualRevenue: yup
    .number("Enter Annual Revenue")
    .typeError("Annual Revenue must be a number")
    .positive("Annual Revenue must be positive")
    .nullable(), // Optional field
  employeesCount: yup
    .number("Enter Number of Employees")
    .typeError("Number of Employees must be a number")
    .positive("Number of Employees must be positive")
    .integer("Number of Employees must be an integer")
    .nullable(), // Optional field
  phone: yup
    .string("Enter your Phone Number")
    .matches(
      /^[0-9]{10}$/,
      "Phone Number must be exactly 10 digits"
    )
    .nullable(), // Optional field
  email: yup
    .string("Enter your Email Address")
    .email("Enter a valid Email Address")
    .nullable(), // Optional field
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
    width: 700,
    maxHeight: "90vh",
    overflowY: "auto",
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer 10+
    "&::-webkit-scrollbar": {
      display: "none", // For WebKit browsers like Chrome and Safari
    },
    padding: "10px"
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
    // borderBottom: "1px solid #E4E4E4",
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
};

const CompanyModal = ({ open, handleClose, getData }) => {
  const [countriesObj, setCountriesObj] = useState([]);
  const [countries, setCountries] = useState([]);
  const { clientList } = useContext(FilterListContext);

  useEffect(() => {
    const countryArray = countriesObj.map(co => co?.countryName);
    setCountries(countryArray);
    
  }, [countriesObj]);

  const getCountries = async (signal) => {
    const url = `${BaseURL}/api/v1/company/get-country-data`;
    try {
      const response = await axios.get(url, {
        ...Authorization_header(),
        signal, // Pass signal to abort if needed
      });
      
      setCountriesObj(response?.data?.data);
    } catch (err) {
      if (axios.isCancel(err)) {
      } else {
        console.error("Error fetching countries:", err);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getCountries(controller.signal);

    return () => controller.abort(); // Cleanup on unmount
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      parentCompanyId: "",
      countryName: "",  // Renamed from billingCountry
      annualRevenue: "",
      employeesCount: "",
      fiscalYear: "",   // Renamed from year
      phone: "",
      email: "",
      sequence: "",     // To store the sequence from countriesObj
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Find the matching country object from countriesObj
      const selectedCountry = countriesObj.find(co => co?.countryName === values.countryName);
      

      // Add sequence if country is found
      const updatedValues = {
        companyName: values.companyName,
        parentCompanyId: values.parentCompanyId,
        countryName: values.countryName,  // Renamed from billingCountry
        annualRevenue: values.annualRevenue,
        employeesCount: values.employeesCount,
        fiscalYear: values.fiscalYear,    // Renamed from year
        phone: values.phone,
        email: values.email,
        sequence: selectedCountry ? selectedCountry.sequence : null, // Add sequence or null
      };

       // Debugging
      addCompany(updatedValues);
    },
  });


  useEffect(() => {
    if (formik.values.countryName) {
      const selectedCountry = countriesObj.find(
        (co) => co.countryName === formik.values.countryName
      );
      if (selectedCountry) {
        formik.setFieldValue("currency", selectedCountry.currency || "");
        formik.setFieldValue("currencySymbol", selectedCountry.currencySymbol || "");
      }
    }
  }, [formik.values.countryName, countriesObj]);

  const currentYear = new Date().getFullYear();

  

  const addCompany = async (values) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/create-company`,
            values,
            Authorization_header()
          );
          if (response.data.success) {
            handleClose();
            getData();
            formik.resetForm();
          }
          return response;
        } catch (error) {
          throw error.response ? error.response : new Error("Network or server error");
        }
      })(),
      {
        loading: "Adding New Account...",
        success: "Account added successfully",
        error: (error) =>
          error?.data?.error?.message || "Failed to add new Account.",
      }
    );
  };

  const handleModalClose = () => {
    formik.resetForm(); // Clear form fields and errors
    handleClose(); // Trigger parent `handleClose`
  };

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          Add New Account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={styles.flexBox}>
            <Typography sx={{ fontWeight: 600, px: 2 }}>General</Typography>
            <Box sx={styles.flexBoxItem}>
              <InputBox
                label="Account Name"
                name="companyName"
                formik={formik}
                required={true}
              />
              <SelectBox
                label="Parent Account"
                name="parentCompanyId"
                formik={formik}
                selectOptions={clientList?.map((item) => ({
                  id: item?.companyId,
                  name: item?.companyName,
                }))}
                required={false}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="Billing Country"
                name="countryName"
                formik={formik}
                required={true}
                selectOptions={countries?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />

              <InputBox
                label="Phone"
                name="phone"
                formik={formik}
                type="tel"
                inputProps={{ pattern: "[0-9]{10}" }}
              />
            </Box>
          </Box>
          <Box sx={styles.flexBox}>
            <Box sx={styles.flexBoxItem}>
              <YearPicker label="Fiscal Year" startYear={currentYear - 5} endYear={currentYear + 1} name="fiscalYear" formik={formik} required={true} />
              <InputBox
                label="Email Address"
                name="email"
                formik={formik}
                type="email"
                required={false}
              />

            </Box>
          </Box>
          <Box sx={styles.buttonBox}>
            <Button
              variant="contained"
              sx={styles.buttonStyle}
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={styles.uploadButtonStyle}
            >
              Add Account
            </Button>
          </Box>
        </form>
        <Toaster />
      </Paper>
    </Modal>
  );
};

export default CompanyModal;
