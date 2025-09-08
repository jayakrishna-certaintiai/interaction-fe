
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Checkbox,
    CircularProgress,
    InputAdornment,
    InputBase,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CaseContext } from "../../context/CaseContext";
import CompanyTableCell from "./CompanyTableCell";


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
        // gap: "0 2rem",
        margin: "auto",
        maxWidth: "100%",
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
        py: 0,
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
const DownloadAccountModal = ({ projects, getAllSelectedProject }) => {
    const [search, setSearch] = useState("");
    const [filteredInteractions, setFilteredInteractions] = useState([]);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);
    const [companyVal, setCompanyVal] = useState(false);
    const { detailedCase } = useContext(CaseContext);
    const [spocProjects, setSpockProjects] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);



    React.useEffect(() => {
        if (spocProjects) {
            getAllSelectedProject(spocProjects, selectedCompanies);
        }
    }, [spocProjects])

    const handleSurveySelectAllClick = (event) => {
        if (event.target.checked) {
            const allCompanyIds = filteredInteractions.map((row) => row.companyId);
            setSelected(allCompanyIds);
            const allSpocProjects = filteredInteractions.map((row) => row.companyId);
            setSpockProjects(allSpocProjects);
            setSelectedCompanies(filteredInteractions);
        } else {
            setSelected([]);
            setSpockProjects([]);
            setSelectedCompanies([]);
        }
    };


    //listing of company only related to projects available
    useEffect(() => {
        if (projects) {
            const trimSearch = search?.trim();
            const filteredData = projects?.filter(
                (task) =>
                    task?.companyName?.toLowerCase()?.includes(trimSearch?.toLowerCase())
            );
            const uniqueCompanies = Array.from(
                new Map(filteredData.map((item) => [item.companyId, item])).values()
            );
            setFilteredInteractions(uniqueCompanies);
        }
    }, [search, projects]);

    const handleClick = (event, companyId, row) => {
        const selectedIndex = selected.indexOf(companyId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, companyId);
        } else {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
        // Update the SPOC Projects and Selected Companies
        if (event.target.checked) {
            setSpockProjects([...spocProjects, companyId]);
            setSelectedCompanies([...selectedCompanies, row]);
        } else {
            const newSpocProject = spocProjects.filter((project) => project !== companyId);
            const newSelectedCompanies = selectedCompanies.filter(
                (company) => company.companyId !== companyId
            );
            setSpockProjects(newSpocProject);
            setSelectedCompanies(newSelectedCompanies);
        }
    };

    const isSelected = (companyId) => selected.indexOf(companyId) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (selected.length === 0) {
            setCompanyVal(true);
        }
        if (selected.length !== 0) {
            setCompanyVal(false);
        }
    }, [selected]);


    return (

        <Paper sx={styles.paperStyle}>
            <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                <InputLabel sx={styles.label}>
                    Choose Accounts
                </InputLabel>
                <InputBase
                    type="text"
                    value={search}
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon sx={styles.searchIconStyle} />
                        </InputAdornment>
                    }
                    sx={{
                        ...styles.inputBase,
                        width: "40%",
                        alignItems: "right"
                    }}
                />
            </Box>
            <Box sx={{ px: 2 }}>
                <TableContainer sx={{ height: 300, overflow: "auto" }} >
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow sx={styles?.headerRowStyle}>
                                <TableCell
                                    padding="checkbox"
                                    sx={{ ...styles?.cellStyle, backgroundColor: "#ECECEC", }}
                                >
                                    <Checkbox
                                        color="success"
                                        onChange={(e) => {
                                            handleSurveySelectAllClick(e);
                                        }}
                                        inputProps={{
                                            "aria-label": "select all desserts",
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Account Name
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredInteractions
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row, index) => {
                                    const isItemSelected = isSelected(row.projectId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.projectId}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <div style={{ ...styles?.cellStyle, color: row?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, row.companyId, row)}
                                                        color="success"
                                                        checked={isSelected(row.companyId)}
                                                        inputProps={{
                                                            "aria-labelledby": labelId,
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {row?.companyName || ""}
                                                {/* <CompanyTableCell id={row?.companyId} name={row?.companyName} /> */}
                                            </TableCell>
                                        </TableRow>
                                    );
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
                    {filteredInteractions?.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                            }}
                        >
                            No projects found.
                        </div>
                    )}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredInteractions?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>

        </Paper>
        // </Modal>
    );
};

export default DownloadAccountModal;
