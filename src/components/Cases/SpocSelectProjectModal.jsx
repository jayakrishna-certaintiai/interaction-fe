import React, { useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import { Box, Checkbox, CircularProgress, InputAdornment, InputBase, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import ProjectTableCell from '../Common/ProjectTableCell';

const styles = {
    flexBoxItem: {
        display: "flex",
        justifyContent: "space-between",
        px: 2,
    },
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
        width: "95%",
        maxWidth: "1150px"
    },
    titleStyle: {
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
    },
    uploadBoxStyle: {
        border: "1px dashed #E4E4E4",
        borderWidth: "2px",
        ml: 2,
        mr: 2,
        borderRadius: "20px",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
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
    innerBox: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
    },
    buttonBox: {
        mt: 1,
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        mb: 2,
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
        py: 1,
    },
    headerRowStyle: {
        backgroundColor: "rgba(64, 64, 64, 0.1)",
    },
    topBoxStyle: {
        borderBottom: "1px solid #E4E4E4",
        px: 2.5,
        textAlign: "left",
        py: 1,
    },
};

const SpocSelectProjectModal = ({ projects, handleSelectProjects, handleSelectAllProjects, updatePurpose, getFilteredProjects }) => {
    const [search, setSearch] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedSpocProjectes, setSelectedSpocProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [newFilteredProjects, setNewFilteredProjects] = useState([]);

    useEffect(() => {
        getFilteredProjects(newFilteredProjects);
    }, [newFilteredProjects])

    useEffect(() => {
        if (filteredProjects && filteredProjects.length) {
            const newProjects = filteredProjects.filter(p => p?.status?.toLocaleLowerCase() != "response received");
            setNewFilteredProjects(newProjects);
        }
    }, [filteredProjects])

    const handleProjectsSelectAllClick = (e) => {
        if (e.target.checked) {
            const allSelectedProjects = newFilteredProjects.map(f => updatePurpose === "Surveys" ? f?.caseProjectId : f?.interactionId);

            setSelectedSpocProjects(allSelectedProjects);
            setSelected(allSelectedProjects);
        } else {
            setSelectedSpocProjects([]);
            setSelected([]);
        }
        handleSelectAllProjects(e.target.checked);
    }
    useEffect(() => {
        if (projects) {
            const trimmedSearch = search.trim();

            const filteredData = projects.filter((task) =>
                task.surveyId?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.Code?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.interactionsIdentifier?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.surveyCode?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task?.projectName?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLowerCase()) ||
                task.spocName?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.projectCode?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.sendTo?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.oldSpocName?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.previousSpocName?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.previousSpocEmail?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.oldSpocEmail?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase()) ||
                task.spocEmail?.toString()?.toLowerCase()?.includes(trimmedSearch?.toLocaleLowerCase())
            );
            setFilteredProjects(filteredData)
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
            handleSelectProjects(id, event.target.checked);
        } else {
            setSelected(selected.filter(p => p !== id));
            handleSelectProjects(id, event.target.checked);
        }
    }

    const handlePageChange = (event, newPage) => {
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

                <InputLabel sx={styles.label}>
                    Choose {updatePurpose}</InputLabel>
                <InputBase type='text' value={search} placeholder='Search...' onChange={e => setSearch(e.target.value)} startAdornment={<InputAdornment position='start'> <SearchIcon sx={styles.searchIconStyle} /> </InputAdornment>} sx={{ ...styles.inputBase, width: "30%", alignItems: "right" }} />
            </Box>
            <Box sx={{ px: 2 }}>
                <TableContainer sx={{ height: 300 }} >
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow sx={styles.headerRowStyle}>
                                <TableCell padding='checkbox' sx={{ ...styles?.cellStyle, backgroundColor: "#ECECEC" }}>
                                    <Checkbox color='success' onChange={e => handleProjectsSelectAllClick(e)} inputProps={{ "aria-label": "select all desserts" }} />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    {updatePurpose.slice(0, -1)} Id
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Project Id
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Project Name
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Project Code
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Current SPOC Name
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Current SPOC Email
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Previous SPOC Name
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Previous SPOC Email
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newFilteredProjects?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => {

                                const newRow = {};
                                if (updatePurpose === "Surveys") {
                                    newRow.id = row?.caseProjectId;
                                    newRow.Code = row?.surveyCode || "";
                                    newRow.projectId = row?.projectId;
                                    newRow.caseCode = row?.caseCode;
                                    newRow.projectName = row?.projectName;
                                    newRow.spocName = row?.spocName;
                                    newRow.spocEmail = row?.sendTo;
                                    newRow.previousSpocName = row?.oldSpocName;
                                    newRow.previousSpocEmail = row?.oldSpocEmail;
                                } else if (updatePurpose === "Interactions") {
                                    newRow.id = row?.interactionId;
                                    newRow.Code = row?.interactionsIdentifier;
                                    newRow.projectId = row?.projectId;
                                    newRow.caseCode = row?.caseCode;
                                    newRow.projectName = row?.projectName;
                                    newRow.spocName = row?.spocName;
                                    newRow.spocEmail = row?.sentTo;
                                    newRow.previousSpocName = row?.previousSpocName;
                                    newRow.previousSpocEmail = row?.previousSpocEmail;
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
                                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", }}>
                                            {(newRow?.Code || "")}
                                        </TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", color: "#00A398", }}>{(newRow?.projectId || "")}</TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", color: "#00A398", }}>{(newRow?.projectName || "")}</TableCell>
                                        <ProjectTableCell id={row?.projectId} name={`${row?.projectCode}`} />
                                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>{newRow?.spocName}</TableCell>
                                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left", color: "#FD5707" }}>{newRow?.spocEmail}</TableCell>
                                        <TableCell sx={styles?.cellStyle}>{(newRow?.previousSpocName || "")}</TableCell>
                                        <TableCell sx={styles?.cellStyle}>{(newRow?.previousSpocEmail || "")}</TableCell>
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
                    {newFilteredProjects?.length === 0 && (
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
                    count={newFilteredProjects?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Box>
        </Paper>
    )
}

export default SpocSelectProjectModal;