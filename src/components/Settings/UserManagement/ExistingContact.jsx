import { Box, Button } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { mixed } from "yup";
import { BaseURL } from "../../../constants/Baseurl";
import { timeZones } from "../../../constants/Timezones";
import { FilterListContext } from "../../../context/FiltersListContext";
import MultiSelectBox from "../../Common/MultiSelectBox";
import SelectBox from "../../Common/SelectBox";

const validationSchema = yup.object({
  roleId: yup.string("Select Your User Role").required("User Role is required"),
  company: mixed()
    .test(
      "is-non-empty-array",
      "Account(s) is/are required",
      (value) => Array.isArray(value) && value.length > 0
    )
    .required("Account(s) is/are required"),
});

const styles = {
  box1Style: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
    alignItems: "center",
  },
  buttonBox: {
    mt: 1,
    display: "flex",
    justifyContent: "flex-end",
    px: 2,
    mb: 2,
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
};

const userTypes = ["Consultant", "Account"];

function ExistingContact({
  // contactList,
  handleClose,
  userRolesList,
  clientList,
  fetchUsersList,
  open,
  companyId,
}) {
  const { fetchContactList, contactList } = useContext(FilterListContext);
  const addExistingContactFormik = useFormik({
    initialValues: {
      roleId: null,
      contact: null,
      UserType: null,
      userTimezone: null,
      company: null,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {
      const submitValues = {
        ...values,
        company: JSON.stringify(values.company),
      };

      addExistingContact(submitValues)
        .then(() => {
          addExistingContactFormik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    },
  });

  let options = {
    clients: [companyId],
  };

  const addExistingContact = async (values) => {
    toast.promise(
      (async () => {
        try {
          const response = await axios.post(
            `${BaseURL}/api/v1/users/${localStorage.getItem(
              "userid"
            )}/0/create-user-with-contactId/${addExistingContactFormik.values?.contact
            }`,
            values
          );
          if (response.data.success) {
            handleClose();
            fetchUsersList(options);
          }
          return response;
        } catch (error) {
          throw error.response
            ? error.response
            : new Error("Network or server error");
        }
      })(),
      {
        loading: "Adding Existing User...",
        success: (response) =>
          response.data.message || "User added successfully",
        error: (response) =>
          response.data.error.message || "Failed to add existing user.",
      }
    );
  };

  useEffect(() => {
    fetchContactList();
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    if (companyId && clientList && clientList?.length > 0) {
      const selectedCompany = clientList?.find(
        (client) => client?.companyId === companyId
      );
      if (selectedCompany) {
        addExistingContactFormik.setFieldValue("company", [
          selectedCompany?.companyId,
        ]);
      }
    }
  }, [companyId, clientList, addExistingContactFormik.setFieldValue]);

  return (
    <form onSubmit={addExistingContactFormik.handleSubmit}>
      <Box sx={{ mx: "auto", mb: 1, px: 2 }}>
        <MultiSelectBox
          label="Account(s)"
          name="company"
          formik={addExistingContactFormik}
          selectOptions={clientList?.map((item) => ({
            id: item?.companyId,
            name: item?.companyName,
          }))}
          required={true}
          width="465px"
          disabled={Boolean(companyId)}
        />
      </Box>
      <Box sx={styles.box1Style}>
        <SelectBox
          label="Pick a Contact"
          name="Employees"
          formik={addExistingContactFormik}
          selectOptions={contactList?.map((item) => ({
            id: item.contactId,
            name: item.firstName + " " + item.lastName,
          }))}
        />
        <SelectBox
          label="User Role"
          name="roleId"
          formik={addExistingContactFormik}
          selectOptions={userRolesList?.map((item) => ({
            id: item?.roleId,
            name: item?.role,
          }))}
          required={true}
        />
      </Box>
      <Box sx={styles.box1Style}>
        <SelectBox
          label="User Type"
          name="UserType"
          formik={addExistingContactFormik}
          selectOptions={userTypes?.map((item) => ({
            id: item,
            name: item,
          }))}
        />
        <SelectBox
          label="Time Zone"
          name="userTimezone"
          formik={addExistingContactFormik}
          selectOptions={timeZones?.map((item) => ({
            id: item,
            name: item,
          }))}
        />
      </Box>
      <Box sx={styles.buttonBox}>
        <Button
          variant="contained"
          sx={styles.buttonStyle}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button variant="contained" sx={styles.uploadButtonStyle} type="submit">
          Add User
        </Button>
      </Box>
      <Toaster />
    </form>
  );
}

export default ExistingContact;
