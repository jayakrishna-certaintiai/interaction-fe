import React, { useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import { Box, Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

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
    paperStyle: {
        display: "flex",
        flexDirection: "column",
        gap: "0 2rem",
        margin: "auto",
        width: "100%",
        height: "350px",
        marginTop: "10px"
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
        textAlign: "center",
        fontSize: "13px",
        py: 0,
    },
    headerRowStyle: {
        backgroundColor: "rgba(64, 64, 64, 0.1)",
        height: "10px"
    },
};
const ProjectInteractionDataDownModal = ({ projects, handleSelectInteraction, handleSelectAllInteraction, updatePurpose, getFilteredInteraction }) => {
    const [search, setSearch] = useState("");
    const [filteredInteraction, setFilteredinteraction] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedAllInteraction, setSelectedAllInteraction] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [newFilteredInteraction, setNewFilteredInteraction] = useState([]);
    useEffect(() => {
        getFilteredInteraction(newFilteredInteraction);
    }, [newFilteredInteraction])
    useEffect(() => {
        if (filteredInteraction && filteredInteraction.length) {
            setNewFilteredInteraction(filteredInteraction);
        }
    }, [filteredInteraction]);

    const handleSummarySelectAllClick = (e) => {
        if (e.target.checked) {
            const allSelectedInteraction = newFilteredInteraction.map(f => updatePurpose === "Surveys" ? f?.caseProjectId : f?.interactionId);
            setSelectedAllInteraction(allSelectedInteraction);
            setSelected(allSelectedInteraction);
        } else {
            setSelectedAllInteraction([]);
            setSelected([]);
        }
        handleSelectAllInteraction(e.target.checked);
    }

    useEffect(() => {
        if (projects) {
            const trimmedSearch = search.trim();
            const filteredData = projects.filter((task) =>
                task.surveyId?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Code?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.interactionsIdentifier?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Status?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase())
            );
            setFilteredinteraction(filteredData)
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
            handleSelectInteraction(id, event.target.checked);
        } else {
            setSelected(selected.filter(p => p !== id));
            handleSelectInteraction(id, event.target.checked);
        }
    }
    const handlePageChange = (newPage) => {
        setPage(newPage);
    }
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    const isSelected = (id) => {
        return selected.indexOf(id) !== -1
    };

    return (
        <Paper sx={styles.paperStyle}>
            <Box sx={{ px: 2, display: 'flex', alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                {/* <InputBase type='text' value={search} placeholder='Search...' onChange={e => setSearch(e.target.value)} startAdornment={<InputAdornment position='start'> <SearchIcon sx={styles.searchIconStyle} /> </InputAdornment>} sx={{ ...styles.inputBase, width: "30%", alignItems: "right" }} /> */}
            </Box>
            <Box sx={{ px: 2 }}>
                <TableContainer sx={{ height: 300 }} >
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow sx={styles.headerRowStyle}>
                                <TableCell padding='checkbox' sx={{ ...styles?.cellStyle, backgroundColor: "#ECECEC" }}>
                                    <Checkbox color='success' onChange={e => handleSummarySelectAllClick(e)} inputProps={{ "aria-label": "select all desserts" }} />
                                </TableCell>
                                <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", backgroundColor: "#ECECEC" }}>{updatePurpose.slice(0, -1)} Id</TableCell>
                                <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", backgroundColor: "#ECECEC" }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newFilteredInteraction?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => {
                                const newRow = {};
                                if (updatePurpose === "Interactions") {
                                    newRow.id = row?.interactionId;
                                    newRow.Code = row?.interactionsIdentifier;
                                    newRow.status = row?.status;
                                    newRow.caseCode = row?.caseCode;
                                }
                                const isItemSelected = isSelected(newRow.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={newRow?.id} selected={isItemSelected} sx={{ cursor: "pointer" }}>
                                        <TableCell padding='checkbox'>
                                            <div style={{ ...styles?.cellStyle, color: newRow?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                <Checkbox onClick={event => { handleClick(event, newRow?.id) }} color="success" checked={isItemSelected} inputProps={{ "aria-labelledby": labelId, }} />
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", }}>{(newRow?.Code || "")}</TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", color: "#00A398", }}>{(newRow?.status || "")}</TableCell>
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
                    {newFilteredInteraction?.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                            }}
                        >No {updatePurpose} found.
                        </div>)}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={newFilteredInteraction?.length}
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

export default ProjectInteractionDataDownModal;