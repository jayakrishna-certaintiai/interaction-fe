import React, { useContext, useEffect, useState } from "react";
import {
  // Button,
  InputBase,
  InputLabel,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import GeneralDetails from "./DetailsTab/GeneralDetails";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import toast, { Toaster } from "react-hot-toast";

const styles = {
  paperStyle: {
    boxShadow: "0px 3px 6px #0000001F",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: 3,
    borderRadius: "20px",
    margin: "auto",
    maxWidth: "90%",
    width: 700,
    height: 500,
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
    width: "80%",
    height: 300
  },
  flexBoxItem: {
    display: "flex",
    justifyContent: "space-between",
    mt: 1,
    gap: 2,
    px: 1,
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
};

function DetailsTab({ data, latestUpdateTime, modifiedBy, getAllData }) {
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [editedValues, setEditedValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    employeeTitle: "",
    Language: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    description: "",
  });

  useEffect(() => {
    setEditedValues({
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      companyName: data?.companyName,
      employeeTitle: data?.employeeTitle,
      Language: data?.Language,
      phone: data?.phone,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      zipcode: data?.zipcode,
      description: data?.overview,
    });
  }, [data]);

  const handleChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleEditClick = async () => {
    let newErrors = {};

    if (!editedValues.firstName.trim())
      newErrors.firstName = "First Name is required.";
    if (!editedValues.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    if (!editedValues?.companyName.trim())
      newErrors.companyName = "Account Name is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editMode) {
      toast.promise(
        (async () => {
          try {
            const response = await axios.put(
              `${BaseURL}/api/v1/contacts/${localStorage.getItem(
                "userid"
              )}/1/update-contact/${data?.contactId}`,
              editedValues
            );
            setErrors({});
            return response;
          } catch (error) {
            console.error(
              "Error eith OTP initiation for forgot Password",
              error.response?.data || "Something went wrong"
            );
            throw error.response
              ? error.response
              : new Error("Network or server error");
          } finally {
            setEditMode(false);
            getAllData();
          }
        })(),
        {
          loading: "Updating Contact",
          success: (response) =>
            response.data.message || "Conatct updated successfully",
          error: (response) => {
            return response.data?.message || "Failed to update contact.";
          },
        }
      );
    } else {
      setEditMode(true);
    }
  };
  return (
    <Box sx={{ borderTop: "1px solid #E4E4E4" }}>
      {/* <UpdationDetails
        edit={editMode}
        handleEditClick={handleEditClick}
        latestUpdateTime={latestUpdateTime}
        modifiedBy={modifiedBy}
        isAuth={useHasAccessToFeature("F034", "P000000001")}
      /> */}
      <Box sx={styles.flexBox}>
        <GeneralDetails
          data={editedValues}
          editMode={editMode}
          handleChange={handleChange}
          errors={errors}
        />
      </Box>
      <Toaster />
    </Box>
  );
}

export default DetailsTab;
