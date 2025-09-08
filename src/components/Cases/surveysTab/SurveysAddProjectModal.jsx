
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
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../../constants/Baseurl";
import ProjectTableCell from "../../Common/ProjectTableCell";
import { CaseContext } from "../../../context/CaseContext";
import { Authorization_header } from "../../../utils/helper/Constant";

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
        py: 1,
    },
    currencyCellStyle: {
        whiteSpace: "nowrap",
        borderRight: "1px solid #ddd",
        textAlign: "right",
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
const SurveysAddProjectModal = ({ getSelectedProjects, purpose, caseSurveysList, handleAllReminderSurveys }) => {
    const [search, setSearch] = useState("");
    const [filteredProject, setFilteredProject] = useState([]);
    const [companyProjects, setCompanyProjects] = useState(null);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);
    const [projectVal, setProjectVal] = useState(false);
    const { detailedCase } = useContext(CaseContext);
    const [surveyProjects, setSurveyProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [currency, setCurrency] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [selectedSurveyId, setSelectedSurveyId] = useState([]);

    React.useEffect(() => {
        if (surveyProjects) {
            getSelectedProjects(surveyProjects, selectedProjects, selectedSurveyId);
        }
    }, [surveyProjects])

    useEffect(() => {
        handleAllReminderSurveys(filteredProject);
    }, [filteredProject])

    const handleSurveySelectAllClick = (e) => {
        if (e.target.checked) {
            const newSelected = filteredProject
                .map((n) => {
                    return n.caseProjectId;
                });
            setSelected(newSelected);
            if (purpose === "Reminder") {
                const newSelectedSurveys = filteredProject.map((n) => {
                    return n.surveyId;
                })
                setSelectedSurveyId(newSelectedSurveys);
            }
            const allProjects = filteredProject.filter(f => {
                return (f.projectId, f.projectName);
            })
            setSurveyProjects(newSelected);
            setSelectedProjects(allProjects);
        } else {
            setSurveyProjects([]);
            setSelected([]);
            setSelectedProjects([]);
        }
    }

    const fetchCurrency = async () => {
        try {
            const res = await axios.get(`${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/${detailedCase?.companyId}/get-currency`, Authorization_header());
            const currency = res?.data?.data?.currency;
            setCurrency(currency);
            const symbol = res?.data?.data?.symbol;
            setCurrencySymbol(symbol);
        }
        catch (error) {
            console.error("Error fetching in currency", error);
        }
    };

    useEffect(() => {
        fetchCurrency();
    }, [detailedCase?.caseId]);

    const fetchData = async () => {
        setLoading(true);
        setCompanyProjects([]);
        try {
            if (detailedCase?.caseId) {
                if (purpose === "Survey") {
                    const response = await axios.get(
                        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId
                        }/projects`, Authorization_header()
                    );

                    const filterCaseProject = await response?.data?.data?.filter((task) => {
                        return task?.already_added === 0;
                    });
                    setCompanyProjects(filterCaseProject);
                    setFilteredProject(filterCaseProject);
                    setSelected([]);
                    setLoading(false);
                    setPage(0);
                } else if (purpose === "Reminder") {

                    setCompanyProjects(caseSurveysList.filter(c => (c?.status === "Sent" || c?.status === "Reminder Sent" || c?.status === "Granted")));
                    setFilteredProject(caseSurveysList.filter(c => (c?.status === "Sent" || c?.status === "Reminder Sent" || c?.status === "Granted")));
                    setSelected([]);
                    setLoading(false);
                    setPage(0);
                }
            } else {
                setLoading(false);
                setCompanyProjects([]);
                setPage(0);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setCompanyProjects([]);
            setPage(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, [detailedCase?.caseId]);

    useEffect(() => {
        if (companyProjects) {
            const trimSearch = search?.trim();
            const filteredData = companyProjects?.filter(
                (task) =>
                    task?.projectName?.toLowerCase()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectId?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectCode?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectManager?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.spocName?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.totalefforts?.toString()?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.totalCosts?.toString()?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.totalRnDEfforts?.toString()?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.totalRnDcosts?.toString()?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.spocEmail?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase())
            );
            setFilteredProject(filteredData);
        }
    }, [search]);



    const handleClick = (event, id, row, surveyId) => {

        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        let newSelectedSurveyId = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
            if (purpose === "Reminder") newSelectedSurveyId = newSelectedSurveyId.concat(selectedSurveyId, surveyId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            if (purpose === "Reminder") newSelectedSurveyId.concat(selectedSurveyId.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            if (purpose === "Reminder") newSelectedSurveyId.concat(selectedSurveyId.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
            if (purpose === "Reminder") {
                newSelectedSurveyId = newSelectedSurveyId.concat(
                    selectedSurveyId.slice(0, selectedIndex),
                    selectedSurveyId.slice(selectedIndex + 1)
                );
            }
        }
        setSelected(newSelected);
        setSelectedSurveyId(newSelectedSurveyId);
        if (event.target.checked) {
            setSurveyProjects([...surveyProjects, row.caseProjectId]);
            setSelectedProjects([...selectedProjects, row]);
            if (purpose === "Reminder") setSelectedSurveyId([...selectedSurveyId, row.surveyId]);
        } else {
            const newSurveyProject = surveyProjects.filter((survey) => { return survey !== row.caseProjectId });
            const newSelectedProjects = selectedProjects.filter((survey) => { return survey.caseProjectId !== row.caseProjectId });
            setSurveyProjects(newSurveyProject);
            setSelectedProjects(newSelectedProjects);
            if (purpose === "Reminder") {
                const newSurveyIDSelected = selectedSurveyId.filter((survey) => (survey != row.surveyId));
                setSelectedSurveyId(newSurveyIDSelected);
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        const pageNum = Number(newPage);
        setPage(Number.isFinite(pageNum) ? pageNum : 0);
    };

    const handleChangeRowsPerPage = (event) => {
        const value = parseInt(event.target.value, 10);
        setRowsPerPage(Number.isFinite(value) ? value : 5);
        setPage(0);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;

    useEffect(() => {
        if (selected.length === 0) {
            setProjectVal(true);
        }
        if (selected.length !== 0) {
            setProjectVal(false);
        }
    }, [selected]);




    return (

        <Paper sx={styles.paperStyle}>
            {/* <Typography sx={{ marginLeft: "2%", fontWeight: 600, color: "#00A398" }}>Total Projects : {selectedProjects.length}</Typography> */}
            <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                <InputLabel sx={styles.label}>
                    Choose Projects
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
                <TableContainer sx={{ height: 300 }} >
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow sx={styles?.headerRowStyle}>
                                <TableCell
                                    padding="checkbox"
                                    sx={{ backgroundColor: "#ECECEC" }}
                                >
                                    <Checkbox
                                        color="success"
                                        // color: "#ddd"
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
                                    SPOC Name
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    SPOC Email
                                </TableCell>
                                {/* <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Total Efforts(Hrs)
                                </TableCell> */}
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Total Cost
                                </TableCell>
                                {/* <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Total QRE Efforts(Hrs)
                                </TableCell> */}
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Total QRE Cost
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProject
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row, index) => {
                                    const isItemSelected = isSelected(row.caseProjectId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={(event) => {
                                            //     handleClick(event, row.caseProjectId, row);
                                            //     // handleClick(event, row);
                                            // }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.caseProjectId}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <div style={{ color: row?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                    <Checkbox
                                                        color="success"
                                                        checked={isItemSelected}
                                                        onClick={(event) => {
                                                            handleClick(event, row.caseProjectId, row);
                                                            // handleClick(event, row);
                                                        }}
                                                        inputProps={{
                                                            "aria-labelledby": labelId,
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <ProjectTableCell id={row?.projectId} name={`${row?.projectId}`} />
                                            <ProjectTableCell id={row?.projectId} name={`${row?.projectName}`} />
                                            <ProjectTableCell id={row?.projectId} name={`${row?.projectCode}`} />
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {(row?.projectManager || "")}
                                            </TableCell> */}
                                            <TableCell sx={styles?.cellStyle}>
                                                {(row?.spocName || "")}
                                            </TableCell>
                                            <TableCell sx={styles?.cellStyle}>
                                                {(row?.spocEmail || "")}
                                            </TableCell>
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {row?.totalefforts ? `${(new Intl.NumberFormat('en-US').format(row?.totalefforts))}` : ""}
                                            </TableCell> */}
                                            <TableCell sx={styles?.currencyCellStyle}>
                                                {(row?.totalCosts ? `${String.fromCharCode(parseInt(detailedCase?.currencySymbol, 16))}${new Intl.NumberFormat('en-US').format(row?.totalCosts)}` : "")}
                                            </TableCell>
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {(row?.totalRnDEfforts ? new Intl.NumberFormat('en-US').format(row?.totalRnDEfforts) : "")}
                                            </TableCell> */}
                                            <TableCell sx={styles?.cellStyle}>
                                                {(row?.totalRnDcosts ? `${String.fromCharCode(parseInt(detailedCase?.currencySymbol, 16))}${new Intl.NumberFormat('en-US').format(row?.totalRnDcosts)}` : "")}
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
                                // minHeight: "380px",
                            }}
                        >
                            <CircularProgress sx={{ color: "#00A398" }} />
                        </div>
                    )}
                    {filteredProject.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                // minHeight: "380px",
                            }}
                        >
                            No projects found.
                        </div>
                    )}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredProject.length}
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

export default SurveysAddProjectModal;

