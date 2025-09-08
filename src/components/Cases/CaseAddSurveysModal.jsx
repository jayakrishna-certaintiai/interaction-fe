import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
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
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../constants/Baseurl";
import ProjectTableCell from "../Common/ProjectTableCell";
import ContactTableCell from "../Common/ContactTableCell";
import { Authorization_header } from "../../utils/helper/Constant";

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
const CaseAddSurveysModal = ({ open, company, handleClose, data }) => {
    const [search, setSearch] = useState("");
    const [filteredSurvey, setFilteredSurvey] = useState([]);
    const [portfolioName, setPortfolioName] = useState("");
    const [companySurveys, setCompanySurveys] = useState(null);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);
    const [nameVal, setNameVal] = useState(false);
    const [companyVal, setCompanyVal] = useState(false);
    const [surveyVal, setSurveyVal] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        setCompanySurveys([]);
        try {
            if (company) {
                const response3 = await axios.get(
                    `${BaseURL}/api/v1/company/${localStorage.getItem(
                        "userid"
                    )}/${company}/get-projects-by-company`
                );
                setCompanySurveys(response3.data.data);
                setSelected([]);
                setLoading(false);
                setCompanyVal(false);
                setPage(0);
            } else {
                console.error("companyId not available in data object");
                setLoading(false);
                setCompanySurveys([]);
                setPage(0);
                // setCompanyVal(true);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setCompanySurveys([]);
            setCompanyVal(true);
            setPage(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, [company]);

    useEffect(() => {
        if (companySurveys) {
            const filteredData = companySurveys?.filter(
                (task) =>
                    task?.projectName?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.projectId?.toString()?.includes(search)
                // Add more conditions as needed
            );
            setFilteredSurvey(filteredData);
        }
    }, [companySurveys, search]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = filteredSurvey.map((n) => n.projectId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

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
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
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

    const handleFormSubmit = async () => {
        if (!nameVal && !companyVal && !surveyVal) {
            const apiUrl = `${BaseURL}/api/v1/portfolios/${localStorage.getItem(
                "userid"
            )}/${company}/create-portfolio`;
            const data = {
                projects: JSON.stringify(selected),
                portfolioName: portfolioName,
            };

            toast.promise(
                (async () => {
                    const response = await axios.post(apiUrl, data, Authorization_header());
                    if (response.data.success) {
                        setPortfolioName("");
                        handleClose();
                    }
                    return response;
                })(),
                {
                    loading: "Adding New Portfolio...",
                    success: (response) =>
                        response.data.message || "Portfolio added successfully",
                    error: (response) =>
                        response.data.error.message || "Failed to adding new portfolio.",
                }
            );
        } else {
            CheckValidation();
        }
    };
    const CheckValidation = () => {
        if (portfolioName === "") {
            setNameVal(true);
        }
        if (portfolioName !== "") {
            setNameVal(false);
        }
        if (company === null) {
            setCompanyVal(true);
        }
        if (company !== null) {
            setCompanyVal(false);
        }
        if (selected.length === 0) {
            setSurveyVal(true);
        }
        if (selected.length !== 0) {
            setSurveyVal(false);
        }
    };
    useEffect(() => {
        if (selected.length === 0) {
            setSurveyVal(true);
        }
        if (selected.length !== 0) {
            setSurveyVal(false);
        }
    }, [selected]);

    return (
        // <Modal open={open} onClose={handleClose} sx={styles.modalStyle}>
        <Paper sx={{ ...styles.paperStyle, ...(open ? { display: "none" } : {}) }}>
            <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                <InputLabel sx={styles.label}>
                    Choosing Surveys
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
                <TableContainer sx={{ height: 300 }}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow sx={styles?.headerRowStyle}>
                                <TableCell
                                    padding="checkbox"
                                    sx={{ backgroundColor: "#ECECEC" }}
                                >
                                    <Checkbox
                                        color="primary"
                                        onChange={(e) => {
                                            handleSelectAllClick(e);
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
                                    Survey ID
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Sent By
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Sent Date
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Responded By
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Response Date
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Version
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row, index) => {
                                    const isItemSelected = isSelected(row?.surveyId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => {
                                                handleClick(event, row.surveyId);
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <ProjectTableCell id={row?.surveyId} name={`${row?.surveyId}`} />
                                            <TableCell sx={styles?.cellStyle}>
                                                {/* <Tooltip title={row?.projectId || ""}> */}
                                                <span>
                                                    {row?.status?.length > 10 ? `${row?.status?.substring(0, 10)}...` : row?.status || ""}
                                                </span>
                                                {/* </Tooltip> */}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {row?.sentBy || ""}
                                            </TableCell>
                                            <TableCell sx={styles?.cellStyle}>
                                                {row?.sendDate || ""}
                                            </TableCell>
                                            <ContactTableCell id={row?.contactId} name={`${row?.respondedBy}`} />
                                            <TableCell sx={styles?.cellStyle}>
                                                {row?.responseDate || ""}
                                            </TableCell>
                                            <TableCell sx={styles?.cellStyle}>
                                                {row?.version || ""}
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
                                minHeight: "380px",
                            }}
                        >
                            <CircularProgress sx={{ color: "#00A398" }} />
                        </div>
                    )}
                    {filteredSurvey.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                minHeight: "380px",
                            }}
                        >
                            No projects found
                        </div>
                    )}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredSurvey.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Box sx={styles.buttonBox}>
                <Button
                    variant="contained"
                    sx={styles.buttonStyle}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={styles.uploadButtonStyle}
                    onClick={() => handleFormSubmit()}
                    disabled={surveyVal}
                >
                    Add Projects to Case
                </Button>
            </Box>
            <Toaster />
        </Paper>
        // </Modal>
    );
};

export default CaseAddSurveysModal;
