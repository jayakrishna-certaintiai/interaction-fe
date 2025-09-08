import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";

const styles = {
    boxStyle: {
        p: 0.5,
        borderTop: "1px solid #E4E4E4",
        borderTopLeftRadius: "10px",
        ml: -1

    },
    tableStyle: {
        minWidth: 650,
        borderTopLeftRadius: "20px",
        borderLeft: "1px solid #E4E4E4",
    },
    tableHeadCell: {
        border: "none",
        paddingBottom: 0,
        fontWeight: 600,
        fontSize: "13px",
        textAlign: "center",
    },
    tableHeadCell2: {
        border: "none",
        paddingBottom: 0,
        fontWeight: 600,
        fontSize: "13px",
        paddingLeft: "0%",
    },
    tableRow: {
        "&:last-child td, &:last-child th": { border: 0 },
    },
    tableCell: {
        fontSize: "13px",
        width: "17.5%",
        color: "#29B1A8",
        fontWeight: 400,
        pt: "2px",
        textAlign: "center"
    },
    tableCell1: {
        pl: "0%",
        pt: "1.5px",
    },
    tableCell2: {
        fontSize: "13px",
        width: "17.5%",
        paddingLeft: "-10%",
        color: "#29B1A8",
        fontWeight: 400,
        pt: "2px",
    },
};

function SurveyInfoboxTable({ caseSurveyDetails, handleSelectedSurveyType }) {
    const totalResponses = caseSurveyDetails?.totalResponsesReceived || 0;
    const totalSurveys = caseSurveyDetails?.totalSurveysSent || 100;

    let responsePercentage = (totalResponses * 100) / totalSurveys;
    return (
        <>
            <Box sx={styles.boxStyle}>
                <TableContainer>
                    <Table sx={styles.tableStyle} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ ...styles.tableHeadCell }}>Total Surveys (Sent)</TableCell>
                                <TableCell sx={{ ...styles.tableHeadCell }}>Total Surveys (Not Sent)</TableCell>
                                <TableCell sx={{ ...styles.tableHeadCell }}>Total Responses Received</TableCell>
                                <TableCell sx={{ ...styles.tableHeadCell }}>Total Reminders Sent</TableCell>
                                <TableCell sx={{ ...styles.tableHeadCell }}>Responses Received %</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={styles.tableRow}>

                                <TableCell sx={{ ...styles.tableCell, cursor: "pointer" }} onClick={() => {
                                    if (caseSurveyDetails?.totalSurveysSent !== undefined && caseSurveyDetails?.totalSurveysSent !== null && caseSurveyDetails?.totalSurveysSent !== NaN && caseSurveyDetails?.totalSurveysSent !== false && caseSurveyDetails?.totalSurveysSent) {
                                        handleSelectedSurveyType("Sent")
                                    } else {
                                        handleSelectedSurveyType("");
                                    }
                                }}>
                                    {caseSurveyDetails?.totalSurveysSent !== undefined && caseSurveyDetails?.totalSurveysSent !== null && caseSurveyDetails?.totalSurveysSent !== NaN && caseSurveyDetails?.totalSurveysSent !== false ? caseSurveyDetails?.totalSurveysSent : ""}
                                </TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>
                                    {caseSurveyDetails?.totalSurveysNotSent !== undefined && caseSurveyDetails?.totalSurveysNotSent !== null && caseSurveyDetails?.totalSurveysNotSent !== NaN && caseSurveyDetails?.totalSurveysNotSent !== false ? caseSurveyDetails?.totalSurveysNotSent : ""}
                                </TableCell>
                                <TableCell sx={{ ...styles.tableCell, cursor: "pointer" }} onClick={() => {
                                    if (caseSurveyDetails?.totalResponsesReceived !== undefined && caseSurveyDetails?.totalResponsesReceived !== null && caseSurveyDetails?.totalResponsesReceived !== NaN && caseSurveyDetails?.totalResponsesReceived !== false && caseSurveyDetails?.totalResponsesReceived) {
                                        handleSelectedSurveyType("Response Received");
                                    } else {
                                        handleSelectedSurveyType("");
                                    }
                                }}>

                                    {caseSurveyDetails?.totalResponsesReceived !== undefined && caseSurveyDetails?.totalResponsesReceived !== null && caseSurveyDetails?.totalResponsesReceived !== NaN && caseSurveyDetails?.totalResponsesReceived !== false ? caseSurveyDetails?.totalResponsesReceived : ""}
                                </TableCell>
                                <TableCell sx={{ ...styles.tableCell, cursor: "pointer" }} onClick={() => {
                                    if (caseSurveyDetails?.totalRemindersSent !== undefined && caseSurveyDetails?.totalRemindersSent !== null && caseSurveyDetails?.totalRemindersSent !== NaN && caseSurveyDetails?.totalRemindersSent !== false && caseSurveyDetails?.totalRemindersSent) {
                                        handleSelectedSurveyType("Reminder Sent");
                                    } else {
                                        handleSelectedSurveyType("");
                                    }
                                }}>
                                    {caseSurveyDetails?.totalRemindersSent !== undefined && caseSurveyDetails?.totalRemindersSent !== null && caseSurveyDetails?.totalRemindersSent !== NaN && caseSurveyDetails?.totalRemindersSent !== false ? caseSurveyDetails?.totalRemindersSent : ""}
                                </TableCell>
                                <TableCell sx={{ ...styles.tableCell }}>
                                    {/* {(caseSurveyDetails?.totalResponsesReceived !== undefined && caseSurveyDetails?.totalResponsesReceived !== null && caseSurveyDetails?.totalResponsesReceived !== NaN && caseSurveyDetails?.totalResponsesReceived !== false ? caseSurveyDetails?.totalResponsesReceived : 0) * 100 / (caseSurveyDetails?.totalSurveysSent !== undefined && caseSurveyDetails?.totalSurveysSent !== null && caseSurveyDetails?.totalSurveysSent !== NaN && caseSurveyDetails?.totalSurveysSent !== false ? caseSurveyDetails?.totalSurveysSent : 100) } */}
                                    {responsePercentage = isNaN(responsePercentage) || !isFinite(responsePercentage) ? 0 : parseFloat(responsePercentage.toFixed(2))}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </TableContainer>
            </Box>
        </>
    );
}

export default SurveyInfoboxTable;