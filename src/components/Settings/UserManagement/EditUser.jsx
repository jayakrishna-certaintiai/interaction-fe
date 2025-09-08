import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { BaseURL } from "../../../constants/Baseurl";
import { timeZones } from "../../../constants/Timezones";
import { fetchCitiesForStateAndCountry } from "../../../utils/helper/FetchCitiesForStateAndCountry";
import { fetchStatesForCountry } from "../../../utils/helper/FetchStatesForCountry";
import InputBox from "../../Common/InputBox";
import SelectBox from "../../Common/SelectBox";
import { titles } from "../../../constants/Titles";

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
  sectionStyle: { fontWeight: 600, px: 2, cursor: "pointer", mb: -1, pb: 1 },
  formStyle: { maxHeight: "73vh", overflowY: "auto" },
};

const countries = ["United States", "Canada"];

const languages = ["English"];

const userTypes = ["Consultant", "Account"];

const validationSchema = yup.object({
  firstName: yup
    .string("Enter your First Name")
    .required("First Name is required"),
  lastName: yup
    .string("Enter your Last Name")
    .required("Last Name is required"),
});

function EditUser({
  handleClose,
  fetchUsersList,
  data,
  userToBeEdited,
}) {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [detailsVisible2, setDetailsVisible2] = useState(true);
  const [cities, setCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);

  const editContactFormik = useFormik({
    initialValues: {
      firstName: data?.firstName,
      middleName: data?.middleName,
      lastName: data?.lastName,
      email: data?.email,
      employeeTitle: data?.employeeTitle, //
      UserType: data?.UserType,
      roleId: data?.roleId, //
      userPreferedLanguage: data?.userPreferedLanguage,
      userTimezone: data?.userTimezone,
      country: data?.userBaseRegion, //
      state: data?.state, //
      city: data?.city, //
      phone: data?.phone,
      Address: data?.Address, //
      zipcode: data?.zipcode, //
      description: data?.description,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      editContact(values)
        .then(() => {
          editContactFormik.resetForm();
        })
        .catch((error) => {
          console.error("Error editing user:", error);
        });
    },
  });

  useEffect(() => {
    if (editContactFormik.values?.country) {
      fetchStatesForCountry(editContactFormik.values?.country).then(
        (statesArray) => {
          setCountryStates(statesArray);
        }
      );
    }
  }, [editContactFormik.values?.country]);

  useEffect(() => {
    if (editContactFormik.values?.country && editContactFormik.values?.state) {
      fetchCitiesForStateAndCountry(
        editContactFormik.values?.country,
        editContactFormik.values?.state
      ).then((citiesArray) => {
        setCities(citiesArray);
      });
    }
  }, [editContactFormik.values?.country, editContactFormik.values?.state]);

  const editContact = async (values) => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${BaseURL}/api/v1/users/${userToBeEdited}/edit-user`,
      headers: {
        "Content-Type": "application/json",
      },
      data: values,
    };

    axios
      .request(config)
      .then((response) => {
        fetchUsersList();
        handleClose();
        toast.success("User Edited Successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error Editing the User");
      });
  };

  return (
    <>
      <form onSubmit={editContactFormik.handleSubmit} style={styles.formStyle}>
        <Box
          sx={{
            display: "flex",
            overflowY: "scroll",
            flexDirection: "column",
          }}
        >
          <Box sx={styles.flexBox}>
            <Typography sx={styles.sectionStyle}>General</Typography>
            <Box sx={styles.flexBoxItem}>
              <InputBox
                label="First Name"
                name="firstName"
                formik={editContactFormik}
                required={true}
              />
              <InputBox
                label="Middle Name"
                name="middleName"
                formik={editContactFormik}
              />
              <InputBox
                label="Last Name"
                name="lastName"
                formik={editContactFormik}
                required={true}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <InputBox
                label="User Type"
                name="UserType"
                formik={editContactFormik}
                disabled={true}
              />
              <InputBox
                label="User Role"
                name="roleId"
                formik={editContactFormik}
                required={true}
                disabled={true}
              />
              <SelectBox
                label="Title"
                name="employeeTitle"
                formik={editContactFormik}
                selectOptions={titles?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <InputBox
                label="Email Address"
                name="email"
                formik={editContactFormik}
                required={true}
                type="email"
                disabled={true}
              />
              <SelectBox
                label="Preferred Language"
                name="userPreferedLanguage"
                formik={editContactFormik}
                selectOptions={languages?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
              <SelectBox
                label="Time Zone"
                name="userTimezone"
                formik={editContactFormik}
                selectOptions={timeZones?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
            </Box>
          </Box>

          <Box sx={styles.flexBox}>
            <Typography
              sx={styles.sectionStyle}
              onClick={() => setDetailsVisible(!detailsVisible)}
            >
              <ExpandMoreIcon
                sx={{
                  ...styles.expandMoreIcon,
                  transform: detailsVisible ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
              Contact
            </Typography>
            {detailsVisible && (
              <>
                <Box sx={styles.flexBoxItem}>
                  <SelectBox
                    label="Country"
                    name="country"
                    formik={editContactFormik}
                    selectOptions={countries?.map((item) => ({
                      id: item,
                      name: item,
                    }))}
                  />
                  <SelectBox
                    label="State"
                    name="state"
                    formik={editContactFormik}
                    selectOptions={countryStates?.map((item) => ({
                      id: item?.name,
                      name: item?.name,
                    }))}
                  />
                  <SelectBox
                    label="City"
                    name="city"
                    formik={editContactFormik}
                    selectOptions={cities?.map((item) => ({
                      id: item,
                      name: item,
                    }))}
                  />
                </Box>
                <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
                  <InputBox
                    label="Phone"
                    name="phone"
                    formik={editContactFormik}
                    type="tel"
                    inputProps={{ pattern: "[0-9]{10}" }}
                  />
                  <InputBox
                    label="Address Line"
                    name="Address"
                    formik={editContactFormik}
                  />
                  <InputBox
                    label="Zip Code"
                    name="zipcode"
                    formik={editContactFormik}
                  />
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ ...styles.flexBox, border: "none" }}>
            <Typography
              sx={styles.sectionStyle}
              onClick={() => setDetailsVisible2(!detailsVisible2)}
            >
              <ExpandMoreIcon
                sx={{
                  ...styles.expandMoreIcon,
                  transform: detailsVisible2
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
              Additional Details
            </Typography>
            {detailsVisible2 && (
              <Box sx={{ px: 2, mt: 1 }}>
                <InputLabel sx={styles.label}>Description</InputLabel>
                <TextField
                  multiline
                  rows={1}
                  sx={{ width: "100%" }}
                  InputProps={{
                    style: {
                      borderRadius: "20px",
                    },
                  }}
                  name="description"
                  value={editContactFormik.values?.description}
                  onChange={editContactFormik.handleChange}
                />
              </Box>
            )}
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
            sx={styles.uploadButtonStyle}
            type="submit"
          >
            Update User
          </Button>
        </Box>
      </form>
      <Toaster />
    </>
  );
}

export default EditUser;
