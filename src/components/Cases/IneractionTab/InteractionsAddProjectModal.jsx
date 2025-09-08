
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    InputAdornment,
    InputBase,
    InputLabel,
    Modal,
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
    interactionData
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../../constants/Baseurl";
import ProjectTableCell from "../../Common/ProjectTableCell";
import ContactTableCell from "../../Common/ContactTableCell";
import { CaseContext } from "../../../context/CaseContext";
import { color } from "highcharts";

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
const InteractionsAddProjectModal = ({ getSelectedInteractions, interactionData }) => {
    const [search, setSearch] = useState("");
    const [filteredInteractions, setFilteredInteractions] = useState([]);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);
    const [projectVal, setProjectVal] = useState(false);
    const { detailedCase } = useContext(CaseContext);
    const [interactionProjects, setInteractionProjects] = useState([]);
    const [selectedInteractions, setSelectedInteractions] = useState([]);


    React.useEffect(() => {
        if (interactionProjects) {
            getSelectedInteractions(interactionProjects, selectedInteractions);
        }
    }, [interactionProjects])

    const handleSurveySelectAllClick = (e) => {
        if (e.target.checked) {
            const newSelected = filteredInteractions
                .map((n) => n.interactionId);
            setSelected(newSelected);
            const allInteractions = filteredInteractions.filter(f => {
                return (f.interactionId);
            })
            setInteractionProjects(newSelected);
            setSelectedInteractions(allInteractions);
        } else {
            setInteractionProjects([]);
            setSelected([]);
            setSelectedInteractions([]);
        }
    }



    useEffect(() => {
        if (interactionData) {
            const trimSearch = search?.trim();
            const filteredData = interactionData?.filter(
                (task) =>
                    task?.interactionsIdentifier?.toLowerCase()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectId?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectName?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase())

            );
            setFilteredInteractions(filteredData);
        }
    }, [search]);



    const handleClick = (event, id, row) => {
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
        if (event.target.checked) {
            setInteractionProjects([...interactionProjects, row.interactionId]);
            setSelectedInteractions([...selectedInteractions, row]);
        } else {
            const newSurveyProject = interactionProjects.filter((survey) => { return survey !== row.interactionId });
            const newSelectedProjects = selectedInteractions.filter((survey) => { return survey.interactionId !== row.interactionId });
            setInteractionProjects(newSurveyProject);
            setSelectedInteractions(newSelectedProjects);
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
            <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                <InputLabel sx={styles.label}>
                    Choose Interactions
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
                                    Interaction ID
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
                                    Status
                                </TableCell>
                                {/* <TableCell
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
                                    Response Date
                                </TableCell> */}
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Sent To
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredInteractions
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((row, index) => {
                                    const isItemSelected = isSelected(row.interactionId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.interactionId}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <div style={{ color: row?.caseCode ? 'initial' : '#9E9E9E' }}>
                                                    <Checkbox
                                                        onClick={(event) => {
                                                            handleClick(event, row.interactionId, row);
                                                            // handleClick(event, row);
                                                        }}
                                                        color="success"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            "aria-labelledby": labelId,
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, color: "#00A398" }}>{row.interactionsIdentifier}</TableCell>
                                            {/* <ProjectTableCell id={row?.interactionId} name={`${row?.interactionsIdentifier}`} /> */}
                                            <TableCell sx={{ ...styles?.cellStyle, color: "#00A398" }}>
                                                {(row?.projectId || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, color: "#00A398" }}>
                                                {(row?.projectName || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, color: "#00A398" }}>
                                                {(row?.projectCode || "")}
                                            </TableCell>
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {(row?.status || "")}
                                            </TableCell> */}
                                            <TableCell sx={styles?.cellStyle}>

                                                {row?.status
                                                    ? row?.status
                                                        .toLowerCase()
                                                        .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                                                        .trim()
                                                    : ""}

                                            </TableCell>
                                            {/* <TableCell sx={styles?.cellStyle}>
                                                {(row?.sentDate || "")}
                                            </TableCell>
                                            <TableCell sx={styles?.cellStyle}>
                                                {(row?.responseDate || "")}
                                            </TableCell> */}
                                            <TableCell sx={styles?.cellStyle}>
                                                {(row?.sentTo || "")}
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
                    {filteredInteractions?.length === 0 && (
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

export default InteractionsAddProjectModal;

