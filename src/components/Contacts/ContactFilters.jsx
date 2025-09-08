import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Collapse,
  Typography,
  TextField,
  Drawer,
  IconButton,
  InputBase,
  InputAdornment,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ContactContext } from "../../context/ContactContext";
import { FilterListContext } from "../../context/FiltersListContext";
import CompanySelector from "../FilterComponents/CompanySelector";
import TitleSelector from "../FilterComponents/TitleSelector";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { Authorization_header } from "../../utils/helper/Constant";
import ActionButton from "../FilterComponents/ActionButton";
import PhonesFilter from "../FilterComponents/PhonesFilters";
import SearchIcon from "@mui/icons-material/Search";
import EmpTypeSelect from "../FilterComponents/EmpTypeSelect";

const triangleStyle = {
  display: 'inline-block',
  width: 0,
  height: 0,
  marginTop: "5px",
  marginRight: '10px',
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  borderBottom: '12px solid black',
  transition: 'transform 0.3s ease',
};

const styles = {
  drawerPaper: {
    "& .MuiDrawer-paper": {
      height: "72.5%",
      display: "flex",
      flexDirection: "column",
      marginTop: "12.5rem",
      marginLeft: "20px",
      borderBottom: "1px solid #E4E4E4",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      borderLeft: "1px solid #E4E4E4",
      width: "17rem"
    },
  },
  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 10,
    height: "40.5%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #E4E4E4",
    borderTop: "1px solid #E4E4E4",
    px: 2,
    height: "45px",
    justifyContent: "space-between",
    backgroundColor: "#ececec",
  },
  title: {
    fontWeight: "500",
    textTransform: "capitalize",
    marginRight: '-2px',
    color: 'black',
    fontSize: '16px',
    backgroundColor: "#ececec",
  },
  closeButton: {
    color: "#9F9F9F",
    "&:hover": { color: "#FD5707" },
    marginRight: "-15px"
  },
  accordion: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'transparent',
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    '&:hover': { backgroundColor: '#03A69B1A' },
    padding: '10px',
    marginTop: "-20px"
  },
  accordionDetails: {
    overflowX: 'hidden',
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "16px",
    borderTop: "1px solid #E4E4E4",
    marginTop: "1px",
    gap: 1,
  },
  textField: {
    fontSize: '0.82rem',
    padding: '2px 0px',
    height: '32px',
    width: "100px",
    borderRadius: "20px",
  },
  applyButton: {
    color: "#00A398",
  },
  clearButton: {
    color: "#9F9F9F",
  },
  searchBox: {
    mt: 1,
    alignItems: "center",
    display: "flex",
    p: 1,
    pl: 2,
    width: "115%"
  },
  inputBase: {
    borderRadius: "20px",
    width: "80%",
    height: "35px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
  searchIcon: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "90%",
    height: "37px",
    border: "1px solid #9F9F9F",
    mt: 2,
    ml: 1.5,
  },
};

