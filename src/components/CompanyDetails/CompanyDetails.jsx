import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import InputBox from "../Common/InputBox";
import EditIcon from "@mui/icons-material/Edit";
import toast, { Toaster } from "react-hot-toast";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { fetchCitiesForStateAndCountry } from "../../utils/helper/FetchCitiesForStateAndCountry";
import { fetchStatesForCountry } from "../../utils/helper/FetchStatesForCountry";
import SelectBox from "../Common/SelectBox";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";

const validationSchema = yup.object({
  companyName: yup
    .string("Enter your Account Name")
    .required("Account Name is required"),
});

const styles = {
  upperBox: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
    py: 1,
    borderTop: "1px solid #E4E4E4",
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
  updateInfo: {
    color: "#9F9F9F",
    fontSize: "12px",
  },
  editButton: {
    borderRadius: "20px",
    backgroundColor: "#00A398",
    color: "white",
    textTransform: "capitalize",
    height: "30px",
    "&:hover": { backgroundColor: "#00A398" },
  },
  editIcon: {
    fontSize: "20px",
    mr: 1,
  },
};

const countries = ["United States", "Canada"];

function CompanyDetails({ data, latestUpdateTime, modifiedBy }) {
  const [editMode, setEditMode] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [cities, setCities] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [countryShippingStates, setCountryShippingStates] = useState([]);
  const { clientList } = useContext(FilterListContext);
  const addCompanyFormik = useFormik({
    initialValues: {
      companyId: data?.companyId,
      parentCompanyId: data?.parentCompanyId,
      companyName: data?.companyName,
      billingAddress: data?.billingAddress,
      billingState: data?.billingState,
      billingCountry: data?.billingCountry,
      billingCity: data?.billingCity,
      shippingAddress: data?.shippingAddress,
      shippingCity: data?.shippingCity,
      shippingState: data?.shippingState,
      shippingCountry: data?.shippingCountry,
      industry: data?.industry,
      email: data?.email,
      phone: data?.phone,
      employeesCount: data?.employeesCount,
      status: data?.status,
      annualRevenue: data?.annualRevenue,
      SLA: data?.SLA,
      SLASerialNumber: data?.SLASerialNumber,
      SLAExpiration: data?.SLAExpiration,
      noOfLocation: data?.noOfLocation,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      EditCompany(values);
    },
  });

  const EditCompany = async (values) => {
    toast.promise(
      axios.put(
        `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/${values?.companyId
        }/edit-company`, {}, Authorization_header(),
        values
      ),
      {
        loading: "Updating company...",
        success: (response) => {
          setEditMode(false);
          return response?.data?.message || "Company successfully updated!";
        },
        error: (error) => {
          console.error(error);
          return error?.response?.data?.message || "Failed to update company.";
        },
      }
    );
  };

  const handleCheckboxChange = (event) => {
    setIsSameAddress(event.target.checked);
    if (event.target.checked) {
      const { billingAddress, billingCity, billingState, billingCountry } =
        addCompanyFormik.values;
      addCompanyFormik.setValues({
        ...addCompanyFormik.values,
        shippingAddress: billingAddress,
        shippingCity: billingCity,
        shippingState: billingState,
        shippingCountry: billingCountry,
      });
    } else {
      addCompanyFormik.setValues({
        ...addCompanyFormik.values,
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingCountry: "",
      });
    }
  };

  useEffect(() => {
    if (addCompanyFormik.values?.billingCountry) {
      fetchStatesForCountry(addCompanyFormik.values?.billingCountry).then(
        (statesArray) => {
          setCountryStates(statesArray);
        }
      );
    }
  }, [addCompanyFormik.values?.billingCountry]);

  useEffect(() => {
    if (addCompanyFormik.values?.shippingCountry) {
      fetchStatesForCountry(addCompanyFormik.values?.shippingCountry).then(
        (statesArray) => {
          setCountryShippingStates(statesArray);
        }
      );
    }
  }, [addCompanyFormik.values?.shippingCountry]);

  useEffect(() => {
    if (
      addCompanyFormik.values?.billingCountry &&
      addCompanyFormik.values?.billingState
    ) {
      fetchCitiesForStateAndCountry(
        addCompanyFormik.values?.billingCountry,
        addCompanyFormik.values?.billingState
      ).then((citiesArray) => {
        setCities(citiesArray);
      });
    }
  }, [
    addCompanyFormik.values?.billingCountry,
    addCompanyFormik.values?.billingState,
  ]);

  useEffect(() => {
    if (
      addCompanyFormik.values?.shippingCountry &&
      addCompanyFormik.values?.shippingState
    ) {
      fetchCitiesForStateAndCountry(
        addCompanyFormik.values?.shippingCountry,
        addCompanyFormik.values?.shippingState
      ).then((citiesArray) => {
        setShippingCities(citiesArray);
      });
    }
  }, [
    addCompanyFormik.values?.shippingCountry,
    addCompanyFormik.values?.shippingState,
  ]);

  return (
    <form onSubmit={addCompanyFormik.handleSubmit}>
      <Box sx={styles.upperBox}>
        <Box>
          <Typography sx={styles.updateInfo}>
            Updated {latestUpdateTime}
          </Typography>
          <Typography sx={styles.updateInfo}>
            Updated by: {modifiedBy}
          </Typography>
        </Box>
        {useHasAccessToFeature("F007", "P000000001") && (
          <>
            {editMode ? (
              <div style={{ display: "flex", gap: "20px" }}>
                <Button
                  variant="contained"
                  sx={styles.editButton}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={styles.editButton}
                  type="submit"
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon sx={styles.editIcon} />}
                sx={styles.editButton}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </>
        )}
      </Box>
      <Box sx={styles.flexBox}>
        <Typography sx={{ fontWeight: 600, px: 2 }}>General</Typography>
        <Box sx={styles.flexBoxItem}>
          <InputBox
            label="Account Name"
            name="companyName"
            formik={addCompanyFormik}
            disabled={true}
            required={true}
          />
          <InputBox
            label="Number of Location"
            name="noOfLocation"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="number"
          />
          <SelectBox
            label="Parent Account"
            name="parentCompanyId"
            formik={addCompanyFormik}
            selectOptions={clientList?.map((item) => ({
              id: item?.companyId,
              name: item?.companyName,
            }))}
            disabled={!editMode}
            required={true}
          />
        </Box>
        <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
          <InputBox
            label="Industry"
            name="industry"
            formik={addCompanyFormik}
            disabled={!editMode}
          />
          <InputBox
            label="Phone"
            name="phone"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="tel"
          />
          <InputBox
            label="Email Address"
            name="email"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="email"
          />
        </Box>
        <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
          <InputBox
            label="Annual Revenue"
            name="annualRevenue"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="number"
          />
          <InputBox
            label="Employees"
            name="employeesCount"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="number"
          />
          <InputBox
            label="Status"
            name="status"
            formik={addCompanyFormik}
            disabled={!editMode}
          />
        </Box>
        {/* <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
          <InputBox
            label="SLA"
            name="SLA"
            formik={addCompanyFormik}
            disabled={!editMode}
          />
          <InputBox
            label="SLA Serial Number"
            name="SLASerialNumber"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="number"
          />
          <InputBox
            label="SLA Expiration"
            name="SLAExpiration"
            formik={addCompanyFormik}
            disabled={!editMode}
            type="date"
          />
        </Box> */}
      </Box>
      {/* Contact */}
      <Box sx={styles.flexBox}>
        <Typography sx={{ fontWeight: 600, px: 2 }}>Billing Address</Typography>

        <Box sx={styles.flexBoxItem}>
          <SelectBox
            label="Country"
            name="billingCountry"
            formik={addCompanyFormik}
            selectOptions={countries?.map((item) => ({
              id: item,
              name: item,
            }))}
            disabled={!editMode}
          />
          <SelectBox
            label="State"
            name="billingState"
            formik={addCompanyFormik}
            selectOptions={countryStates?.map((item) => ({
              id: item?.name,
              name: item?.name,
            }))}
            disabled={!editMode}
          />
          <SelectBox
            label="City"
            name="billingCity"
            formik={addCompanyFormik}
            selectOptions={cities?.map((item) => ({
              id: item,
              name: item,
            }))}
            disabled={!editMode}
          />
        </Box>
        <Box sx={{ ...styles.flexBoxItem, mb: 1, justifyContent: "left" }}>
          <InputBox
            label="Address Line"
            name="billingAddress"
            formik={addCompanyFormik}
            disabled={!editMode}
          />
          {/* <InputBox label="Zip Code" name="billingZipCode" formik={addCompanyFormik}
          disabled={!editMode} /> */}
        </Box>
      </Box>
      <Box sx={styles.flexBox}>
        <Typography sx={{ fontWeight: 600, px: 2 }}>
          Shipping Address
        </Typography>
        <Typography sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <Checkbox
            checked={isSameAddress}
            onChange={handleCheckboxChange}
            sx={{ color: "#00A398", "&.Mui-checked": { color: "#00A398" } }}
          />{" "}
          Same as Billing Address
        </Typography>
        <Box sx={styles.flexBoxItem}>
          <SelectBox
            label="Country"
            name="shippingCountry"
            formik={addCompanyFormik}
            selectOptions={countries?.map((item) => ({
              id: item,
              name: item,
            }))}
            disabled={!editMode}
          />
          <SelectBox
            label="State"
            name="shippingState"
            formik={addCompanyFormik}
            selectOptions={countryShippingStates?.map((item) => ({
              id: item?.name,
              name: item?.name,
            }))}
            disabled={!editMode}
          />
          <SelectBox
            label="City"
            name="shippingCity"
            formik={addCompanyFormik}
            selectOptions={shippingCities?.map((item) => ({
              id: item,
              name: item,
            }))}
            disabled={!editMode}
          />
        </Box>
        <Box sx={{ ...styles.flexBoxItem, mb: 1, justifyContent: "left" }}>
          <InputBox
            label="Address Line"
            name="shippingAddress"
            formik={addCompanyFormik}
            disabled={!editMode}
          />
          {/* <InputBox label="Zip Code" name="shippingZipCode" formik={addCompanyFormik}
          disabled={!editMode} /> */}
        </Box>
      </Box>
      <Toaster />
    </form>
  );
}

export default CompanyDetails;
