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
    Tooltip,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
        textAlign: "left",
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
const CaseAddProjectModal = ({ open, company, handleClose, fetchAddedCaseProjects, fetchCompanyProjects, currencySymbol, currency }) => {
    const [search, setSearch] = useState("");
    const [filteredProject, setFilteredProject] = useState([]);
    const [companyProjects, setCompanyProjects] = useState(null);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);
    const [projectVal, setProjectVal] = useState(false);
    const { detailedCase } = useContext(CaseContext);
    // const [currency, setCurrency] = useState('');
    // const [currencySymbol, setCurrencySymbol] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setCompanyProjects([]);
        try {
            if (company) {
                const queryParams = new URLSearchParams();
                // if (detailedCase?.companyId) queryParams.append("clientId", detailedCase.companyId);
                // if (detailedCase?.accountingYear) queryParams.append("accountingYear", detailedCase.accountingYear);
                if (detailedCase?.companyId) queryParams.append("caseCompanyId", `${detailedCase.companyId}`);
                if (detailedCase?.caseId) queryParams.append("caseId", detailedCase.caseId);
                const queryString = queryParams.toString();
                const response3 = await axios.get(
                    `${BaseURL}/api/v1/projects/${localStorage.getItem(
                        "userid"
                    )}/projects${queryString ? `?${queryString}` : ""}`, Authorization_header()
                );
                setCompanyProjects(response3?.data?.data?.list);
                setSelected([]);
                setLoading(false);
                setPage(0);
            } else {
                console.error("companyId not available in data object");
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
    }, [fetchCompanyProjects]);

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const handleAddProjectModal = () => {
        setSelected([]);
        handleClose();
    }

    useEffect(() => {
        if (companyProjects) {
            const filteredData = companyProjects?.filter(
                (task) =>
                    task?.projectName?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    (task?.projectId + "")?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    (task?.projectCode + "")?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.projectManager?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.spocName?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.spocEmail?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.totalEfforts?.toString()?.includes(search?.toLowerCase()) ||
                    task?.totalCosts?.toString()?.includes(search?.toLowerCase()) ||
                    task?.totalRnDEfforts?.toString()?.includes(search?.toLowerCase()) ||
                    task?.totalRnDCosts?.toString()?.includes(search?.toLowerCase())
            );
            setFilteredProject(filteredData);
            setPage(0);
        }
    }, [companyProjects, search]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = filteredProject
                .filter(row => row?.already_added == 0)
                .map((row) => row?.projectId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id, disabled) => {
        if (disabled == 0) {
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
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleFormSubmit = async () => {
        if (!projectVal) {
            const apiUrl = `${BaseURL}/api/v1/case/${localStorage.getItem(
                "userid"
            )}/projects/add`;
            const data = {
                projectIds: selected,
                caseId: detailedCase?.caseId,
                companyId: company
            };

            toast.promise(
                (async () => {
                    const response = await axios.post(apiUrl, data, Authorization_header());
                    if (response?.data?.success) {
                        // fetchParentData();
                        // setPortfolioName("");
                        // setCompany("");
                        fetchData();
                        fetchAddedCaseProjects();
                        handleAddProjectModal();
                    }
                    return response;
                })(),
                {
                    loading: "Adding New Projects to Case...",
                    success: (response) =>
                        response?.data?.message || "Projects added to Case successfully",
                    error: (response) =>
                        response?.data?.error?.message || "Failed to adding new Projects to Case.",
                }
            );
        }
    };

    useEffect(() => {
        if (selected.length === 0) {
            setProjectVal(true);
        }
        if (selected.length !== 0) {
            setProjectVal(false);
        }
    }, [selected]);


    return (
        <Paper sx={{ ...styles.paperStyle, ...(open ? { display: "none" } : {}) }}>
            <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                <InputLabel sx={styles.label}>
                    Choosing Projects
                </InputLabel>
                <Typography sx={{ marginLeft: "2%", fontWeight: 600, color: "#00A398" }}>Total Projects : {selected.length}</Typography>
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
                                        color="success"
                                        onChange={(e) => {
                                            handleSelectAllClick(e);
                                        }}
                                        inputProps={{
                                            "aria-label": "select all Projects",
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
                                    Project ID
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
                                    {`Total Cost (${currencySymbol} ${currency})`}
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
                                    {`QRE Cost (${currencySymbol} ${currency})`}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    QRE Potential(%)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProject
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row, index) => {
                                    const isItemSelected = isSelected(row?.projectId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => {
                                                handleClick(event, row?.projectId, row?.already_added);
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={`${row?.projectId}`}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Tooltip title={"Already added"} disableHoverListener={row?.already_added == 0}>
                                                    <div style={{ color: row?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                        <Checkbox
                                                            color="success"
                                                            checked={isItemSelected}
                                                            disabled={row?.already_added == 1}
                                                            inputProps={{
                                                                "aria-labelledby": labelId,
                                                            }}
                                                        />
                                                    </div>
                                                </Tooltip>
                                            </TableCell>
                                            <ProjectTableCell id={row?.projectId} name={`${row?.projectId}`} />
                                            <ProjectTableCell id={row?.projectId} name={`${row?.projectName}`} />
                                            <ProjectTableCell id={row?.projectId} name={`${row?.projectCode}`} />
                                            <TableCell sx={styles?.cellStyle}>
                                                {row?.spocName || ""}
                                            </TableCell>
                                            <TableCell sx={styles?.cellStyle}>
                                                {row?.spocEmail || ""}
                                            </TableCell>
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {row?.totalEfforts || ""}
                                            </TableCell> */}
                                            {/* <TableCell sx={styles?.currencyCellStyle}>

                                                {row?.totalCosts ? `${currencySymbol}${row.totalCosts}` : ""}

                                            </TableCell> */}
                                            <TableCell sx={styles?.currencyCellStyle}>
                                                {row?.totalCosts ? `${currencySymbol}` + new Intl.NumberFormat('en-US').format(row?.totalCosts) : ""}
                                            </TableCell>
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {row?.totalRnDEfforts || ""}
                                            </TableCell> */}
                                            {/* <TableCell sx={styles?.currencyCellStyle}>

                                                {row?.totalRnDCosts ? `${currencySymbol}` + new Intl.NumberFormat('en-US').format(row?.totalRnDCosts) : ""}

                                            </TableCell> */}
                                            <TableCell sx={styles?.currencyCellStyle}>
                                                {row?.rndExpense ? `${currencySymbol}` + new Intl.NumberFormat('en-US').format(row?.rndExpense) : ""}
                                            </TableCell>
                                            {/* <TableCell sx={styles?.currencyCellStyle}>
                                                {row?.rndPotential || ""}
                                            </TableCell> */}
                                            <TableCell sx={styles?.currencyCellStyle}>
                                                {row?.rndPotential !== null & row?.rndPotential !== undefined
                                                    ? parseFloat(row?.rndPotential).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                    : ""}
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
                    {filteredProject.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                minHeight: "380px",
                            }}
                        >
                            No projects found on {detailedCase?.accountingYear} fiscal year.
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
            <Box sx={styles.buttonBox}>
                <Button
                    variant="contained"
                    sx={styles.buttonStyle}
                    onClick={handleAddProjectModal}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={styles.uploadButtonStyle}
                    onClick={() => handleFormSubmit()}
                    disabled={projectVal}
                >
                    Add Projects to Case
                </Button>
            </Box>
            <Toaster />
        </Paper>
    );
};

export default CaseAddProjectModal;
