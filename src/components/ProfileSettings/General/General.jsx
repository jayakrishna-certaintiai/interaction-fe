import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, InputLabel, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { timeZones } from "../../../constants/Timezones";
import { FilterListContext } from "../../../context/FiltersListContext";
import { fetchCitiesForStateAndCountry } from "../../../utils/helper/FetchCitiesForStateAndCountry";
import { fetchStatesForCountry } from "../../../utils/helper/FetchStatesForCountry";
import InputBox from "../../Common/InputBox";
import SelectBox from "../../Common/SelectBox";
import FilledButton from "../../button/FilledButton";
import { BaseURL } from "../../../constants/Baseurl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { token_obj } from "../../../utils/helper/Constant";
import { useAuthContext } from "../../../context/AuthProvider";

const styles = {
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
  boxStyle: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    borderBottom: "2px solid #ddd",
    padding: "16px",
    marginBottom: "15px",
  },
  flexBoxItem: {
    display: "flex",
    justifyContent: "space-between",
    mt: 1,
    gap: 2,
    px: 2,
  },
  flexBox: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #E4E4E4",
  },
  sectionStyle: {
    fontWeight: 600,
    px: 2,
    cursor: "pointer",
    mb: -1,
    pb: 1,
    display: "flex",
    alignItems: "center",
  },
  expandMoreIcon: {
    borderRadius: "50%",
    fontSize: "15px",
    backgroundColor: "#404040",
    color: "white",
    mr: 1,
    transition: "transform 0.3s ease",
  },
  label: {
    color: "#404040",
    fontSize: "14px",
  },
};

const validationSchema = yup.object({
  firstName: yup
    .string("Enter your First Name")
    .required("First Name is required"),
  lastName: yup
    .string("Enter your Last Name")
    .required("Last Name is required"),
});

const languages = ["English"];
const countries = ["United States", "Canada"];

