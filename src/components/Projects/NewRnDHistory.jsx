import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, InputAdornment, InputBase, Table, TableContainer, TablePagination, Drawer, Badge, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UpdationDetails2 from "../Common/UpdationDetails2";
import AddIcon from "@mui/icons-material/Add";
import MiniTableHeader from "../Common/MiniTableHeader";
import TeamTableBody from "./TeamTableBody";
import ContentModal from "./ContentModal";
import NewRnDHistoryTableBody from "./NewRnDHistoryTableBody";

const styleConstants = {
    inputStyle: {
        borderRadius: "20px",
        width: "20%",
        height: "40px",
        border: "1px solid #9F9F9F",
        mr: -100,
        ml: "62%"
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
    filterDownloadStyle: {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#00A398",
        fontSize: "28px",
        padding: "5px",
        marginRight: "16px",
        cursor: "pointer",
    },
    tableContainerStyle: {
        borderLeft: "1px solid #E4E4E4",
    },
};

const styles = {
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        width: "200px",
    },
    addIconStyle: {
        fontSize: "25px",
        fontWeight: "bold",
        strokeWidth: "10px",
        color: "#FFFFFF",
    },
}

const tableData = {
    columns: [
        "Sequence",
        "Type",
        "Contents",
        "QRE (%) - Score",
        "Date",
    ],
};

function NewRndHistory({
    rndHistoryData,
    projectId,
    fetchRnDHistoryData,
    details,
    symbol,
    getTeamSortParams,
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredProjectTeam, setFilteredProjectTeam] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredRow, setFilteredRows] = useState([]);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);

    useEffect(() => {
        const filteredData = rndHistoryData?.filter(task => (
            task?.sequence_no?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
            task?.type?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
            task?.content?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
            task?.rd_score?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
            task?.date?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase())
        ))
        setFilteredRows(filteredData);
    }, [search, rndHistoryData])

    const handleSearchInputChange = (event) => {
        setSearch(event?.target?.value);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (filteredRow) {
            const filteredData = filteredRow?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            setFilteredProjectTeam(filteredData);
        }
    }, [filteredRow, page, rowsPerPage]);

    return (
        <>
            <Box
                sx={{
                    borderTop: "1px solid #E4E4E4",
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <InputBase
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearchInputChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon sx={styleConstants.searchIconStyle} />
                            </InputAdornment>
                        }
                        sx={{
                            ...styles.inputBase,
                            width: "30%",
                            height: "33px",
                            alignItems: "right",
                            mr: 1,
                            ml: "-27em"
                        }}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: filterPanelOpen ? '300px' : '0',
                    px: 2,
                }}
            >
                <TableContainer sx={{
                    maxHeight: "82vh",
                    overflowY: "auto",
                    borderTopLeftRadius: "20px",
                    height: 300,
                }}>
                    <Table stickyHeader aria-label="simple table">
                        <MiniTableHeader tableData={tableData} fetchSortParams={getTeamSortParams} page="rndhistory" />
                        <NewRnDHistoryTableBody filledRows={filteredProjectTeam} rowsPerPage={rowsPerPage} symbol={symbol} />
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={rndHistoryData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </>
    );
}

export default NewRndHistory;
