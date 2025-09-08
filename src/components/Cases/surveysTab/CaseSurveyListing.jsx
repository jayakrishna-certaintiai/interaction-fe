import React, { useState } from "react";
import { TableBody, TableRow, TableCell, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProjectTableCell from "../../Common/ProjectTableCell";
import axios from "axios";
import { BaseURL } from "../../../constants/Baseurl";
import toast, { Toaster } from "react-hot-toast";
import { Authorization_header } from "../../../utils/helper/Constant";
import FormatDatetime from "../../../utils/helper/FormatDatetime";
import DataProjectTableCell from "../../Common/DataProjectTableCell";

const cellStyle = {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "center",
    py: 0.5,
    fontSize: "12px",
};

const cellLinkStyle = {
    ...cellStyle,
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
    textAlign: "left"
};

const tableData = {
    columns: [
        "Project ID",
        "Timesheet",
        "Month",
        "Total QRE Hours",
        "Hourly Rate",
        "QRE Expense",
        "",
    ],
    rows: [
        {
            id: 1,
            projectId: "",
            timesheet: "",
            month: "",
            rndHours: "",
            hourlyRate: "",
            rndExpense: "",
        },
    ],
};



const CaseSurveyListing = ({ getReminderStatusId, fetchSurveyList, handleShowSurveyDetails, handleSelectedSurveyId, filledRows = [] }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [allStatus, setAllStatus] = React.useState([]);
    const [reminderStatusId, setReminderStatusId] = React.useState("");
    const [revokeStatusId, setRevokeStatusId] = React.useState("");
    const [grantStatusId, setGrantStatusId] = React.useState("");

    const getSurveyStatusIds = async () => {
        const res = await axios.get(`${BaseURL}/api/v1/case/${localStorage.getItem(
            "userid"
        )}/surveytypes`, Authorization_header())

        setAllStatus(res.data.data)
    }


    React.useEffect(() => {
        getSurveyStatusIds();
    }, [])

    React.useEffect(() => {
        allStatus.map((st) => {
            if (st.surveyStatus === "Send Reminder") {
                setReminderStatusId(st.surveyStatusId);
            } else if (st.surveyStatus === "Revoke") {
                setRevokeStatusId(st.surveyStatusId)
            } else {
                setGrantStatusId(st.surveyStatusId);
            }
        })
    }, [allStatus])

    React.useEffect(() => {
        getReminderStatusId(reminderStatusId);
    }, [reminderStatusId])

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };



    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleSendReminder = async (surveyId) => {
        toast.loading("Sending Reminder...");
        try {
            const res = await axios.post(
                `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${surveyId}/updatesurvey`,
                {
                    surveyStatusId: reminderStatusId,
                },
                Authorization_header()
            );
            toast.dismiss();
            toast.success("Remider sent successfully");
            fetchSurveyList();
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to send Reminder");
            console.error(err);
        }
    }

    const handleRevokeAccess = async (surveyId) => {
        try {
            const res = await axios.post(
                `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${surveyId}/updatesurvey`,
                {
                    surveyStatusId: revokeStatusId,
                },
                Authorization_header()
            );
            fetchSurveyList();
            toast.success("Access revoked");
        } catch (err) {
            console.error(err);
            toast.error("Failed to revok access");
        }
    }

    const handleGrantAccess = async (surveyId) => {
        try {
            const res = await axios.post(
                `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${surveyId}/updatesurvey`,
                {
                    surveyStatusId: grantStatusId,
                },
                Authorization_header()
            );
            fetchSurveyList();
            toast.success("Access Granted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to grant access");
        }
    }


    return (
        <>
            <TableBody>
                {filledRows?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell sx={cellLinkStyle} onClick={() => {
                            handleShowSurveyDetails();
                            handleSelectedSurveyId(row.surveyId);
                        }}>
                            {row?.surveyCode}
                        </TableCell>
                        <DataProjectTableCell
                            id={row?.projectId}
                            name={`${row?.projectId}`}
                        />
                        <ProjectTableCell
                            id={row?.projectId}
                            name={`${row?.projectName}`}
                        />
                        <DataProjectTableCell
                            id={row?.projectId}
                            name={`${row?.projectCode}`}
                        />
                        <TableCell sx={cellStyle}>{row?.responseType || ""}</TableCell>
                        <TableCell sx={cellStyle}>{row?.status || ""}</TableCell>
                        <TableCell sx={cellStyle}>{FormatDatetime(row?.sendDate) || ""}</TableCell>
                        <TableCell sx={cellStyle}>{FormatDatetime(row?.responseDate) || ""}</TableCell>
                        <TableCell sx={cellStyle}>{FormatDatetime(row?.lastUpdated) || ""}</TableCell>
                        <TableCell sx={cellStyle}>{row?.age !== undefined && row?.age !== null && row?.age !== NaN && row?.age !== false ? row?.age : ""}</TableCell>
                        <TableCell sx={{ ...cellStyle, textAlign: "left" }}>{row?.sentBy || ""}</TableCell>
                        <TableCell sx={{ ...cellStyle, textAlign: "left" }}>{row?.sendTo || ""}</TableCell>
                        <TableCell sx={cellLinkStyle}>
                            <a href={row?.privateUrl}>Link</a>
                        </TableCell>
                        <TableCell sx={cellStyle}>
                            <MoreVertIcon
                                sx={{ color: '#9F9F9F', cursor: 'pointer', transform: (selectedIndex !== rowIndex || row.status.toLowerCase() === "response received") ? 'none' : 'rotate(90deg)' }}
                                onClick={(event) => handleClick(event, rowIndex)}
                            />
                            {row?.status.toLowerCase() === "sent" || row.status.toLowerCase() === "granted" || row.status.toLowerCase() === "reminder sent" ? (
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedIndex === rowIndex}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => handleSendReminder(row.surveyId)}>Send Reminder</MenuItem>
                                    <MenuItem onClick={() => handleRevokeAccess(row.surveyId)}>Revoke Access</MenuItem>
                                </Menu>
                            ) : row.status.toLowerCase() === "revoked" ? (
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedIndex === rowIndex}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => { handleGrantAccess(row.surveyId) }}>Grant Access</MenuItem>
                                </Menu>
                            ) : null}
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>
            <Toaster />
        </>
    );
};

export default CaseSurveyListing;