const General = () => {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [detailsVisible2, setDetailsVisible2] = useState(true);
  const [cities, setCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { userDetails, fetchUserDetails } = useContext(FilterListContext);
  const { logout } = useAuthContext();

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
  };

  const editProfileFormik = useFormik({
    initialValues: {
      firstName: userDetails?.[0]?.firstName,
      middleName: userDetails?.[0]?.middleName,
      lastName: userDetails?.[0]?.lastName,
      email: userDetails?.[0]?.email, //
      userPreferedLanguage: userDetails?.[0]?.userPreferedLanguage,
      userTimezone: userDetails?.[0]?.userTimezone,
      country: userDetails?.[0]?.country, //
      state: userDetails?.[0]?.state, //
      city: userDetails?.[0]?.city, //
      phone: userDetails?.[0]?.phone,
      Address: userDetails?.[0]?.Address, //
      zipcode: userDetails?.[0]?.zipcode, //
      description: userDetails?.[0]?.description,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {

      editDetails(values)
        .then(() => {
          editProfileFormik.resetForm();
          setIsEditMode(false);
        })
        .catch((error) => {
          console.error("Error editing profile:", error);
        });
    },
  });

  useEffect(() => {
    if (editProfileFormik.values?.country) {
      fetchStatesForCountry(editProfileFormik.values?.country).then(
        (statesArray) => {
          setCountryStates(statesArray);
        }
      );
    }
  }, [editProfileFormik.values?.country]);

  useEffect(() => {
    if (editProfileFormik.values?.country && editProfileFormik.values?.state) {
      fetchCitiesForStateAndCountry(
        editProfileFormik.values?.country,
        editProfileFormik.values?.state
      ).then((citiesArray) => {
        setCities(citiesArray);
      });
    }
  }, [editProfileFormik.values?.country, editProfileFormik.values?.state]);

  const editDetails = async (values) => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: {
        "Content-Type": "application/json", 'Authorization': `Bearer ${token_obj.accessToken}`
      },
      data: values,
    };

    axios
      .request(config)
      .then((response) => {

        fetchUserDetails();
        toast.success("Profile Edited Successfully!");
      })
      .catch((error) => {
        console.error(error);
        if (error?.response?.data?.logout === true) {
          logout();
      }
        toast.error("Error Editing the Profile");
      });
  };

  return (
    <>
      <form onSubmit={editProfileFormik.handleSubmit}>
        <Box sx={styles.boxStyle}>
          <Typography sx={{ fontSize: "23px", fontWeight: "500" }}>
            General
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <>
              {!isEditMode ? (
                <FilledButton
                  btnname={"Edit"}
                  onClick={handleEditClick}
                  Icon={<EditIcon />}
                />
              ) : (
                <>
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <FilledButton
                      btnname={"Cancel"}
                      onClick={handleCancelClick}
                      color="#9F9F9F"
                      Icon={<></>}
                    />

                    <FilledButton
                      btnname={"Save Changes"}
                      Icon={<></>}
                      type="submit"
                      width= "130px"
                    />
                  </Box>
                </>
              )}
            </>
          </Box>
        </Box>

        <Box sx={{ borderBottom: "1px solid #E4E4E4", pb: 2 }}>
          <Box sx={styles.flexBoxItem}>
            <InputBox
              label="First Name"
              name="firstName"
              formik={editProfileFormik}
              required={true}
              disabled={isEditMode ? false : true}
            />
            <InputBox
              label="Middle Name"
              name="middleName"
              formik={editProfileFormik}
              disabled={isEditMode ? false : true}
            />
            <InputBox
              label="Last Name"
              name="lastName"
              formik={editProfileFormik}
              required={true}
              disabled={isEditMode ? false : true}
            />
            <InputBox
              label="Email Address"
              name="email"
              formik={editProfileFormik}
              required={true}
              type="email"
              disabled={true}
            />
          </Box>
          <Box sx={{ ...styles.flexBoxItem, width: "49.5%" }}>
            <SelectBox
              label="Preferred Language"
              name="userPreferedLanguage"
              formik={editProfileFormik}
              selectOptions={languages?.map((item) => ({
                id: item,
                name: item,
              }))}
              disabled={isEditMode ? false : true}
            />
            <SelectBox
              label="Time Zone"
              name="userTimezone"
              formik={editProfileFormik}
              selectOptions={timeZones?.map((item) => ({
                id: item,
                name: item,
              }))}
              disabled={isEditMode ? false : true}
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
            <Box sx={{ borderBottom: "1px solid #E4E4E4", pb: 2 }}>
              <Box sx={styles.flexBoxItem}>
                <SelectBox
                  label="Country"
                  name="country"
                  formik={editProfileFormik}
                  selectOptions={countries?.map((item) => ({
                    id: item,
                    name: item,
                  }))}
                  disabled={isEditMode ? false : true}
                />
                <SelectBox
                  label="State"
                  name="state"
                  formik={editProfileFormik}
                  selectOptions={countryStates?.map((item) => ({
                    id: item?.name,
                    name: item?.name,
                  }))}
                  disabled={isEditMode ? false : true}
                />
                <SelectBox
                  label="City"
                  name="city"
                  formik={editProfileFormik}
                  selectOptions={cities?.map((item) => ({
                    id: item,
                    name: item,
                  }))}
                  disabled={isEditMode ? false : true}
                />
                <InputBox
                  label="Phone"
                  name="phone"
                  formik={editProfileFormik}
                  type="tel"
                  inputProps={{ pattern: "[0-9]{10}" }}
                  disabled={isEditMode ? false : true}
                />
              </Box>
              <Box sx={{ ...styles.flexBoxItem, width: "49.5%" }}>
                <InputBox
                  label="Address Line"
                  name="Address"
                  formik={editProfileFormik}
                  disabled={isEditMode ? false : true}
                />
                <InputBox
                  label="Zip Code"
                  name="zipcode"
                  formik={editProfileFormik}
                  disabled={isEditMode ? false : true}
                />
              </Box>
            </Box>
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
                transform: detailsVisible2 ? "rotate(180deg)" : "rotate(0deg)",
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
                value={editProfileFormik.values?.description}
                onChange={editProfileFormik.handleChange}
                disabled={isEditMode ? false : true}
              />
            </Box>
          )}
        </Box>
      </form>
      <Toaster />
    </>
  );
};

export default General;
