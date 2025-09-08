
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
import { CaseContext } from "../../context/CaseContext";


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
const SpocAddProjectModal = ({ projects, handleSelectAllProjects, handleSelectedProjects, getAllSelectedProject }) => {
    const [search, setSearch] = useState("");
    const [filteredInteractions, setFilteredInteractions] = useState([]);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = useState(false);
    const [projectVal, setProjectVal] = useState(false);
    const { detailedCase } = useContext(CaseContext);
    const [spocProjects, setSpockProjects] = useState([]);
    const [selectedSpockProjects, setSelectedSpockProjects] = useState([]);



    React.useEffect(() => {
        if (spocProjects) {
            getAllSelectedProject(spocProjects, selectedSpockProjects);
        }
    }, [spocProjects])

    const handleSurveySelectAllClick = (e) => {
        if (e.target.checked) {
            const newSelected = filteredInteractions
                .map((n) => n.projectId);
            setSelected(newSelected);
            const allInteractions = filteredInteractions.filter(f => {
                return (f.projectId);
            })
            setSpockProjects(newSelected);
            setSelectedSpockProjects(allInteractions);
        } else {
            setSpockProjects([]);
            setSelected([]);
            setSelectedSpockProjects([]);
        }
    }

    useEffect(() => {
        if (projects) {
            const trimSearch = search?.trim();
            const filteredData = projects?.filter(
                (task) =>
                    task?.projectId?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectId?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.projectName?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.spocName?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
                    task?.spocEmail?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase())
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
            setSpockProjects([...spocProjects, row.projectId]);
            setSelectedSpockProjects([...selectedSpockProjects, row]);
        } else {
            const newSpocProject = spocProjects.filter((survey) => { return survey !== row.projectId });
            const newSelectedSpocProject = selectedSpockProjects.filter((survey) => { return survey.projectId !== row.projectId });
            setSpockProjects(newSpocProject);
            setSelectedSpockProjects(newSelectedSpocProject);
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
                                    Account Name
                                </TableCell>
                                {/* <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Accounting Year
                                </TableCell> */}
                                <TableCell
                                    sx={{
                                        ...styles?.cellStyle,
                                        textAlign: "left",
                                        backgroundColor: "#ECECEC",
                                    }}
                                >
                                    Fiscal Year
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
                                                        onClick={(event) => {
                                                            handleClick(event, row.projectId, row);
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

                                            {/* <ProjectTableCell id={row?.projectId} name={`${row?.interactionsIdentifier}`} /> */}
                                            <TableCell sx={styles?.cellStyle}>
                                                {(row?.projectId || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {(row?.projectName || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {(row?.companyName || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {row?.fiscalYear ? `FY ${+(row?.fiscalYear) - 1}-${row?.fiscalYear.slice(-2)}` : ""}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>

                                                {row.spocName || ""}

                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {(row?.spocEmail || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {(row?.oldSpocName || "")}
                                            </TableCell>
                                            <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                                                {(row?.oldSpocEmail || "")}
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

export default SpocAddProjectModal;


// import SearchIcon from "@mui/icons-material/Search";
// import {
//     Box,
//     Button,
//     Checkbox,
//     CircularProgress,
//     InputAdornment,
//     InputBase,
//     InputLabel,
//     Modal,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TablePagination,
//     TableRow,
// } from "@mui/material";
// import React, { useContext, useEffect, useState } from "react";
// import { CaseContext } from "../../context/CaseContext";

// const styles = {
//     flexBoxItem: {
//         display: "flex",
//         justifyContent: "space-between",
//         px: 2,
//     },
//     label: {
//         color: "#404040",
//         fontSize: "14px",
//         fontWeight: 600,
//     },
//     inputBase: {
//         borderRadius: "20px",
//         height: "40px",
//         border: "1px solid #E4E4E4",
//         pl: 1,
//         width: "200px",
//     },
//     iconStyle: { fontSize: "17px", color: "#00A398" },
//     paperStyle: {
//         display: "flex",
//         flexDirection: "column",
//         // gap: "0 2rem",
//         margin: "auto",
//         maxWidth: "100%",
//     },
//     titleStyle: {
//         textAlign: "left",
//         fontWeight: 600,
//         fontSize: "13px",
//     },
//     uploadBoxStyle: {
//         border: "1px dashed #E4E4E4",
//         borderWidth: "2px",
//         ml: 2,
//         mr: 2,
//         borderRadius: "20px",
//         height: "300px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexDirection: "column",
//     },
//     buttonStyle: {
//         mr: 1,
//         borderRadius: "20px",
//         textTransform: "capitalize",
//         backgroundColor: "#9F9F9F",
//         "&:hover": { backgroundColor: "#9F9F9F" },
//     },
//     uploadButtonStyle: {
//         borderRadius: "20px",
//         textTransform: "capitalize",
//         backgroundColor: "#00A398",
//         "&:hover": { backgroundColor: "#00A398" },
//     },
//     modalStyle: {
//         display: "flex",
//     },
//     innerBox: {
//         display: "flex",
//         alignItems: "center",
//         flexDirection: "column",
//         cursor: "pointer",
//     },
//     buttonBox: {
//         mt: 1,
//         display: "flex",
//         justifyContent: "flex-end",
//         px: 2,
//         mb: 2,
//     },
//     searchIconStyle: {
//         color: "#9F9F9F",
//         ml: "3px",
//         mr: "-3px",
//         width: "20px",
//         height: "20px",
//     },
//     cellStyle: {
//         whiteSpace: "nowrap",
//         borderRight: "1px solid #ddd",
//         textAlign: "center",
//         fontSize: "13px",
//         py: 1,
//     },
//     headerRowStyle: {
//         backgroundColor: "rgba(64, 64, 64, 0.1)",
//     },
//     topBoxStyle: {
//         borderBottom: "1px solid #E4E4E4",
//         px: 2.5,
//         textAlign: "left",
//         py: 1,
//     },
// };
// const SpocAddProjectModal = ({ getSelectedUpdates, updateData, projects, handleSelectAllProjects, handleSelectedProjects }) => {
//     const [search, setSearch] = useState("");
//     const [filteredUpdates, setFilteredUpdates] = useState([]);
//     const [selected, setSelected] = React.useState([]);
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(5);
//     const [loading, setLoading] = useState(false);
//     const [projectVal, setProjectVal] = useState(false);
//     const { detailedCase } = useContext(CaseContext);
//     const [updateProjects, setUpdateProjects] = useState([]);
//     const [selectedUpdates, setSelectedUpdates] = useState([]);


//     React.useEffect(() => {
//         if (updateProjects) {
//             getSelectedUpdates(updateProjects, selectedUpdates);
//         }
//     }, [updateProjects])

//     const handleSurveySelectAllClick = (e) => {
//         if (e.target.checked) {
//             const newSelected = filteredUpdates
//                 .map((n) => n.updateId);
//             setSelected(newSelected);
//             const allUpdates = filteredUpdates.filter(f => {
//                 return (f.updateId);
//             })
//             setUpdateProjects(newSelected);
//             setSelectedUpdates(allUpdates);
//         } else {
//             setUpdateProjects([]);
//             setSelected([]);
//             setSelectedUpdates([]);
//         }
//     }



//     useEffect(() => {
//         if (projects) {
//             const trimSearch = search?.trim();
//             const filteredData = projects?.filter(
//                 (task) =>
//                     task?.updatesIdentifier?.toLowerCase()?.includes(trimSearch?.toLowerCase()) ||
//                     task?.projectId?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase()) ||
//                     task?.projectName?.toLowerCase()?.toString()?.includes(trimSearch?.toLowerCase())

//             );
//             setFilteredUpdates(filteredData);
//         }
//     }, [search]);



//     const handleClick = (event, id, row) => {
//         const selectedIndex = selected.indexOf(id);
//         let newSelected = [];
//         if (selectedIndex === -1) {
//             newSelected = newSelected.concat(selected, id);
//         } else if (selectedIndex === 0) {
//             newSelected = newSelected.concat(selected.slice(1));
//         } else if (selectedIndex === selected.length - 1) {
//             newSelected = newSelected.concat(selected.slice(0, -1));
//         } else if (selectedIndex > 0) {
//             newSelected = newSelected.concat(
//                 selected.slice(0, selectedIndex),
//                 selected.slice(selectedIndex + 1)
//             );
//         }
//         setSelected(newSelected);
//         if (event.target.checked) {
//             setUpdateProjects([...updateProjects, row.updateId]);
//             setSelectedUpdates([...selectedUpdates, row]);
//         } else {
//             const newSpocProject = updateProjects.filter((survey) => { return survey !== row.updateId });
//             const newSelectedSpocProject = selectedUpdates.filter((survey) => { return survey.updateId !== row.updateId });
//             setUpdateProjects(newSpocProject);
//             setSelectedUpdates(newSelectedSpocProject);
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };
//     const isSelected = (id) => selected.indexOf(id) !== -1;

//     useEffect(() => {
//         if (selected.length === 0) {
//             setProjectVal(true);
//         }
//         if (selected.length !== 0) {
//             setProjectVal(false);
//         }
//     }, [selected]);


//     return (

//         <Paper sx={styles.paperStyle}>
//             <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
//                 <InputLabel sx={styles.label}>
//                     Choose Projects
//                 </InputLabel>
//                 <InputBase
//                     type="text"
//                     value={search}
//                     placeholder="Search..."
//                     onChange={(e) => setSearch(e.target.value)}
//                     startAdornment={
//                         <InputAdornment position="start">
//                             <SearchIcon sx={styles.searchIconStyle} />
//                         </InputAdornment>
//                     }
//                     sx={{
//                         ...styles.inputBase,
//                         width: "40%",
//                         alignItems: "right"
//                     }}
//                 />
//             </Box>

//             <Box sx={{ px: 2 }}>
//                 <TableContainer sx={{ height: 300 }} >
//                     <Table stickyHeader aria-label="simple table">
//                         <TableHead>
//                             <TableRow sx={styles?.headerRowStyle}>
//                                 <TableCell
//                                     padding="checkbox"
//                                     sx={{ ...styles?.cellStyle, backgroundColor: "#ECECEC" }}
//                                 >
//                                     <Checkbox
//                                         color="success"
//                                         onChange={(e) => {
//                                             // handleSurveySelectAllClick(e);
//                                             handleSelectAllProjects(e?.target?.checked);
//
//                                             if (e?.target?.checked) {
//                                                 projects.forEach(pr => {
//                                                     const el = document.getElementById(pr.projectId);
//                                                     el.checked = true;
//                                                 })
//                                             } else {
//                                                 projects.forEach(pr => {
//                                                     const el = document.getElementById(pr.projectId);
//                                                     el.checked = false;
//                                                 })
//                                             }
//                                         }}
//                                         inputProps={{
//                                             "aria-label": "select all desserts",
//                                         }}
//                                     />
//                                 </TableCell>
//                                 <TableCell
//                                     sx={{
//                                         ...styles?.cellStyle,
//                                         textAlign: "left",
//                                         backgroundColor: "#ECECEC",
//                                     }}
//                                 >
//                                     Project Id
//                                 </TableCell>
//                                 <TableCell
//                                     sx={{
//                                         ...styles?.cellStyle,
//                                         textAlign: "left",
//                                         backgroundColor: "#ECECEC",
//                                     }}
//                                 >
//                                     Project Name
//                                 </TableCell>
//                                 <TableCell
//                                     sx={{
//                                         ...styles?.cellStyle,
//                                         textAlign: "left",
//                                         backgroundColor: "#ECECEC",
//                                     }}
//                                 >
//                                     Account
//                                 </TableCell>
//                                 <TableCell
//                                     sx={{
//                                         ...styles?.cellStyle,
//                                         textAlign: "left",
//                                         backgroundColor: "#ECECEC",
//                                     }}
//                                 >
//                                     SPOC Name
//                                 </TableCell>
//                                 <TableCell
//                                     sx={{
//                                         ...styles?.cellStyle,
//                                         textAlign: "left",
//                                         backgroundColor: "#ECECEC",
//                                     }}
//                                 >
//                                     SPOC Email
//                                 </TableCell>
//                                 <TableCell
//                                     sx={{
//                                         ...styles?.cellStyle,
//                                         textAlign: "left",
//                                         backgroundColor: "#ECECEC",
//                                     }}
//                                 >
//                                     Status
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filteredUpdates
//                                 ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                 ?.map((row, index) => {
//                                     const isItemSelected = isSelected(row.updateId);
//                                     const labelId = `enhanced-table-checkbox-${index}`;
//                                     return (
//                                         <TableRow
//                                             hover
//                                             role="checkbox"
//                                             aria-checked={isItemSelected}
//                                             tabIndex={-1}
//                                             key={row.updateId}
//                                             selected={isItemSelected}
//                                             sx={{ cursor: "pointer" }}
//                                         >
//                                             <TableCell padding="checkbox">
//                                                 <div style={{...styles?.cellStyle, color: row?.caseCode ? 'initial' : '#9E9E9E' }}>
//                                                     <Checkbox
//                                                         id={row.projectId}
//                                                         onChange={(event) => {
//                                                             // handleClick(event, row.projectId, row);
//
//                                                             handleSelectedProjects(row.projectId, event?.target?.checked)
//                                                             // handleClick(event, row);
//                                                         }}
//                                                         color="success"
//                                                         inputProps={{
//                                                             "aria-labelledby": labelId,
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </TableCell>
//                                             {/* <TableCell sx={styles?.cellStyle}>{row.updatesIdentifier}</TableCell> */}
//                                             <TableCell sx={styles?.cellStyle}>
//                                                 {(row?.projectId || "")}
//                                             </TableCell>
//                                             <TableCell sx={{...styles?.cellStyle, textAlign: "left"}}>
//                                                 {(row?.projectName || "")}
//                                             </TableCell>
//                                             <TableCell sx={styles?.cellStyle}>

//                                                 {row?.status
//                                                     ? row?.status
//                                                         .toLowerCase()
//                                                         .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
//                                                         .trim()
//                                                     : ""}

//                                             </TableCell>
//                                             <TableCell sx={styles?.cellStyle}>
//                                                 {(row?.sentDate || "")}
//                                             </TableCell>
//                                             <TableCell sx={styles?.cellStyle}>
//                                                 {(row?.responseDate || "")}
//                                             </TableCell>
//                                             <TableCell sx={styles?.cellStyle}>
//                                                 {(row?.sentTo || "")}
//                                             </TableCell>

//                                         </TableRow>
//                                     );
//                                 })}

//                         </TableBody>
//                     </Table>

//                     {loading && (
//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 marginTop: "50px",
//                                 // minHeight: "380px",
//                             }}
//                         >
//                             <CircularProgress sx={{ color: "#00A398" }} />
//                         </div>
//                     )}
//                     {filteredUpdates?.length === 0 && (
//                         <div
//                             style={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 marginTop: "50px",
//                                 // minHeight: "380px",
//                             }}
//                         >
//                             No projects found.
//                         </div>
//                     )}
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={filteredUpdates?.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </Box>

//         </Paper>
//         // </Modal>
//     );
// };

// export default SpocAddProjectModal;