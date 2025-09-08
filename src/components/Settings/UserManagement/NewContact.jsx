import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { mixed } from "yup";
import { BaseURL } from "../../../constants/Baseurl";
import { timeZones } from "../../../constants/Timezones";
import { fetchCitiesForStateAndCountry } from "../../../utils/helper/FetchCitiesForStateAndCountry";
import { fetchStatesForCountry } from "../../../utils/helper/FetchStatesForCountry";
import InputBox from "../../Common/InputBox";
import MultiSelectBox from "../../Common/MultiSelectBox";
import SelectBox from "../../Common/SelectBox";
import { titles } from "../../../constants/Titles";
import { useContext } from "react";
import { FilterListContext } from "../../../context/FiltersListContext";

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
  email: yup
    .string("Enter your Email Address")
    .required("Email Address is required"),
  roleId: yup.string("Select Your User Role").required("User Role is required"),
  company: mixed()
    .test(
      "is-non-empty-array",
      "Account(s) is/are required",
      (value) => Array.isArray(value) && value.length > 0
    )
    .required("Account(s) is/are required"),
});

function NewContact({
  handleClose,
  userRolesList,
  fetchUsersList,
  clientList,
  companyId,
}) {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [detailsVisible2, setDetailsVisible2] = useState(true);
  const [cities, setCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const { fetchContactList } = useContext(FilterListContext);
  const addNewContactFormik = useFormik({
    initialValues: {
      firstName: null,
      middleName: null,
      lastName: null,
      email: null,
      employeeTitle: null, //
      UserType: null,
      roleId: null, //
      userPreferedLanguage: null,
      userTimezone: null,
      country: null, //
      state: null, //
      city: null, //
      phone: null,
      Address: null, //
      zipcode: null, //
      description: null,
      company: null,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      const submitValues = {
        ...values,
        company: JSON.stringify(values.company),
      };

      addNewContact(submitValues)
        .then(() => {
          addNewContactFormik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    },
  });

  useEffect(() => {
    if (addNewContactFormik.values?.country) {
      fetchStatesForCountry(addNewContactFormik.values?.country).then(
        (statesArray) => {
          setCountryStates(statesArray);
        }
      );
    }
  }, [addNewContactFormik.values?.country]);

  useEffect(() => {
    if (
      addNewContactFormik.values?.country &&
      addNewContactFormik.values?.state
    ) {
      fetchCitiesForStateAndCountry(
        addNewContactFormik.values?.country,
        addNewContactFormik.values?.state
      ).then((citiesArray) => {
        setCities(citiesArray);
      });
    }
  }, [addNewContactFormik.values?.country, addNewContactFormik.values?.state]);

  let options = {
    clients: [companyId],
  };

  const addNewContact = async (values) => {
    toast.promise(
      axios
        .post(
          `${BaseURL}/api/v1/users/${localStorage.getItem(
            "userid"
          )}/1/create-user`,
          values
        )
        .then((response) => {
          if (response.data.success) {
            handleClose();
            fetchUsersList(options);
            fetchContactList();
            return response.data;
          } else {
            throw new Error(response.data.message || "Unknown error occurred");
          }
        })
        .catch((error) => {
          throw error.response
            ? error.response.data
            : new Error("Network or server error");
        }),
      {
        loading: "Adding New User...",
        success: "User added successfully",
        error: (err) => {
          console.error("Error adding new user:", err);
          return err.message || "Failed to add new user.";
        },
      }
    );
  };

  useEffect(() => {
    if (companyId && clientList && clientList?.length > 0) {
      const selectedCompany = clientList?.find(client => client?.companyId === companyId);
      if (selectedCompany) {
        addNewContactFormik.setFieldValue("company", [selectedCompany?.companyId]);
      }
    }
  }, [companyId, clientList, addNewContactFormik.setFieldValue]);

  return (
    <>
      <form
        onSubmit={addNewContactFormik.handleSubmit}
        style={styles.formStyle}
      >
        <Box
          sx={{
            display: "flex",
            overflowY: "scroll",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mx: "auto", mb: 1, px: 2 }}>
            <MultiSelectBox
              label="Account(s)"
              name="company"
              formik={addNewContactFormik}
              selectOptions={clientList?.map((item) => ({
                id: item?.companyId,
                name: item?.companyName,
              }))}
              required={true}
              width="650px"
              disabled={Boolean(companyId)}
            />
          </Box>
          <Box sx={styles.flexBox}>
            <Typography sx={styles.sectionStyle}>General</Typography>
            <Box sx={styles.flexBoxItem}>
              <InputBox
                label="First Name"
                name="firstName"
                formik={addNewContactFormik}
                required={true}
              />
              <InputBox
                label="Middle Name"
                name="middleName"
                formik={addNewContactFormik}
              />
              <InputBox
                label="Last Name"
                name="lastName"
                formik={addNewContactFormik}
                required={true}
              />
            </Box>
            <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
              <SelectBox
                label="User Type"
                name="UserType"
                formik={addNewContactFormik}
                selectOptions={userTypes?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
              <SelectBox
                label="User Role"
                name="roleId"
                formik={addNewContactFormik}
                selectOptions={userRolesList?.map((item) => ({
                  id: item?.roleId,
                  name: item?.role,
                }))}
                required={true}
              />
              <SelectBox
                label="Title"
                name="employeeTitle"
                formik={addNewContactFormik}
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
                formik={addNewContactFormik}
                required={true}
                type="email"
              />
              <SelectBox
                label="Preferred Language"
                name="userPreferedLanguage"
                formik={addNewContactFormik}
                selectOptions={languages?.map((item) => ({
                  id: item,
                  name: item,
                }))}
              />
              <SelectBox
                label="Time Zone"
                name="userTimezone"
                formik={addNewContactFormik}
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
                    formik={addNewContactFormik}
                    selectOptions={countries?.map((item) => ({
                      id: item,
                      name: item,
                    }))}
                  />
                  <SelectBox
                    label="State"
                    name="state"
                    formik={addNewContactFormik}
                    selectOptions={countryStates?.map((item) => ({
                      id: item?.name,
                      name: item?.name,
                    }))}
                  />
                  <SelectBox
                    label="City"
                    name="city"
                    formik={addNewContactFormik}
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
                    formik={addNewContactFormik}
                    type="tel"
                    inputProps={{ pattern: "[0-9]{10}" }}
                  />
                  <InputBox
                    label="Address Line"
                    name="Address"
                    formik={addNewContactFormik}
                  />
                  <InputBox
                    label="Zip Code"
                    name="zipcode"
                    formik={addNewContactFormik}
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
                  value={addNewContactFormik.values?.description}
                  onChange={addNewContactFormik.handleChange}
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
            Add User
          </Button>
        </Box>
      </form>
      <Toaster />
    </>
  );
}

export default NewContact;
