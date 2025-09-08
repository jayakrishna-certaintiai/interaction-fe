import {
  TableBody, TableCell, TableRow, TextField, IconButton, Menu, MenuItem, Button, Box
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CompanyTableCell from "../Common/CompanyTableCell";
import ProjectTableCell from "../Common/ProjectTableCell";
import { formatFyscalYear } from "../../utils/helper/FormatFiscalYear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderTop: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 0.25,
  lineHeight: "-8.2",
  paddingTop: "1px"
};

const currencyCellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderTop: "1px solid #ddd",
  textAlign: "right",
  fontSize: "13px",
  py: 0.25,
  lineHeight: "-10.2",
  color: "#FD5707",
  paddingTop: "1px"
}

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

const ProjectsTableBody = ({ data, fetchProjects }) => {
  function formatCurrency(amount, locale, currency) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    let formattedAmount = formatter.format(amount);
    formattedAmount = formattedAmount.replace(/[a-zA-Z]/g, '').trim();

    return formattedAmount;
  };

  const [dataGatheringOptions, setDataGatheringOptions] = useState([]);
  const [projectStatusOptions, setProjectStatusOptions] = useState([]);
  const [timesheetStatusOptions, setTimesheetStatusOptions] = useState([]);
  const [fteSalaryStatusOptions, setFTESalaryStatusOptions] = useState([]);
  const [subconSalaryStatusOptions, setSubconSalaryStatusOptions] = useState([]);
  const [technicalInterviewStatusOptions, setTechnicalInterviewStatusOptions] = useState([]);
  const [technicalSummaryStatusOptions, setTechnicalSummaryStatusOptions] = useState([]);
  const [financialSummaryStatusOptions, setFinancialSummaryStatusOptions] = useState([]);
  const [claimsFormStatusOptions, setClaimsFormStatusOptions] = useState([]);
  const [finalReviewStatusOptions, setFinalReviewStatusOptions] = useState([]);
  const [interactionStatusOptions, setInteractionStatusOptions] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedColumnName, setSelectedColumnName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editMode, setEditMode] = useState([]);
  const [dataGatherAnchors, setDataGatherAnchors] = useState({});
  const [projectStatusAnchors, setProjectStatusAnchors] = useState({});
  const [timesheetStatusAnchors, setTimesheetStatusAnchors] = useState({});
  const [fteSalaryStatusAnchors, setFTESalaryStatusAnchors] = useState({});
  const [subconSalaryStatusAnchors, setSubconSalaryStatusAnchors] = useState({});
  const [techinterviewStatusAnchors, setTechInterviewStatusAnchors] = useState({});
  const [techSummaryStatusAnchors, setTechSummaryStatusAnchors] = useState({});
  const [financialSummaryStatusAnchors, setFinancialSummaryStatusAnchors] = useState({});
  const [ClaimsFormStatusAnchors, setClaimsFormStatusAnchors] = useState({});
  const [finalReviewStatusAnchors, setFinalReviewStatusAnchors] = useState({});
  const [interactionStatusAnchors, setInteractionStatusAnchors] = useState({});
  const [editFields, setEditFields] = useState({});
  const [showSaveCancelButtons, setShowSaveCancelButtons] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [highlightedFields, setHighlightedFields] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedValues({});
  }, [data]);

  const handleEditClick = (rowIndex, columnName, initialValue) => {
    setEditMode((prev) => [
      ...prev.filter(item => !(item.rowIndex === rowIndex && item.columnName === columnName)),
      { rowIndex, columnName, initialValue }
    ]);
    setEditedValues(prev => ({
      ...prev,
      [`${rowIndex}-${columnName}`]: initialValue
    }));

    setShowSaveCancelButtons(true);
  };

  const handleChange = (event, rowIndex, columnName, projectId, rndPotential = "no value") => {
    const currentValue = event.target.value;
    const numberRegex = /^-?\d*\.?\d*$/;
    if (!numberRegex.test(currentValue)) {
      setErrorMessages(prev => ({
        ...prev,
        [`${rowIndex}-${columnName}`]: "Enter only number"
      }));
      return;
    } else {
      setErrorMessages(prev => ({
        ...prev,
        [`${rowIndex}-${columnName}`]: ""
      }));
    }
    setEditedValues(prev => ({
      ...prev,
      [`${rowIndex}-${columnName}`]: currentValue
    }));
    setEditFields(prev => {
      const updatedEditFields = { ...prev };
      projectId = projectId.toString();
      if (!updatedEditFields[projectId]) {
        updatedEditFields[projectId] = {};
      }
      updatedEditFields[projectId][columnName] = currentValue;
      return updatedEditFields;
    });
    setHighlightedFields(prev => ({
      ...prev,
      [`${rowIndex}-${columnName}`]: true
    }));
    if (rndPotential !== "no value") {
      let rndAdjustment = parseFloat(currentValue);

      if (rndAdjustment + rndPotential < 0) {
        setErrorMessages(prev => ({
          ...prev,
          [`${rowIndex}-${columnName}`]: "QRE Final is Negitive"
        }));
        return;
      } else if (rndAdjustment + rndPotential > 100) {
        setErrorMessages(prev => ({
          ...prev,
          [`${rowIndex}-${columnName}`]: "QRE Final is exceeding 100"
        }));
        return;
      }
    }
  };

  const handleTextChange = (event, rowIndex, columnName, projectId) => {
    const currentValue = event.target.value;
    if (/\d/.test(currentValue)) {
      setErrorMessages(prev => ({
        ...prev,
        [`${rowIndex}-${columnName}`]: "Only text allow."
      }));
      return;
    } else {
      setErrorMessages(prev => ({
        ...prev,
        [`${rowIndex}-${columnName}`]: ""
      }));
    }

    setEditedValues(prev => ({
      ...prev,
      [`${rowIndex}-${columnName}`]: currentValue
    }));

    setEditFields(prev => {
      const updatedEditFields = { ...prev };
      projectId = projectId.toString();
      if (!updatedEditFields[projectId]) {
        updatedEditFields[projectId] = {};
      }
      updatedEditFields[projectId][columnName] = currentValue;
      return updatedEditFields;
    });

    setHighlightedFields(prev => ({
      ...prev,
      [`${rowIndex}-${columnName}`]: true
    }));
  };


  const handleKeyDown = async (e, rowIndex, columnName, projectId) => {
    const currentValue = e.target.value;
    setEditedValues(prev => ({
      ...prev,
      [`${rowIndex}-${columnName}`]: currentValue
    }));

    setEditFields(prev => {
      const updatedEditFields = { ...prev };
      projectId = projectId.toString();
      if (!updatedEditFields[projectId]) {
        updatedEditFields[projectId] = {};
      }
      updatedEditFields[projectId][columnName] = currentValue;
      return updatedEditFields;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BaseURL}/api/v1/projects/get-project-field-options`;
      try {
        // setLoading(false);
        const response = await axios.get(url, Authorization_header());
        setClaimsFormStatusOptions(response?.data?.data?.s_claims_form_status);
        setFinalReviewStatusOptions(response?.data?.data?.s_final_review_status);
        setFinancialSummaryStatusOptions(response?.data?.data?.s_financial_summary_status);
        setTechnicalSummaryStatusOptions(response?.data?.data?.s_technical_summary_status);
        setDataGatheringOptions(response?.data?.data?.s_data_gathering);
        setProjectStatusOptions(response?.data?.data?.s_project_status);
        setTimesheetStatusOptions(response?.data?.data?.s_timesheet_status);
        setFTESalaryStatusOptions(response?.data?.data?.s_fte_cost_status);
        setSubconSalaryStatusOptions(response?.data?.data?.s_subcon_cost_status);
        setTechnicalInterviewStatusOptions(response?.data?.data?.s_technical_interview_status);
        setInteractionStatusOptions(response?.data?.data?.s_interaction_status);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch Projects:", error);
      }
    };
    fetchData();
  }, []);


  const handleMenuItemClick = (value, columnName, projectId) => {
    handleMenuClose(projectId);
    setSelectedMenuItem(value);
    setSelectedColumnName(columnName);
    setSelectedProjectId(projectId);
    setEditedValues(prev => ({
      ...prev,
      [`${projectId}-${columnName}`]: value
    }));
    setEditFields(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {}),
        [columnName]: value
      }
    }));
    setHighlightedFields(prev => ({
      ...prev,
      [`${projectId}-${columnName}`]: true
    }));
    setShowSaveCancelButtons(true);
  };

  const handleStatusClick = (event, projectId, setter) => {
    setter((prev) => ({
      ...prev,
      [projectId]: event.currentTarget,
    }));
  };

  const handleMenuClose = (projectId) => {
    const setters = [
      setDataGatherAnchors,
      setProjectStatusAnchors,
      setTimesheetStatusAnchors,
      setFTESalaryStatusAnchors,
      setSubconSalaryStatusAnchors,
      setTechInterviewStatusAnchors,
      setTechSummaryStatusAnchors,
      setFinancialSummaryStatusAnchors,
      setClaimsFormStatusAnchors,
      setFinalReviewStatusAnchors,
      setInteractionStatusAnchors,
    ];
    setters.forEach((setter) => {
      setter((prev) => ({
        ...prev,
        [projectId]: null,
      }));
    });
  };

  const handleSave = async () => {
    const apiUrl = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/0/edit-project`;
    const data = {
      editFields: editFields
    };
    try {
      const response = await axios.post(apiUrl, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token_obj.accessToken}`
        }
      });

      if (response?.data?.success) {
        fetchProjects();
      } else {
        console.error("API call unsuccessful:", response?.data);
      }

      setEditFields({});
      setShowSaveCancelButtons(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancel = () => {
    fetchProjects();
    setEditFields([]);
    setEditedValues({});
    setShowSaveCancelButtons(false);
  };
  useEffect(() => {
  }, [projectStatusOptions]);

  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          < TableRow key={rowIndex} >
            <ProjectTableCell id={row?.projectId} name={row?.projectCode} />
            <ProjectTableCell id={row?.projectId} name={row?.projectName} />
            <CompanyTableCell id={row?.companyId} name={row?.companyName} />
            <TableCell sx={{ ...cellStyle, textAlign: "center" }}>{row?.fiscalYear ? formatFyscalYear(row?.fiscalYear) : ""}</TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-spocName`] ? "#ffead4" : "transparent",
                '&:hover .edit-icon': { opacity: 1 },
              }}
            >
              <div style={{ display: 'flex', alignItems: 'left', position: 'relative' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "spocName") ? (
                  <>
                    <TextField
                      value={editedValues[`${rowIndex}-spocName`] || ""}
                      onChange={(event) => handleTextChange(event, rowIndex, "spocName", row.projectId)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "spocName", row.projectId)}
                      variant="standard"
                      autoFocus
                      sx={{ flexGrow: 1 }}
                      error={!!errorMessages[`${rowIndex}-spocName`]}
                      helperText={errorMessages[`${rowIndex}-spocName`] || ""}
                    />
                  </>
                ) : (
                  <span>{row?.spocName || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "spocName") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "spocName", row.spocName, row.projectId)}
                    size="small"
                    sx={{
                      height: 15,
                      color: "rgba(64, 64, 64, 0.4)",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "left",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-spocEmail`] ? "#ffead4" : "transparent",
                '&:hover .edit-icon': { opacity: 1 },
              }}
            >
              <div style={{ display: 'flex', alignItems: 'left', position: 'relative' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "spocEmail") ? (
                  <>
                    <TextField
                      value={editedValues[`${rowIndex}-spocEmail`] || ""}
                      onChange={(event) => handleTextChange(event, rowIndex, "spocEmail", row.projectId)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "spocEmail", row.projectId)}
                      variant="standard"
                      autoFocus
                      sx={{ flexGrow: 1 }}
                      error={!!errorMessages[`${rowIndex}-spocEmail`]}
                      helperText={errorMessages[`${rowIndex}-spocEmail`] || ""}
                    />
                  </>
                ) : (
                  <span>{row?.spocEmail || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "spocEmail") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "spocEmail", row.spocEmail, row.projectId)}
                    size="small"
                    sx={{
                      height: 15,
                      color: "rgba(64, 64, 64, 0.4)",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_project_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_project_status`] || row?.s_project_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setProjectStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={projectStatusAnchors[row.projectId]}
                  open={Boolean(projectStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {projectStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_project_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle, textAlign: "right", position: 'relative', backgroundColor: highlightedFields[`${rowIndex}-s_fte_cost`] ? "#ffead4" : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_fte_cost") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_fte_cost`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_fte_cost", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_fte_cost", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_fte_cost`]}
                    helperText={errorMessages[`${rowIndex}-s_fte_cost`] || ""}
                  />
                ) : (
                  <span>{row?.s_fte_cost ? formatCurrency(row?.s_fte_cost, "en-US", row?.currency || "USD") : ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_fte_cost") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_fte_cost", row.s_fte_cost, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_subcon_cost`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_subcon_cost") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_subcon_cost`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_subcon_cost", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_subcon_cost", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_subcon_cost`]}
                    helperText={errorMessages[`${rowIndex}-s_subcon_cost`] || ""}
                  />
                ) : (
                  <span>{row?.s_subcon_cost ? formatCurrency(row?.s_subcon_cost, "en-US", row?.currency || "USD") : ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_subcon_cost") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_subcon_cost", row.s_subcon_cost, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.s_total_project_cost ? formatCurrency(row?.s_total_project_cost, "en-US", row?.currency || "USD") : ""}</TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_fte_hours`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_fte_hours") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_fte_hours`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_fte_hours", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_fte_hours", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_fte_hours`]}
                    helperText={errorMessages[`${rowIndex}-s_fte_hours`] || ""}
                  />
                ) : (
                  <span>{row?.s_fte_hours || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_fte_hours") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_fte_hours", row.s_fte_hours, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_subcon_hours`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_subcon_hours") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_subcon_hours`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_subcon_hours", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_subcon_hours", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_subcon_hours`]}
                    helperText={errorMessages[`${rowIndex}-s_subcon_hours`] || ""}
                  />
                ) : (
                  <span>{row?.s_subcon_hours || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_subcon_hours") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_subcon_hours", row.s_subcon_hours, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.s_total_hours}</TableCell>
            <TableCell sx={{ ...currencyCellStyle, textAlign: "left" }}>
              {row?.rndPotential !== null & row?.rndPotential !== undefined
                ? parseFloat(row?.rndPotential).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : ""}
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_rnd_adjustment`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_rnd_adjustment") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_rnd_adjustment`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_rnd_adjustment", row.projectId, row?.rndPotential)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_rnd_adjustment", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_rnd_adjustment`]}
                    helperText={errorMessages[`${rowIndex}-s_rnd_adjustment`] || ""}
                  />
                ) : (
                  <span>{row?.s_rnd_adjustment || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_rnd_adjustment") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_rnd_adjustment", row.s_rnd_adjustment, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell sx={{ ...currencyCellStyle, textAlign: "left" }}>
              {row?.rndFinal !== null & row?.rndFinal !== undefined
                ? parseFloat(row?.rndFinal).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : ""}
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_fte_qre_cost`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_fte_qre_cost") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_fte_qre_cost`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_fte_qre_cost", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_fte_qre_cost", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_fte_qre_cost`]}
                    helperText={errorMessages[`${rowIndex}-s_fte_qre_cost`] || ""}
                  />
                ) : (
                  <span>{row?.s_fte_qre_cost ? formatCurrency(row?.s_fte_qre_cost, "en-US", row?.currency || "USD") : ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_fte_qre_cost") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_fte_qre_cost", row.s_fte_qre_cost, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_subcon_qre_cost`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_subcon_qre_cost") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_subcon_qre_cost`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_subcon_qre_cost", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_subcon_qre_cost", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_subcon_qre_cost`]}
                    helperText={errorMessages[`${rowIndex}-s_subcon_qre_cost`] || ""}
                  />
                ) : (
                  <span>{row?.s_subcon_qre_cost ? formatCurrency(row?.s_subcon_qre_cost, "en-US", row?.currency || "USD") : ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_subcon_qre_cost") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_subcon_qre_cost", row.s_subcon_qre_cost, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.s_qre_cost ? formatCurrency(row?.s_qre_cost, "en-US", row?.currency || "USD") : ""}</TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_rd_credits`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_rd_credits") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_rd_credits`] || ""}
                    onChange={(event) => handleChange(event, rowIndex, "s_rd_credits", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_rd_credits", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                    error={!!errorMessages[`${rowIndex}-s_rd_credits`]}
                    helperText={errorMessages[`${rowIndex}-s_rd_credits`] || ""}
                  />
                ) : (
                  <span>{row?.s_rd_credits ? formatCurrency(row?.s_rd_credits, "en-US", row?.currency || "USD") : ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_rd_credits") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_rd_credits", row.s_rd_credits, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_data_gathering`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_data_gathering`] || row?.s_data_gathering || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setDataGatherAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={dataGatherAnchors[row.projectId]}
                  open={Boolean(dataGatherAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {dataGatheringOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_data_gathering", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_pending_data") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_pending_data`] || ""}
                    onChange={(event) => handleTextChange(event, rowIndex, "s_pending_data", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_pending_data", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                  />
                ) : (
                  <span>{row?.s_pending_data || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_pending_data") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_pending_data", row.s_pending_data, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_timesheet_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_timesheet_status`] || row?.s_timesheet_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setTimesheetStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={timesheetStatusAnchors[row.projectId]}
                  open={Boolean(timesheetStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {timesheetStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_timesheet_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_fte_cost_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_fte_cost_status`] || row?.s_fte_cost_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setFTESalaryStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={fteSalaryStatusAnchors[row.projectId]}
                  open={Boolean(fteSalaryStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {fteSalaryStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_fte_cost_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_subcon_cost_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_subcon_cost_status`] || row?.s_subcon_cost_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setSubconSalaryStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={subconSalaryStatusAnchors[row.projectId]}
                  open={Boolean(subconSalaryStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {subconSalaryStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_subcon_cost_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707", textAlign: "left" }}>
              <Link>
                {row?.surveyStatus
                  ? row?.surveyStatus
                    .toLowerCase()
                    .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                    .trim()
                  : ""}
              </Link>
            </TableCell>
            <TableCell sx={currencyCellStyle}>{row?.surveySentDate?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
            <TableCell sx={currencyCellStyle}>{row?.reminderSentDate?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
            <TableCell sx={currencyCellStyle}>{row?.surveyResponseDate?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
            {/* <TableCell sx={currencyCellStyle}>{row?.surveyResponse}</TableCell> */}
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_interaction_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_interaction_status`] || row?.s_interaction_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setInteractionStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={interactionStatusAnchors[row.projectId]}
                  open={Boolean(interactionStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {interactionStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_interaction_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_technical_interview_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_technical_interview_status`] || row?.s_technical_interview_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setTechInterviewStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={techinterviewStatusAnchors[row.projectId]}
                  open={Boolean(techinterviewStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {technicalInterviewStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_technical_interview_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_technical_summary_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_technical_summary_status`] || row?.s_technical_summary_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setTechSummaryStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={techSummaryStatusAnchors[row.projectId]}
                  open={Boolean(techSummaryStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {technicalSummaryStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_technical_summary_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_financial_summary_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_financial_summary_status`] || row?.s_financial_summary_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setFinancialSummaryStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={financialSummaryStatusAnchors[row.projectId]}
                  open={Boolean(financialSummaryStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {financialSummaryStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_financial_summary_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_claims_form_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_claims_form_status`] || row?.s_claims_form_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setClaimsFormStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={ClaimsFormStatusAnchors[row.projectId]}
                  open={Boolean(ClaimsFormStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {claimsFormStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_claims_form_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${row.projectId}-s_final_review_status`] ? "#ffead4" : "transparent",
                '&:hover .dropdown-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editedValues[`${row.projectId}-s_final_review_status`] || row?.s_final_review_status || ""}
                {row.projectId && (
                  <IconButton
                    onClick={(event) => handleStatusClick(event, row.projectId, setFinalReviewStatusAnchors)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute", right: 0,
                    }}
                    className="dropdown-icon"
                  >
                    <ArrowDropDownIcon sx={{ color: "rgba(64, 64, 64, 0.4)" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={finalReviewStatusAnchors[row.projectId]}
                  open={Boolean(finalReviewStatusAnchors[row.projectId])}
                  onClose={() => handleMenuClose(row.projectId)}
                >
                  {finalReviewStatusOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => handleMenuItemClick(option, "s_final_review_status", row.projectId)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </TableCell>
            {/* <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.s_notes}</TableCell> */}
            <TableCell
              sx={{
                ...cellStyle,
                textAlign: "right",
                position: 'relative',
                backgroundColor: highlightedFields[`${rowIndex}-s_`]
                  ? "#ffead4"
                  : "transparent",
                '&:hover .edit-icon': {
                  opacity: 1,
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_notes") ? (
                  <TextField
                    value={editedValues[`${rowIndex}-s_notes`] || ""}
                    onChange={(event) => handleTextChange(event, rowIndex, "s_notes", row.projectId)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "s_notes", row.projectId)}
                    variant="standard"
                    autoFocus
                    sx={{ flexGrow: 1 }}
                  />
                ) : (
                  <span>{row?.s_notes || ""}</span>
                )}
                {row.projectId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "s_notes") && (
                  <IconButton
                    onClick={() => handleEditClick(rowIndex, "s_notes", row.s_notes, row.projectId)}
                    size="small"
                    sx={{
                      height: 15, color: "rgba(64, 64, 64, 0.4)", opacity: 0, transition: "opacity 0.2s", position: "absolute",
                      right: 0,
                      ':hover': { opacity: 1 },
                    }}
                    className="edit-icon"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </TableCell>
            <TableCell sx={currencyCellStyle}>{row?.s_last_updated_timestamp?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
            {/* <TableCell sx={currencyCellStyle}>{formattedResponseDate}</TableCell> */}
            <TableCell sx={currencyCellStyle}>{row?.s_last_updated_by}</TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.projectIdentifier}</TableCell>
          </TableRow >
        ))}
      </TableBody >
      {showSaveCancelButtons && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            marginTop: -4,
            left: 0,
            width: "100%",
            display: "flex",
            gap: 2,
            justifyContent: "center",
            bgcolor: "background.paper",
            py: 1,
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            onClick={handleCancel}
            sx={{ bgcolor: "#9F9F9F", height: "2em", width: "5.5em", "&:hover": { bgcolor: "#9F9F9F" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#00A398", height: "2em", "&:hover": { bgcolor: "#00A398" } }}
          >
            Save
          </Button>
        </Box>
      )}
    </>
  );
}

export default ProjectsTableBody;