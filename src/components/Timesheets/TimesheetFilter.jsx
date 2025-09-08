import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Drawer,
  IconButton,
  FormControlLabel,
  Checkbox,
  Collapse,
  TextField,
  InputBase,
  InputAdornment,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { TimesheetContext } from "../../context/TimesheetContext";
import CompanySelector from "../FilterComponents/CompanySelector";
import MonthSelector from "../FilterComponents/MonthSelector.";
import SliderInput from "../FilterComponents/SliderInput";
import { MonthNames } from "../../constants/Months";
import ActionButton from "../FilterComponents/ActionButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccYearSelector from "../FilterComponents/AccYearSelector";
import CancelIcon from "@mui/icons-material/Cancel";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import SpocNameFilters from "../FilterComponents/SpocNameFilters";
import SpocEmailFilters from "../FilterComponents/SpocEmailFilters";
import StatusFilter from "../FilterComponents/StatusFilter";
import UploadedBy from "../FilterComponents/UploadedBy";
import InputBox from "../Common/InputBox";
import { useFormik } from "formik";

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
      // borderRadius: "20px",
      height: "72.5%",
      display: "flex",
      flexDirection: "column",
      marginTop: "11.5rem",
      marginLeft: "20px",
      borderBottom: "1px solid #E4E4E4",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      borderLeft: "1px solid #E4E4E4",
    },
  },
  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 10,
    marginTop: "-0%",
    width: "17rem"
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #E4E4E4",
    borderTop: "1px solid #E4E4E4",
    px: 2,
    height: "35px",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "500",
    textTransform: "capitalize",
    marginRight: '-2px',
    color: 'black',
    fontSize: '16px',
    position: "sticky",
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

