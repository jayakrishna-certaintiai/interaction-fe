import { Box, Button, IconButton, Menu, MenuItem, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import ContactTableCell from "../Common/ContactTableCell";
import CompanyTableCell from "../Common/CompanyTableCell";
import ProjectTableCell from "../Common/ProjectTableCell";
import { formatCurrency } from "../../utils/helper/FormatCurrency";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from "@mui/icons-material/Edit";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    fontSize: "13px",
    py: 1,
    px: 0,
};

const currencyCellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "right",
    fontSize: "13px",
    py: 1,
    color: "#FD5707",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
};

//   const tableData = {
//     columns: [
//         "Employee ID",
//         "Employee Name",
//         "Employement Type",
//         "Company Name",
//         "Project Code",
//         "Project Name",
//         "Total Hours",
//         "Hourly Rate",
//         "Total Cost",
//         "QRE Potential (%)",
//         "QRE Hours",
//         "QRE Cost",
//     ],
// };

const ProjectsTeamTableBody = ({ data, getProjectsTeamMembers }) => {
    const [employementTypeOptions, setEmployeementTypeOptions] = useState([]);
    const [selectedTeamMemberId, setSelectedTeamMemberId] = useState(null);
    const [editMode, setEditMode] = useState([]);
    const [employementTypeAnchors, setEmployementTypeAnchors] = useState({});
    const [editFields, setEditFields] = useState({});
    const [showSaveCancelButtons, setShowSaveCancelButtons] = useState(false);
    const [editedValues, setEditedValues] = useState({});
    const [highlightedFields, setHighlightedFields] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [selectedColumnName, setSelectedColumnName] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(null);

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

    const handleChange = (event, rowIndex, columnName, teamMemberId, rndPotential = "no value") => {
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
            teamMemberId = teamMemberId.toString();
            if (!updatedEditFields[teamMemberId]) {
                updatedEditFields[teamMemberId] = {};
            }
            updatedEditFields[teamMemberId][columnName] = currentValue;
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

    const handleTextChange = (event, rowIndex, columnName, teamMemberId) => {
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
            teamMemberId = teamMemberId.toString();
            if (!updatedEditFields[teamMemberId]) {
                updatedEditFields[teamMemberId] = {};
            }
            updatedEditFields[teamMemberId][columnName] = currentValue;
            return updatedEditFields;
        });

        setHighlightedFields(prev => ({
            ...prev,
            [`${rowIndex}-${columnName}`]: true
        }));
    };

    const handleKeyDown = async (e, rowIndex, columnName, teamMemberId) => {
        const currentValue = e.target.value;
        setEditedValues(prev => ({
            ...prev,
            [`${rowIndex}-${columnName}`]: currentValue
        }));

        setEditFields(prev => {
            const updatedEditFields = { ...prev };
            teamMemberId = teamMemberId.toString();
            if (!updatedEditFields[teamMemberId]) {
                updatedEditFields[teamMemberId] = {};
            }
            updatedEditFields[teamMemberId][columnName] = currentValue;
            return updatedEditFields;
        });
    };

    useEffect(() => {
        async function fetchData() {
            const url = `${BaseURL}/api/v1/contacts/get-contact-field-options`;
            const response = await axios.get(url, Authorization_header());
            setEmployeementTypeOptions(response?.data?.data?.employementTypes)
        }
        fetchData();
    }, []);

    const handleMenuItemClick = (value, columnName, teamMemberId) => {
        handleMenuClose(teamMemberId);
        setSelectedMenuItem(value);
        setSelectedColumnName(columnName);
        setSelectedProjectId(teamMemberId);
        setEditedValues(prev => ({
            ...prev,
            [`${teamMemberId}-${columnName}`]: value
        }));
        setEditFields(prev => ({
            ...prev,
            [teamMemberId]: {
                ...(prev[teamMemberId] || {}),
                [columnName]: value
            }
        }));
        setHighlightedFields(prev => ({
            ...prev,
            [`${teamMemberId}-${columnName}`]: true
        }));
        setShowSaveCancelButtons(true);
    };

    const handleStatusClick = (event, teamMemberId, setter) => {
        setter((prev) => ({
            ...prev,
            [teamMemberId]: event.currentTarget,
        }));
    };

    const handleMenuClose = (teamMemberId) => {
        const setters = [
            setEmployementTypeAnchors,
        ];
        setters.forEach((setter) => {
            setter((prev) => ({
                ...prev,
                [teamMemberId]: null,
            }));
        });
    };

    const handleSave = async () => {
        const apiUrl = `${BaseURL}/api/v1/contacts/update-team-member`;
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
                getProjectsTeamMembers();
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
        getProjectsTeamMembers();
        setEditFields([]);
        setEditedValues({});
        setShowSaveCancelButtons(false);
    };

    return (
        <>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow id={rowIndex}>
                        <ContactTableCell id={row?.contactId} name={row?.employeeId} />
                        <ContactTableCell id={row?.contactId} name={row?.firstName || row?.lastName ? row?.firstName + " " + row?.lastName : ""} />
                        {/* <TableCell sx={{ ...cellStyle, textAlign: "left" }} id={row?.teamMemberId} > {row?.employementType || ""} </TableCell> */}
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                px: "2",
                                backgroundColor: highlightedFields[`${row.teamMemberId}-employementType`] ? "#ffead4" : "transparent",
                                '&:hover .dropdown-icon': {
                                    opacity: 1,
                                }
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {editedValues[`${row.teamMemberId}-employementType`] || row?.employementType || ""}
                                {row.teamMemberId && (
                                    <IconButton
                                        onClick={(event) => handleStatusClick(event, row.teamMemberId, setEmployementTypeAnchors)}
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
                                    anchorEl={employementTypeAnchors[row.teamMemberId]}
                                    open={Boolean(employementTypeAnchors[row.teamMemberId])}
                                    onClose={() => handleMenuClose(row.teamMemberId)}
                                >
                                    {employementTypeOptions.map((option) => (
                                        <MenuItem
                                            key={option}
                                            onClick={() => handleMenuItemClick(option, "employementType", row.teamMemberId)}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </TableCell>
                        {/* <TableCell sx={{ ...cellStyle, textAlign: "left" }} id={row?.teamMemberId}>{row?.employeeTitle}</TableCell> */}
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                backgroundColor: highlightedFields[`${rowIndex}-employeeTitle`] ? "#ffead4" : "transparent",
                                '&:hover .edit-icon': { opacity: 1 },
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'left', position: 'relative' }}>
                                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "employeeTitle") ? (
                                    <>
                                        <TextField
                                            value={editedValues[`${rowIndex}-employeeTitle`] || ""}
                                            onChange={(event) => handleTextChange(event, rowIndex, "employeeTitle", row.teamMemberId)}
                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, "employeeTitle", row.teamMemberId)}
                                            variant="standard"
                                            autoFocus
                                            sx={{ flexGrow: 1 }}
                                            error={!!errorMessages[`${rowIndex}-employeeTitle`]}
                                            helperText={errorMessages[`${rowIndex}-employeeTitle`] || ""}
                                        />
                                    </>
                                ) : (
                                    <span>{row?.employeeTitle || ""}</span>
                                )}
                                {row.teamMemberId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "employeeTitle") && (
                                    <IconButton
                                        onClick={() => handleEditClick(rowIndex, "employeeTitle", row.employeeTitle, row.teamMemberId)}
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
                        <CompanyTableCell id={row?.companyId} name={row?.companyName} />
                        <ProjectTableCell id={row?.projectId} name={row?.projectCode} />
                        <ProjectTableCell id={row?.projectId} name={row?.projectName} />
                        {/* <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.totalHours}</TableCell> */}
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                backgroundColor: highlightedFields[`${rowIndex}-totalHours`]
                                    ? "#ffead4"
                                    : "transparent",
                                '&:hover .edit-icon': {
                                    opacity: 1,
                                }
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end", // Align content to the right
                                alignItems: "center", // Align items vertically center
                                // gap: "8px", // Add gap between content and IconButton
                            }}>
                                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "totalHours") ? (
                                    <TextField
                                        value={editedValues[`${rowIndex}-totalHours`] || ""}
                                        onChange={(event) => handleChange(event, rowIndex, "totalHours", row.teamMemberId)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, "totalHours", row.teamMemberId)}
                                        variant="standard"
                                        autoFocus
                                        sx={{ flexGrow: 1 }}
                                        error={!!errorMessages[`${rowIndex}-totalHours`]}
                                        helperText={errorMessages[`${rowIndex}-totalHours`] || ""}
                                    />
                                ) : (
                                    <span >{row?.totalHours || ""}</span>
                                )}
                                {row.teamMemberId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "totalHours") && (
                                    <IconButton
                                        onClick={() => handleEditClick(rowIndex, "totalHours", row.totalHours, row.teamMemberId)}
                                        size="small"
                                        sx={{
                                            height: 15,
                                            color: "rgba(64, 64, 64, 0.4)",
                                            opacity: 0,
                                            transition: "opacity 0.2s",
                                            margin: 0, // Remove any margin
                                            padding: 0, // Remove any padding
                                            ":hover": { opacity: 1 },
                                        }}
                                        className="edit-icon"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </div>
                        </TableCell>
                        <TableCell id={row?.teamMemberId} sx={{ ...currencyCellStyle, color: "#00A398", }}>{row?.hourlyRate ? formatCurrency(row?.hourlyRate, "en-US", row?.currency || "USD") : ""}</TableCell>
                        {/* <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                backgroundColor: highlightedFields[`${rowIndex}-hourlyRate`]
                                    ? "#ffead4"
                                    : "transparent",
                                '&:hover .edit-icon': {
                                    opacity: 1,
                                }
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end", // Align content to the right
                                alignItems: "center", // Align items vertically center
                                // gap: "8px", // Add gap between content and IconButton
                            }}>
                                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "hourlyRate") ? (
                                    <TextField
                                        value={editedValues[`${rowIndex}-hourlyRate`] || ""}
                                        onChange={(event) => handleChange(event, rowIndex, "hourlyRate", row.teamMemberId)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, "hourlyRate", row.teamMemberId)}
                                        variant="standard"
                                        autoFocus
                                        sx={{ flexGrow: 1 }}
                                        error={!!errorMessages[`${rowIndex}-hourlyRate`]}
                                        helperText={errorMessages[`${rowIndex}-hourlyRate`] || ""}
                                    />
                                ) : (
                                    <span>{row?.hourlyRate ? formatCurrency(row?.hourlyRate, "en-US", row?.currency || "USD") : ""}</span>
                                )}
                                {row.teamMemberId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "hourlyRate") && (
                                    <IconButton
                                        onClick={() => handleEditClick(rowIndex, "hourlyRate", row.hourlyRate, row.teamMemberId)}
                                        size="small"
                                        sx={{
                                            height: 15,
                                            color: "rgba(64, 64, 64, 0.4)",
                                            opacity: 0,
                                            transition: "opacity 0.2s",
                                            margin: 0, // Remove any margin
                                            padding: 0, // Remove any padding
                                            ":hover": { opacity: 1 },
                                        }}
                                        className="edit-icon"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </div>
                        </TableCell> */}
                        {/* <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.totalCost ? formatCurrency(row?.totalCost, "en-US", row?.currency || "USD") : ""}</TableCell> */}
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                backgroundColor: highlightedFields[`${rowIndex}-totalCost`]
                                    ? "#ffead4"
                                    : "transparent",
                                '&:hover .edit-icon': {
                                    opacity: 1,
                                },

                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end", // Align content to the right
                                alignItems: "center", // Align items vertically center
                                margin: 0,
                                padding: 0,

                                // gap: "8px", // Add gap between content and IconButton
                            }}>
                                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "totalCost") ? (
                                    <TextField
                                        value={editedValues[`${rowIndex}-totalCost`] || ""}
                                        onChange={(event) => handleChange(event, rowIndex, "totalCost", row.teamMemberId)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, "totalCost", row.teamMemberId)}
                                        variant="standard"
                                        autoFocus
                                        sx={{ flexGrow: 1 }}
                                        error={!!errorMessages[`${rowIndex}-totalCost`]}
                                        helperText={errorMessages[`${rowIndex}-totalCost`] || ""}
                                    />
                                ) : (
                                    <span>{row?.totalCost ? formatCurrency(row?.totalCost, "en-US", row?.currency || "USD") : ""}</span>
                                )}
                                {row.teamMemberId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "totalCost") && (
                                    <IconButton
                                        onClick={() => handleEditClick(rowIndex, "totalCost", row.totalCost, row.teamMemberId)}
                                        size="small"
                                        sx={{
                                            height: 15,
                                            color: "rgba(64, 64, 64, 0.4)",
                                            opacity: 0,
                                            transition: "opacity 0.2s",
                                            margin: 0, // Remove any margin
                                            padding: 0, // Remove any padding
                                            ":hover": { opacity: 1 },
                                        }}
                                        className="edit-icon"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </div>
                        </TableCell>
                        <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.rndPotential}</TableCell>
                        {/* <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.rndCredits ? formatCurrency(row?.rndCredits, "en-US", row?.currency || "USD") : ""}</TableCell> */}
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                backgroundColor: highlightedFields[`${rowIndex}-rndCredits`]
                                    ? "#ffead4"
                                    : "transparent",
                                '&:hover .edit-icon': {
                                    opacity: 1,
                                }
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end", // Align content to the right
                                alignItems: "center", // Align items vertically center
                                margin: 0,
                                padding: 0,

                                // gap: "8px", // Add gap between content and IconButton
                            }}>
                                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "rndCredits") ? (
                                    <TextField
                                        value={editedValues[`${rowIndex}-rndCredits`] || ""}
                                        onChange={(event) => handleChange(event, rowIndex, "rndCredits", row.teamMemberId)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, "rndCredits", row.teamMemberId)}
                                        variant="standard"
                                        autoFocus
                                        sx={{ flexGrow: 1 }}
                                        error={!!errorMessages[`${rowIndex}-rndCredits`]}
                                        helperText={errorMessages[`${rowIndex}-rndCredits`] || ""}
                                    />
                                ) : (
                                    <span>{row?.rndCredits || ""}</span>
                                )}
                                {row.teamMemberId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "rndCredits") && (
                                    <IconButton
                                        onClick={() => handleEditClick(rowIndex, "rndCredits", row.rndCredits, row.teamMemberId)}
                                        size="small"
                                        sx={{
                                            height: 15,
                                            color: "rgba(64, 64, 64, 0.4)",
                                            opacity: 0,
                                            transition: "opacity 0.2s",
                                            margin: 0, // Remove any margin
                                            padding: 0, // Remove any padding
                                            ":hover": { opacity: 1 },
                                        }}
                                        className="edit-icon"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </div>
                        </TableCell>
                        {/* <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.qreCost ? formatCurrency(row?.qreCost, "en-US", row?.currency || "USD") : ""}</TableCell> */}
                        <TableCell
                            sx={{
                                ...cellStyle,
                                textAlign: "right",
                                position: 'relative',
                                backgroundColor: highlightedFields[`${rowIndex}-qreCost`]
                                    ? "#ffead4"
                                    : "transparent",
                                '&:hover .edit-icon': {
                                    opacity: 1,
                                }
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end", // Align content to the right
                                alignItems: "center", // Align items vertically center
                                margin: 0,
                                padding: 0,

                                // gap: "8px", // Add gap between content and IconButton
                            }}>
                                {editMode.some(item => item.rowIndex === rowIndex && item.columnName === "qreCost") ? (
                                    <TextField
                                        value={editedValues[`${rowIndex}-qreCost`] || ""}
                                        onChange={(event) => handleChange(event, rowIndex, "qreCost", row.teamMemberId)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, "qreCost", row.teamMemberId)}
                                        variant="standard"
                                        autoFocus
                                        sx={{ flexGrow: 1 }}
                                        error={!!errorMessages[`${rowIndex}-qreCost`]}
                                        helperText={errorMessages[`${rowIndex}-qreCost`] || ""}
                                    />
                                ) : (
                                    <span>{row?.qreCost || ""}</span>
                                )}
                                {row.teamMemberId && !editMode.some(item => item.rowIndex === rowIndex && item.columnName === "qreCost") && (
                                    <IconButton
                                        onClick={() => handleEditClick(rowIndex, "qreCost", row.qreCost, row.teamMemberId)}
                                        size="small"
                                        sx={{
                                            height: 15,
                                            color: "rgba(64, 64, 64, 0.4)",
                                            opacity: 0,
                                            transition: "opacity 0.2s",
                                            margin: 0, // Remove any margin
                                            padding: 0, // Remove any padding
                                            ":hover": { opacity: 1 },
                                        }}
                                        className="edit-icon"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
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
};

export default ProjectsTeamTableBody;