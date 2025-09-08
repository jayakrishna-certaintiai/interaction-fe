import React, { useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import { Box, Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import DataProjectTableCell from '../Common/DataProjectTableCell';

const styles = {
    label: {
        color: "#404040",
        fontSize: "14px",
        fontWeight: 600,
    },
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        width: "200px",
    },
    iconStyle: { fontSize: "17px", color: "#00A398" },
    paperStyle: {
        display: "flex",
        flexDirection: "column",
        gap: "0 2rem",
        margin: "auto",
        width: "100%",
        height: "350px",
        marginTop: "10px",
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
    cellStyle: {
        whiteSpace: "nowrap",
        borderRight: "1px solid #ddd",
        // borderLeft: "1px solid #ddd",
        textAlign: "center",
        fontSize: "13px",
        py: 0,
    },
    headerRowStyle: {
        backgroundColor: "rgba(64, 64, 64, 0.1)",
        height: "10px"
    },
};
const SurveyDownloadDataModal = ({ projects, handleSelectSurvey, handleSelectAllSurveys, updatePurpose, getfilteredSurvey }) => {
    const [search, setSearch] = useState("");
    const [filteredSurvey, setFilteredSurvey] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedAllSurvey, setselectedAllSurvey] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [newfilteredSurvey, setNewfilteredSurvey] = useState([]);

    useEffect(() => {
        getfilteredSurvey(newfilteredSurvey);
    }, [newfilteredSurvey])
    useEffect(() => {
        if (filteredSurvey && filteredSurvey.length) {
            setNewfilteredSurvey(filteredSurvey);
        }
    }, [filteredSurvey]);
    const handleSummarySelectAllClick = (e) => {
        if (e.target.checked) {
            const allSelectedSurvey = newfilteredSurvey.map(f =>
                updatePurpose === "Surveys" ? f?.surveyId : f?.caseProjectId
            );
            setSelected(allSelectedSurvey);
            setselectedAllSurvey(allSelectedSurvey);
            handleSelectAllSurveys(true);
        } else {
            setSelected([]);
            setselectedAllSurvey([]);
            handleSelectAllSurveys(false);
        }
    };


    useEffect(() => {
        if (projects) {
            const trimmedSearch = search.trim();
            const filteredData = projects.filter((task) =>
                task.surveyId?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Code?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.surveyCode?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Status?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase())
            );
            setFilteredSurvey(filteredData)
        }
    }, [search])
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
        handleSelectSurvey(id, event.target.checked);

        if (event.target.checked && !selected.includes(id)) {
            setSelected([...selected, id]);
        } else if (!event.target.checked && selected.includes(id)) {
            setSelected(selected.filter(p => p !== id));
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage >= 0 ? newPage : 0);
    }
    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(isNaN(newRowsPerPage) ? 5 : newRowsPerPage);
        setPage(0);
    }
    const itemsToDisplay = Array.isArray(newfilteredSurvey) ? newfilteredSurvey.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
    const isSelected = (id) => selected.indexOf(id) !== -1;


    return (
        <Paper sx={styles.paperStyle}>
            <Box sx={{ px: 2, display: 'flex', alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
            </Box>
            <Box sx={{ px: 2 }}>
                <TableContainer sx={{ height: 300 }} >
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow sx={styles.headerRowStyle}>
                                <TableCell padding='checkbox' sx={{ ...styles?.cellStyle, backgroundColor: "#ECECEC" }}>
                                    <Checkbox color='success' onChange={e => handleSummarySelectAllClick(e)} inputProps={{ "aria-label": "select all desserts" }} />
                                </TableCell>
                                <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", backgroundColor: "#ECECEC", }} >{updatePurpose.slice(0, -1)} Id</TableCell>
                                <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", backgroundColor: "#ECECEC", }}>Project Name</TableCell>
                                <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", backgroundColor: "#ECECEC", }}>Project Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemsToDisplay?.map((row, index) => {
                                const newRow = {};
                                if (updatePurpose === "Surveys") {
                                    newRow.id = row?.surveyId;
                                    newRow.Code = row?.surveyCode;
                                    newRow.caseCode = row?.caseCode;
                                    newRow.projectName = row?.projectName;
                                }
                                const isItemSelected = isSelected(row?.surveyId);

                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={newRow?.id} selected={isItemSelected} sx={{ cursor: "pointer" }}>
                                        <TableCell padding='checkbox'>
                                            <div style={{ ...styles?.cellStyle, color: newRow?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onChange={(event) => handleClick(event, row?.surveyId)}
                                                    sx={{
                                                        color: isItemSelected ? "red" : "inherit",
                                                        "&.Mui-checked": {
                                                            color: "#00A398",
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", }}>{(newRow?.Code || "")}</TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", textAlign: "left", }}>{(row?.projectName?.slice(0, 25) || "")}</TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", textAlign: "left" }}>{(row?.projectCode?.slice(0, 25) || "")}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {loading && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",

                            }}
                        >
                            <CircularProgress sx={{ color: "#00A398" }} />
                        </div>
                    )}
                    {newfilteredSurvey?.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                            }}
                        >
                            No {updatePurpose} found.
                        </div>)}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={newfilteredSurvey?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    sx={{ marginTop: "-10px" }}
                />
            </Box>
        </Paper>
    )
}

export default SurveyDownloadDataModal;