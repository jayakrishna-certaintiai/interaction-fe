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
        height: "300px",
        marginTop: "2px",
        marginBottom: "10px",
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
const DownloadDataModal = ({ projects, handleSelectSummary, handleSelectAllSummary, updatePurpose, getFilteredSummary }) => {
    const [search, setSearch] = useState("");
    const [filteredSummary, setFilteredSummary] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedAllSummary, setSelectedAllSummary] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [newFilteredSummary, setNewFilteredSummary] = useState([]);
    useEffect(() => {
        getFilteredSummary(newFilteredSummary);
    }, [newFilteredSummary])
    useEffect(() => {
        if (filteredSummary && filteredSummary.length) {
            const newSummary = filteredSummary.filter(p => p?.status?.toLocaleLowerCase() != "response received");
            setNewFilteredSummary(newSummary);
        }
    }, [filteredSummary])
    const handleSummarySelectAllClick = (e) => {
        if (e.target.checked) {
            const allSelectedSummary = newFilteredSummary.map(f => updatePurpose === "Surveys" ? f?.caseProjectId : f?.TechnicalSummaryId);
            setSelectedAllSummary(allSelectedSummary);
            setSelected(allSelectedSummary);
        } else {
            setSelectedAllSummary([]);
            setSelected([]);
        }
        handleSelectAllSummary(e.target.checked);
    }
    useEffect(() => {
        if (projects) {
            const trimmedSearch = search.trim();

            const filteredData = projects.filter((task) =>
                task.surveyId?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Code?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.TechnicalSummaryIdentifier?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Status?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase())
            );
            setFilteredSummary(filteredData)
        }
    }, [search])
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
        if (event.target.checked) {
            setSelected([...selected, id]);
            handleSelectSummary(id, event.target.checked);
        } else {
            setSelected(selected.filter(p => p !== id));
            handleSelectSummary(id, event.target.checked);
        }
    }
    const handlePageChange = (event, newPage) => {
        // Ensure newPage is a valid number and does not exceed the number of pages
        setPage(newPage >= 0 ? newPage : 0);
    }
    const itemsToDisplay = Array.isArray(newFilteredSummary) ? newFilteredSummary.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(isNaN(newRowsPerPage) ? 5 : newRowsPerPage); // Default to 5 if invalid
        setPage(0);
    }

    const isSelected = (id) => { return selected.indexOf(id) !== -1 };

    return (
        <Paper sx={styles.paperStyle}>
            <Box sx={{ px: 2, display: 'flex', alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                {/* <InputBase type='text' value={search} placeholder='Search...' onChange={e => setSearch(e.target.value)} startAdornment={<InputAdornment position='start'> <SearchIcon sx={styles.searchIconStyle} /> </InputAdornment>} sx={{ ...styles.inputBase, width: "30%", alignItems: "right" }} /> */}
            </Box>
            <Box sx={{ px: 2, pb: 4 }}>
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
                            {itemsToDisplay.map((row, index) => {
                                const newRow = {};
                                if (updatePurpose === "Summary") {
                                    newRow.id = row?.TechnicalSummaryId;
                                    newRow.Code = row?.TechnicalSummaryIdentifier;
                                    newRow.Status = row?.Status;
                                    newRow.caseCode = row?.caseCode;
                                    newRow.projectName = row?.projectName;
                                }
                                const isItemSelected = isSelected(newRow.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={newRow?.id} selected={isItemSelected} sx={{ cursor: "pointer" }}>
                                        <TableCell padding='checkbox'>
                                            <div style={{ ...styles?.cellStyle, color: newRow?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                <Checkbox onClick={event => {
                                                    handleClick(event, newRow?.id)
                                                }} color="success" checked={isItemSelected} inputProps={{ "aria-labelledby": labelId, }} />
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", }}>{(newRow?.Code || "")}</TableCell>
                                        <DataProjectTableCell id={row?.projectId} name={`${row?.ProjectName}`} />
                                        <DataProjectTableCell id={row?.projectId} name={`${row?.projectCode}`} />
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
                    {newFilteredSummary?.length === 0 && (
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
                    count={newFilteredSummary?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    sx={{ marginTop: "-50px" }}
                />
            </Box>
        </Paper>
    )
}

export default DownloadDataModal;