import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  InputBase,
  InputLabel,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ClientSelect from "../Documents/ModalComponents/ClientSelect";
// import SelectBox from "../Common/SelectBox";
import { titles } from "../../constants/Titles";
import { fetchCitiesForStateAndCountry } from "../../utils/helper/FetchCitiesForStateAndCountry";
import { fetchStatesForCountry } from "../../utils/helper/FetchStatesForCountry";
import CitySelect from "./ContactModalDropdowns/CitySelect";
import CountrySelect from "./ContactModalDropdowns/CountrySelect";
import LanguageSelect from "./ContactModalDropdowns/LanguageSelect";
import StateSelect from "./ContactModalDropdowns/StateSelect";
import TitleSelect from "./ContactModalDropdowns/TitleSelect";

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
  sectionStyle: { fontWeight: 600, px: 2, cursor: "pointer" },
};

const lang = ["English"];
const countries = ["United States", "Canada"];

const ContactModal = ({ open, handleClose, onAddContact, clients }) => {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [detailsVisible2, setDetailsVisible2] = useState(true);
  const [errors, setErrors] = useState({});
  const [companyId, setCompanyId] = useState(null);
  const [countryStates, setCountryStates] = useState([]);
  const [company, setCompany] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [title, setTitle] = useState("");
  const [contactData, setContactData] = useState({
    contactId: "",
    companyId: "",
    employeeTitle: "",
    employeeId: "",
    employementType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    Address: "",
    Language: "",
    status: "",
    statusDate: "",
    city: "",
    country: "",
    state: "",
    zipcode: "",
    description: "",
    createdBy: "",
    createdTime: "",
    modifiedBy: "",
    modifiedTime: "",
    sysModTime: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (companyId) {
      setContactData((prev) => ({ ...prev, companyId: companyId }));
    }
    setContactData((prev) => ({
      ...prev,
      Language: language,
      country: country,
      state: state,
      city: city,
      employeeTitle: title,
    }));
  }, [companyId, language, country, state, city]);

  const handleAddContact = () => {
    let newErrors = {};

    // Validate each required field
    if (!contactData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!contactData.lastName.trim())
      newErrors.lastName = "Last Name is required";
    if (!contactData.companyId.trim())
      newErrors.companyId = "Account is required";
    if (!contactData.email.trim()) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
      onAddContact(contactData);
      handleClose();
    }
  };
  useEffect(() => {
    setCompanyId(
      clients?.find((client) => client?.companyName === company)?.companyId
    );
  }, [company]);

  useEffect(() => {
    if (country) {
      fetchStatesForCountry(country).then((statesArray) => {
        setCountryStates(statesArray);
      });
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      fetchCitiesForStateAndCountry(country, state).then((citiesArray) => {
        setCities(citiesArray);
      });
    }
  }, [country, state]);

  return (
    <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
      <Paper sx={styles.paperStyle}>
        <Typography variant="h6" sx={styles.titleStyle}>
          Add New Contact
        </Typography>

        <Box sx={styles.flexBox}>
          <Typography sx={styles.sectionStyle}>General</Typography>
          <Box sx={styles.flexBoxItem}>
            <Box>
              <InputLabel sx={styles.label}>
                First Name<span style={{ color: "red" }}>*</span>
              </InputLabel>
              <InputBase
                name="firstName"
                type="text"
                value={contactData.firstName}
                onChange={handleChange}
                sx={styles.inputBase}
              />
              {errors.firstName && (
                <Typography color="red" sx={{ fontSize: "13px" }}>
                  {errors.firstName}
                </Typography>
              )}
            </Box>
            <Box>
              <InputLabel sx={styles.label}>
                Last Name<span style={{ color: "red" }}>*</span>
              </InputLabel>
              <InputBase
                sx={styles.inputBase}
                name="lastName"
                type="text"
                value={contactData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <Typography color="red" sx={{ fontSize: "13px" }}>
                  {errors.lastName}
                </Typography>
              )}
            </Box>
            <Box>
              <InputLabel sx={styles.label}>
                Email Address<span style={{ color: "red" }}>*</span>
              </InputLabel>
              <InputBase
                type="email"
                sx={styles.inputBase}
                name="email"
                value={contactData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <Typography color="red" sx={{ fontSize: "13px" }}>
                  {errors.email}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
            <Box>
              <ClientSelect
                clients={clients}
                company={company}
                setCompany={setCompany}
                fontWeight={"400"}
                marBot={"0px"}
              />
              {errors.companyId && (
                <Typography color="red" sx={{ fontSize: "13px" }}>
                  {errors.companyId}
                </Typography>
              )}
            </Box>
            <Box>
              <TitleSelect titles={titles} title={title} setTitle={setTitle} />
            </Box>
            <Box>
              <LanguageSelect
                lang={lang}
                language={language}
                setLanguage={setLanguage}
              />
            </Box>
          </Box>
        </Box>

        {/* Contact */}
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
                <CountrySelect
                  cntry={countries}
                  country={country}
                  setCountry={setCountry}
                />
                <StateSelect
                  states={countryStates}
                  state={state}
                  setState={setState}
                />
                <CitySelect cities={cities} city={city} setCity={setCity} />
              </Box>
              <Box sx={{ ...styles.flexBoxItem, mb: 1 }}>
                <Box>
                  <InputLabel sx={styles.label}>Phone</InputLabel>
                  <InputBase
                    type="tel"
                    sx={styles.inputBase}
                    name="phone"
                    value={contactData.phone}
                    onChange={handleChange}
                    inputProps={{ pattern: "[0-9]{10}" }}
                  />
                </Box>
                <Box>
                  <InputLabel sx={styles.label}>Address Line</InputLabel>
                  <InputBase
                    type="text"
                    sx={styles.inputBase}
                    name="Address"
                    value={contactData.Address}
                    onChange={handleChange}
                  />
                </Box>
                <Box>
                  <InputLabel sx={styles.label}>Zip Code</InputLabel>
                  <InputBase
                    type="number"
                    sx={styles.inputBase}
                    name="zipcode"
                    value={contactData.zipcode}
                    onChange={handleChange}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>

        {/* Additional Details */}
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
                value={contactData.description}
                onChange={handleChange}
              />
            </Box>
          )}
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
            onClick={handleAddContact}
          >
            Add Employee
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ContactModal;