function TimesheetFilters({ open, handleClose, clientData, onApplyFilters }) {
  const {
    timesheetFilterState,
    setTimesheetFilterState,
    clearTimesheetFilterTrigger,
    setIsTimesheetFilterApplied,
    triggerTimesheetClearFilters,
    fetchTimesheets,
  } = useContext(TimesheetContext);
  const { clientList } = useContext(FilterListContext);
  const [company, setCompany] = useState(timesheetFilterState.company || []);
  const [showCompany, setShowCompany] = useState(false);
  const [accYear, setAccYear] = useState(timesheetFilterState.accYear);
  // const [accountingYearList, setAccountingYearList] = useState([]);
  const [status, setStatus] = useState(timesheetFilterState.status || []);
  const [statusList, setStatusList] = useState([]);
  const [showStatus, setShowStatus] = useState(false);
  const [uploadedBy, setUploadedBy] = useState(timesheetFilterState.uploadedBy || []);
  const [uploadedByList, setUploadedByList] = useState([]);
  const [showUploadedBy, setShowUploadedBy] = useState(false);
  // const [uploadedOn, setUploadedOn] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showUploadedOn, setShowUploadedOn] = useState(false);
  const [showAccountingYear, setShowAccountingYear] = useState(false);
  const [showTotalHours, setShowTotalHours] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [projectsCountError, setProjectsCountError] = useState('');
  const [positiveNumberError, setPositiveNumberError] = useState('');
  const [accountingYearList, setAccountingYearList] = useState([]);
  const [triggerFilter, setTriggerFilter] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const filterFields = [
    { label: 'Account' },
    { label: 'Fiscal Year' },
    { label: 'Status' },
    { label: 'Uploaded By' },
    { label: 'Total Hours' },
    // { label: 'Start Date' },
    // { label: 'End Date' },
    { label: 'Uploaded On' },
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
  const handleFilterChange = ({ field, scale }) => (event, newValue) => {
    const value = newValue ?? event.target.value;

    if (value < 0) {
      setPositiveNumberError("Only positive num.");
    } else {
      setPositiveNumberError("");
    }
    setTimesheetFilterState((prev) => {
      if (scale === "min" || scale === "max") {
        const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [];
        updatedField[scale === "min" ? 0 : 1] = value;

        // Validation for min and max
        const minValue = parseFloat(updatedField[0]);
        const maxValue = parseFloat(updatedField[1]);

        if (minValue && maxValue && minValue > maxValue) {
          setProjectsCountError("Max should be greater than Min");
        } else {
          setProjectsCountError('');
        }

        return {
          ...prev,
          [field]: updatedField
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });

  };

  // const handleFilterChange = (field) => (event, newValue) => {
  //   const value = newValue ?? event.target.value;
  //   setTimesheetFilterState({
  //     ...timesheetFilterState,
  //     [field]: value,
  //   });
  // };

  useEffect(() => {
    setTimesheetFilterState((prevState) => ({
      ...prevState,
      companyId: [
        clientData?.find((companyItem) => companyItem?.companyName === company)?.companyId,
      ],
      company,
      status,
      countryId: [
        statusList?.find((proj) => proj?.countryName === status)?.countryId,
        uploadedByList?.find((proj) => proj?.countryName === uploadedBy)?.countryId,
        accountingYearList?.find((proj) => proj?.countryName === accYear)?.accYearId,
      ],
      uploadedBy,
      accYear,
      startDate,
      endDate,
    }));
  }, [company, status, uploadedBy, accYear, startDate, endDate]);


  // useEffect(() => {
  //   setTimesheetFilterState({
  //     ...timesheetFilterState,
  //     accountingYear: accYear === "" ? [] : [accYear],
  //     accYear: accYear,
  //   });
  // }, [accYear]);


  const fetchData = async () => {
    try {
      const url = `${BaseURL}/api/v1/timesheets/get-timesheet-filter-values`;
      const response = await axios.get(url, Authorization_header());
      const data = response?.data?.data || {};

      setCompany(data?.companyIds || []);
      setStatusList(data?.status || []);
      setUploadedByList(data?.uploadedBy || []);
      setAccountingYearList(data?.fiscalYears || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timesheetFilterState?.companyIds]);


  useEffect(() => {
    if (clearTimesheetFilterTrigger) {
      setCompany([]);
      setAccYear([]);
      setStatus([]);
      setUploadedBy([]);
      setTimesheetFilterState({
        ...timesheetFilterState,
        companyId: [],
        company: [],
        accountingYear: [],
        accYear: [],
        totalhours: [0, null],
        status: [],
        uploadedBy: [],
      });
      setShowTotalHours(false);
      setIsTimesheetFilterApplied(false);
      setShowAccountingYear(false);
      setShowCompany(false);
      setShowStatus(false);
      setShowUploadedBy(false);
    }
  }, [clearTimesheetFilterTrigger]);

  useEffect(() => {
    const shouldFetchWithFiltersTimesheet =
      timesheetFilterState.companyId.length > 0 ||
      timesheetFilterState.accountingYear.length > 0 ||
      timesheetFilterState.totalhours.length > 0;
    if (shouldFetchWithFiltersTimesheet) {
      let timesheetOptions = {
        ...(timesheetFilterState.companyId.length > 0 && {
          company: timesheetFilterState.companyId,
        }),
        ...(timesheetFilterState.accountingYear.length > 0 && {
          accountingYear: timesheetFilterState.accountingYear,
        }),
        ...(timesheetFilterState.totalhours && {
          minTotalhours: timesheetFilterState.totalhours[0],
        }),
        ...(timesheetFilterState.totalhours && {
          maxTotalhours: timesheetFilterState.totalhours[1],
        }),
      };
    }
  }, [timesheetFilterState]);

  const clearFilters = () => {
    setCompany([]);
    setAccYear([]);
    setStatus([]);
    setUploadedBy([]);
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setTimesheetFilterState({
      ...timesheetFilterState,
      companyId: [],
      accountingYear: [],
      accYear: [],
      company: [],
      status: [],
      UploadedBy: [],
      totalhours: [0, null],
      startDate: '',
      endDate: '',
    });
    setPositiveNumberError('');
    setProjectsCountError('');
    onApplyFilters({});
    triggerTimesheetClearFilters();
    setTriggerFilter(true);
  };

  useEffect(() => {
    if (triggerFilter) {
      applyFilters();
    }
  }, [triggerFilter])


  const applyFilters = () => {
    const filters = {
      ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
      ...(accYear?.length > 0 && { accYear }),
      ...(status?.length > 0 && { status }),
      ...(uploadedBy?.length > 0 && { uploadedBy }),
      // ...(uploadedOn && uploadedOn.length > 0 && { uploadedOn }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(timesheetFilterState.totalhours && {
        minTotalhours: timesheetFilterState.totalhours[0],
      }),
      ...(timesheetFilterState.totalhours && {
        maxTotalhours: timesheetFilterState.totalhours[1],
      }),
    };

    fetchTimesheets(filters);
    setTriggerFilter(false);
  };

  const handleDateChange = (dateType) => (event) => {
    if (dateType === 'startDate') {
      setStartDate(event.target.value);
    } else if (dateType === 'endDate') {
      setEndDate(event.target.value);
    }
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
          <Typography sx={styles.title}>
            {/* {page === "company" ? "Account" : page} */}
            Timesheet Filter
          </Typography>
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
                                  : field.label === "Fiscal Year"
                                    ? showAccountingYear
                                    : field.label === "Status"
                                      ? showStatus
                                      : field.label === "Uploaded By"
                                        ? showUploadedBy
                                        : field.label === "Total Hours"
                                          ? showTotalHours
                                          : field.label === "Uploaded On"
                                            ? showUploadedOn
                                            // : field.label === "Start Date"
                                            //   ? showUploadedOn
                                            //   : field.label === "End Date"
                                            //     ? showUploadedOn
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
                                } else if (field.label === "Fiscal Year") {
                                  if (e.target.checked) {
                                    setShowAccountingYear(true);
                                  } else {
                                    setShowAccountingYear(false);
                                    setAccYear([]);
                                  }
                                } else if (field.label === "Status") {
                                  if (e.target.checked) {
                                    setShowStatus(true);
                                  } else {
                                    setShowStatus(false);
                                    setStatus([]);
                                  }
                                } else if (field.label === "Uploaded By") {
                                  if (e.target.checked) {
                                    setShowUploadedBy(true);
                                  } else {
                                    setShowUploadedBy(false);
                                    setUploadedBy([]);
                                  }
                                } else if (field.label === "Total Hours") {
                                  if (e.target.checked) {
                                    setShowTotalHours(true);
                                  } else {
                                    setShowTotalHours(false);
                                    setTimesheetFilterState(prev => ({
                                      ...prev,
                                      totalhours: [0, null],
                                    }));
                                  }
                                }
                                // else if (field.label === "Uploaded On") {
                                //   if (e.target.checked) {
                                //     setShowUploadedOn(true);
                                //   } else {
                                //     setShowUploadedOn(false);
                                //     setUploadedOn([]);
                                //   }
                                // }
                                // else if (field.label === "Start Date") {
                                //   if (e.target.checked) {
                                //     setShowStartDate(true);
                                //   } else {
                                //     setShowStartDate(false);
                                //     setStartDate([]);
                                //   }
                                // }
                                // else if (field.label === "End Date") {
                                //   if (e.target.checked) {
                                //     setShowEndDate(true);
                                //   } else {
                                //     setShowEndDate(false);
                                //     setEndDate([]);
                                //   }
                                // }
                                else if (field.label === "Uploaded On") {
                                  setShowUploadedOn(e.target.checked);
                                  if (!e.target.checked) {
                                    setStartDate("");
                                    setEndDate("");
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
                          <CompanySelector
                            clientList={clientList}
                            company={company}
                            setCompany={setCompany}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Fiscal Year' && (
                        <Collapse in={showAccountingYear}>
                          <AccYearSelector fiscalYear={accYear} setAccountingYear={setAccYear} accountingYearList={accountingYearList} />
                        </Collapse>
                      )}
                      {field.label === 'Status' && (
                        <Collapse in={showStatus}>
                          <StatusFilter
                            status={status}
                            statusList={statusList}
                            setStatus={setStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Uploaded By' && (
                        <Collapse in={showUploadedBy}>
                          <UploadedBy
                            uploadedBy={uploadedBy}
                            uploadedByList={uploadedByList}
                            setUploadedBy={setUploadedBy}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Total Hours' && (
                        <Collapse in={showTotalHours}>
                          {/* <Box display="flex" flexDirection="column" gap={3}> */}
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={timesheetFilterState.totalhours[0] || ''}
                              onChange={handleFilterChange({ field: "totalhours", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!positiveNumberError}
                              helperText={positiveNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' }, // Align to the leftmost, no padding or margin
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={timesheetFilterState.totalhours[1] || ''}
                              onChange={handleFilterChange({ field: "totalhours", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            // error={!!positiveNumberError}
                            // helperText={positiveNumberError || ""}
                            />
                          </Box>

                          {projectsCountError && (
                            <Typography color="error" variant="body2">
                              {projectsCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {/* {field.label === 'Uploaded On' && (
                        <Collapse in={showUploadedOn}>
                          <input
                            type="date"
                            value={uploadedOn || ""}
                            onChange={(e) => setUploadedOn(e.target.value)}
                          />
                        </Collapse>
                      )} */}
                      {/* {field.label === 'Start Date' && (
                        <Collapse in={showStartDate}>
                          <input
                            type="date"
                            value={startDate || ""}
                            onChange={handleDateChange('startDate')}
                          />
                        </Collapse>
                      )}
                      {field.label === 'End Date' && (
                        <Collapse in={showEndDate}>
                          <input
                            type="date"
                            value={endDate || ""}
                            onChange={handleDateChange('endDate')}
                          />
                        </Collapse>
                      )} */}
                      {field.label === 'Uploaded On' && (
                        <Collapse in={showUploadedOn}>
                          <Box display="flex" gap={3}>
                            <TextField
                              type="date"
                              label="Start Date"
                              value={startDate || ""}
                              onChange={handleDateChange('startDate')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                            <TextField
                              type="date"
                              label="End Date"
                              value={endDate || ""}
                              onChange={handleDateChange('endDate')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                          </Box>
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
          {/* <ActionButton
              label="Cancel"
              color="#9F9F9F"
              onClick={handleClose}
            /> */}
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

export default TimesheetFilters;