function ContactFilters({ handleClose, open, onApplyFilters, clientData }) {
  const {
    contactFilterState,
    setContactFilterState,
    clearContactFilterCounter,
    setIsContactFilterApplied,
    triggerContactClearFilters,
    fetchContactData,
  } = useContext(ContactContext);
  const { clientList } = useContext(FilterListContext);
  const [company, setCompany] = useState(contactFilterState.company || []);
  const [showCompany, setShowCompany] = useState(false);
  const [employeeTitles, setEmployeeTitle] = useState(contactFilterState.employeeTitles || []);
  const [showEmployeetitles, setShowEmployeeTitles] = useState(false);
  const [employementTypes, setEmployementTypes] = useState(contactFilterState.employementTypes || []);
  const [employementTypesList, setEmployementTypesList] = useState([]);
  const [showEmployementTypes, setShowEmployementTypes] = useState(false);
  const [employeeRolesList, setemployeeRolesList] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const filterFields = [
    { label: 'Account' },
    { label: 'Employee Title' },
    { label: 'Employee Type' },
  ];

  const handleSearchInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  useEffect(() => {

    // const companyList = Array.isArray(company) ? company.map(c => c.companyId) : undefined;
    setContactFilterState(prev => ({
      ...prev,
      companyId: Array.isArray(company) ? company.map(c => c.companyId) : undefined,
      employeeId: Array.isArray(employeeRolesList) ? employeeRolesList.find(emp => emp?.employeeTitleName === employeeTitles)?.employeeId : undefined,
      employeeId: Array.isArray(employementTypesList) ? employementTypesList.find(emp => emp?.employementTypes === employementTypes)?.employeeId : undefined,
      company,
      employeeTitles,
      employementTypes,
    }));
  }, [company, employeeTitles, employeeRolesList, employementTypes, employementTypesList, clientList, setContactFilterState]);
  useEffect(() => {

  }, [contactFilterState])


  // useEffect(() => {
  //   setContactFilterState(({
  //     ...contactFilterState,
  //     employeeTitles: [],
  //     companyId: company,
  //     company: [],
  //     phones: [],
  //   }));
  // }, [employeeTitles, company, phones]);

  const fetchData = async () => {
    try {
      const url = `${BaseURL}/api/v1/contacts/get-contacts-filter-values`;
      const response = await axios.get(url, Authorization_header());
      const data = response?.data?.data || {};
      setCompany(data?.companyIds || []);
      setemployeeRolesList(data?.employeeTitles || []);
      setEmployementTypesList(data?.employementTypes || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contactFilterState?.companyIds]);

  useEffect(() => {
    if (clearContactFilterCounter) {
      setCompany([]);
      setEmployeeTitle([]);
      setEmployementTypes([]);
      setContactFilterState(prev => ({
        ...prev,
        companyId: [],
        company: [],
        employeeTitles: [],
        employementTypes: [],
      }));
      setShowCompany(false);
      setShowEmployeeTitles(false);
      setEmployementTypes(false);
    }
  }, [clearContactFilterCounter, setContactFilterState]);

  let contactOptions;
  useEffect(() => {
    const shouldFetchWithFiltersContact =
      contactFilterState.company?.length > 0 ||
      contactFilterState.employeeTitles?.length > 0 ||
      contactFilterState.employementTypes?.length > 0;
    if (shouldFetchWithFiltersContact) {
      contactOptions = {
        ...(contactFilterState.companyId?.length > 0 && {
          companyIds: contactFilterState.companyId,
        }),
        ...(contactFilterState.titleName !== "" && {
          employeeTitles: [contactFilterState.titleName],
        }),
        ...(contactFilterState.employementTypes !== "" && {
          employementTypes: [contactFilterState.employementTypes],
        }),
      };
    }
  }, [contactFilterState]);

  const clearFilters = () => {
    setCompany([]);
    setEmployeeTitle([]);
    setEmployementTypes([]);
    setSearchTerm('');
    setContactFilterState({
      ...contactFilterState,
      companyId: [],
      company: [],
      employeeTitles: [],
      employementTypes: [],
    });
    onApplyFilters({});
    triggerContactClearFilters();
    setIsContactFilterApplied(false);
    setShowEmployementTypes(false);
  };
  const applyFilters = () => {
    const filters = {
      ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
      ...(employeeTitles.length > 0 && { employeeTitles }),
      ...(employementTypes.length > 0 && { employementTypes }),
    };
    fetchContactData(filters);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      variant="persistent"
      sx={styles.drawerPaper}
    >
      <Box sx={styles.drawerContainer}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>Employee Filter</Typography>
          {/* <IconButton onClick={handleClose} sx={styles.closeButton}>
            <CancelIcon />
          </IconButton> */}
        </Box>
        <Box>
          <InputBase
            type="text"
            placeholder="Search Field Here..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            value={searchTerm}
            onChange={handleSearchInputChange}
            sx={styles.inputStyle}
          />
        </Box>
        <Box sx={styles.accordion}>
          <Accordion
            sx={{
              height: "100%",
              overflow: 'auto',
              backgroundColor: isAccordionOpen ? '#FFFFFF' : 'transparent',
              '&:hover': { backgroundColor: '#FFFFFF' },
              boxShadow: 'none',
              borderRadius: "20px",
            }}
            expanded={isAccordionOpen}
          >
            <AccordionDetails sx={styles.accordionDetails}>
              <Box>
                {filterFields
                  .filter(field => field.label.toLowerCase().includes(searchTerm))
                  .map((field, index) => (
                    <Box key={index}>
                      <FormControlLabel
                        control={
                          <>
                            <Checkbox
                              checked={
                                field.label === "Account"
                                  ? showCompany
                                  : field.label === "Employee Title"
                                    ? showEmployeetitles
                                    : field.label === "Employee Type"
                                      ? showEmployementTypes
                                      : false
                              }
                              onChange={(e) => {
                                if (field.label === "Account") {
                                  if (e.target.checked) {
                                    setShowCompany(true);
                                  } else {
                                    setShowCompany(false);
                                    setCompany([]);
                                  }
                                } else if (field.label === "Employee Title") {
                                  if (e.target.checked) {
                                    setShowEmployeeTitles(true);
                                  } else {
                                    setShowEmployeeTitles(false);
                                    setEmployeeTitle([]);
                                  }
                                } else if (field.label === "Employee Type") {
                                  if (e.target.checked) {
                                    setShowEmployementTypes(true);
                                  } else {
                                    setShowEmployementTypes(false);
                                    setEmployementTypes([]);
                                  }
                                }
                              }}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#00A398",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          </>
                        }
                        label={field.label}
                      />
                      {field.label === 'Account' && (
                        <Collapse in={showCompany}>
                          <CompanySelector company={company} clientList={clientList} setCompany={setCompany} />
                        </Collapse>
                      )}
                      {field.label === 'Employee Title' && (
                        <Collapse in={showEmployeetitles}>
                          <TitleSelector
                            employeeTitles={employeeTitles}
                            employeeRolesList={employeeRolesList}
                            setEmployeeTitle={setEmployeeTitle}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Employee Type' && (
                        <Collapse in={showEmployementTypes}>
                          <EmpTypeSelect
                            employementTypes={employementTypes}
                            employementTypesList={employementTypesList}
                            setEmployementTypes={setEmployementTypes}
                          />
                        </Collapse>
                      )}
                    </Box>
                  ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={styles.footer}>
          <ActionButton
            label="Clear"
            color={styles.clearButton.color}
            onClick={clearFilters}
          />
          <ActionButton
            label="Apply"
            color={styles.applyButton.color}
            onClick={applyFilters}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default ContactFilters;
