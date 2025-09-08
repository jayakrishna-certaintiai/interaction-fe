import { Box, CircularProgress, InputAdornment, InputBase, InputLabel, Table, TableContainer, TablePagination, Drawer, Badge, Tooltip, Button } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import MiniTableHeader from '../../Common/MiniTableHeader';
import CaseSummaryListing from './CaseSummaryListing';
import axios from 'axios';
import { BaseURL } from '../../../constants/Baseurl';
import { CaseContext } from '../../../context/CaseContext';
import { Authorization_header } from '../../../utils/helper/Constant';
import FormatDatetime from '../../../utils/helper/FormatDatetime';
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import SummarySelector from '../../FilterComponents/SummarySelector';
import ProjectSummaryFilter from '../../FilterComponents/ProjectSummaryFilter';
import { Download } from '@mui/icons-material';
import DownloadModal from '../DownloadModal';
import ProjectSummaryDownloadModal from '../ProjectSummaryDownloadModal';


const columns = [
    "Technical Summary ID",
    "Summary History",
    "Project ID",
    "Project Name",
    "Project Code",
    "Status",
    "Created On",
    "Created By",
];

const styles = {
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        width: "200px",
    },
    label: {
        color: "#404040",
        fontSize: "14px",
        fontWeight: 600,
        marginLeft: -12,
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
};

const styleConstants = {
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

const TechnicalSummaryListing = ({ onApplyFilters, page, documentType = "", handleShowSummaryListing, getTechnicalSummaryId, usedfor, caseId, projectId }) => {
    const {
        caseFilterState,
        caseSummaryData,
    } = useContext(CaseContext);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [summaryDatas, setSummaryData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [technicalSummarySortParams, setTechnicalSummarySortParams] = useState({ sortField: null, sortOrder: null });
    const [filterClicked, setFilterClicked] = useState(false);
    // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [showUpdateSpocModal, setShowUpdateSpocModal] = useState(false);

    const isCase = usedfor === "case";
    const isProject = usedfor === "project";

    const UpdatePurposeRef = useRef();
    UpdatePurposeRef.current = "Summary"

    const handleOpen = () => {
        setShowUpdateSpocModal(true);
    };

    const handleClose = () => {
        setShowUpdateSpocModal(false);
    };

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);

    const getTechnicalSummarySortParams = ({ sortField, sortOrder }) => {
        switch (sortField) {
            case "Technical Summary ID":
                sortField = "TechnicalSummaryId";
                break;
            case "Summary History":
                sortField = "projectId";
                break;
            case "Project ID":
                sortField = "projectId";
                break;
            case "Project Name":
                sortField = "ProjectName";
                break;
            case "Project Code":
                sortField = "projectCode";
                break;
            case "Status":
                sortField = "Status";
                break;
            case "Created On":
                sortField = "GeneratedOn";
                break;
            case "Created By":
                sortField = "GeneratedBy";
                break;
            default:
                sortField = null;
        }
        setTechnicalSummarySortParams({ sortField: sortField, sortOrder: sortOrder });
    }

    const getSummaryListing = async (filters = {}) => {
        let url_suffix = '';
        if (usedfor === 'case') {
            url_suffix = `caseId=${caseId}`;
        } else if (usedfor === 'project') {
            url_suffix = `projectIdentifier=${projectId}`;
        }

        const queryParams = new URLSearchParams();
        if (technicalSummarySortParams?.sortField) {
            queryParams.append("sortField", technicalSummarySortParams.sortField);
        }
        if (technicalSummarySortParams?.sortOrder) {
            queryParams.append("sortOrder", technicalSummarySortParams.sortOrder);
        }

        if (filters.caseProjectCodes && filters.caseProjectCodes.length > 0) {
            queryParams.append("caseProjectCodes", JSON.stringify(filters.caseProjectCodes));
        }

        if (filters.summaryProjectNames && filters.summaryProjectNames.length > 0) {
            queryParams.append("caseProjectNames", JSON.stringify(filters.summaryProjectNames));
        }

        if (filters.summaryStatus && filters.summaryStatus.length > 0) {
            queryParams.append("summaryStatus", JSON.stringify(filters.summaryStatus));
        }
        if (filters.createdOnStartDate && filters.createdOnStartDate?.length > 0)
            queryParams.append("createdOnStartDate", (filters.createdOnStartDate));
        if (filters.createdOnEndDate && filters.createdOnEndDate?.length > 0)
            queryParams.append("createdOnEndDate", (filters.createdOnEndDate));

        const queryString = queryParams.toString();
        const url = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/summary-list?${url_suffix}${queryString ? `&${queryString}` : ""}`;

        const payload = { headers: Authorization_header().headers };
        setLoader(true);
        try {
            const response = await axios.get(url, payload);
            setSummaryData(response?.data?.data || []);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            console.error(error);
        }
    };

    useEffect(() => {
        setSummaryData(caseSummaryData);
    }, [caseSummaryData])

    useEffect(() => {
        getSummaryListing();
    }, [caseId, projectId, technicalSummarySortParams]);

    const handleSearch = (value) => {
        setSearch(value);
    };

    useEffect(() => {
        const filtered = summaryDatas.filter((data) =>
            data?.TechnicalSummaryIdentifier?.toLowerCase().includes(search.toLowerCase()) ||
            data?.projectId?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            data?.projectCode?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            data?.Status?.toString()?.toLowerCase()?.trim().includes(search.toLowerCase()) ||
            data?.ProjectName?.toLowerCase().includes(search.toLowerCase()) ||
            data?.TaxConsultantName?.toLowerCase().includes(search.toLowerCase()) ||
            data?.GeneratedOn?.toLowerCase().includes(search.toLowerCase()) ||
            data?.GeneratedBy?.toLowerCase().includes(search.toLowerCase()) ||
            FormatDatetime(data?.GeneratedOn)?.toLowerCase()?.trim()?.includes(search.toLowerCase()) ||
            data?.LastEditedOn?.toLowerCase().includes(search.toLowerCase())
        );
        const newData = filtered.slice(currentPageNumber * rowsPerPage, (currentPageNumber * rowsPerPage) + rowsPerPage);
        setFilteredData(newData);
    }, [summaryDatas, search, rowsPerPage, currentPageNumber]);

    // useEffect(() => {
    //    
    //     const filtered = caseSummaryData.filter((data) =>
    //         data?.TechnicalSummaryIdentifier?.toLowerCase().includes(search.toLowerCase()) ||
    //         data?.projectId?.toLowerCase().includes(search.toLowerCase()) ||
    //         data?.projectCode?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
    //         data?.Status?.toString()?.toLowerCase()?.trim().includes(search.toLowerCase()) ||
    //         data?.ProjectName?.toLowerCase().includes(search.toLowerCase()) ||
    //         data?.TaxConsultantName?.toLowerCase().includes(search.toLowerCase()) ||
    //         data?.GeneratedOn?.toLowerCase().includes(search.toLowerCase()) ||
    //         data?.GeneratedBy?.toLowerCase().includes(search.toLowerCase()) ||
    //         FormatDatetime(data?.GeneratedOn)?.toLowerCase()?.trim()?.includes(search.toLowerCase()) ||
    //         data?.LastEditedOn?.toLowerCase().includes(search.toLowerCase())
    //     );
    //     const newData = filtered.slice(currentPageNumber * rowsPerPage, currentPageNumber * rowsPerPage + rowsPerPage);
    //     setFilteredData(newData);
    // }, [caseSummaryData, search, rowsPerPage, currentPageNumber]);

    const handlePageChange = (event, value) => {
        setCurrentPageNumber(value);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPageNumber(0);
    };

    const filteredColumns = (usedfor === 'project')
        ? columns.filter(column => column !== "Summary History")
        : columns;

    const tableData = {
        columns: filteredColumns
    };
    // useEffect(() => {
    //     if (usedfor === 'case') {
    //         const shouldFetchWithFiltersProjects =
    //             caseFilterState.projectId?.length > 0 ||
    //             caseFilterState.caseId?.length > 0 ||
    //             caseFilterState.summaryProjectNames?.length > 0 ||
    //             caseFilterState.summaryStatus?.length > 0 ||
    //             caseFilterState.createdOnStartDate?.length > 0 ||
    //             caseFilterState.createdOnEndDate?.length > 0 ||
    //             caseFilterState.projectCodes?.length > 0;

    //         let options = {};

    //         if (shouldFetchWithFiltersProjects) {
    //             options = {
    //                 ...(caseFilterState.caseId?.length > 0 && {
    //                     caseId: caseFilterState.caseId,
    //                 }),
    //                 ...(caseFilterState.projectId?.length > 0 && {
    //                     projectId: caseFilterState.projectId,
    //                 }),
    //                 ...(caseFilterState.summaryProjectNames?.length > 0 && {
    //                     summaryProjectNames: caseFilterState.summaryProjectNames,
    //                 }),
    //                 ...(caseFilterState.createdOnStartDate?.length > 0 && {
    //                     createdOnStartDate: caseFilterState.createdOnStartDate,
    //                 }),
    //                 ...(caseFilterState.createdOnEndDate?.length > 0 && {
    //                     createdOnEndDate: caseFilterState.createdOnEndDate,
    //                 }),
    //                 ...(caseFilterState.summaryStatus?.length > 0 && {
    //                     summaryStatus: caseFilterState.summaryStatus,
    //                 }),
    //                 ...(caseFilterState.projectCodes?.length > 0 && {
    //                     projectCodes: caseFilterState.projectCodes,
    //                 }),
    //             };
    //         }
    //         // getSummaryListing(options);
    //     }

    // }, [currentState, caseId, technicalSummarySortParams, caseFilterState]);

    // useEffect(() => {
    //     if (usedfor === 'project') {
    //         const shouldFetchWithFiltersProjects =
    //             projectFilterState.projectId?.length > 0 ||
    //             projectFilterState.summaryStatus?.length > 0 ||
    //             projectFilterState.createdOnStartDate?.length > 0 ||
    //             projectFilterState.createdOnEndDate?.length > 0;

    //         let options = {};

    //         if (shouldFetchWithFiltersProjects) {
    //             options = {
    //                 ...(projectFilterState.projectId?.length > 0 && {
    //                     projectId: projectFilterState.projectId,
    //                 }),
    //                 ...(projectFilterState.createdOnStartDate?.length > 0 && {
    //                     createdOnStartDate: projectFilterState.createdOnStartDate,
    //                 }),
    //                 ...(projectFilterState.createdOnEndDate?.length > 0 && {
    //                     createdOnEndDate: projectFilterState.createdOnEndDate,
    //                 }),
    //                 ...(projectFilterState.summaryStatus?.length > 0 && {
    //                     summaryStatus: projectFilterState.summaryStatus,
    //                 }),
    //             };
    //         }
    //         getSummaryListing(options);
    //     }

    // }, [currentState, projectId, technicalSummarySortParams, projectFilterState]);


    const applyFiltersAndFetch = (filters) => {
        if (areFiltersApplied(appliedFilters)) {
            getSummaryListing(filters);
        } else {
            getSummaryListing(filters);
        }
    };

    const appliedFilters = {
        company: caseFilterState.company,
    };


    const handleFilterClick = () => {
        setFilterClicked(!filterClicked);
        setFilterPanelOpen(!filterPanelOpen);
        setFilterPanelOpen(!filterPanelOpen);
    };

    const handleFilterPanelClose = () => {
        setFilterPanelOpen(false);
        setTimeout(() => {
            setFilterPanelOpen(false);
            setFilterClicked(false);
        }, 0);
    };
    const countActiveFilters = () => {
        let count = 0;
        if (Array.isArray(caseFilterState?.summaryProjectNames)) {
            if (caseFilterState.summaryProjectNames.some(summaryProjectNames => summaryProjectNames?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.projectCodes)) {
            if (caseFilterState.projectCodes.some(projectCodes => projectCodes?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.projectNames)) {
            if (caseFilterState.projectNames.some(projectNames => projectNames?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.caseProjectCodes)) {
            if (caseFilterState.caseProjectCodes.some(caseProjectCodes => caseProjectCodes?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.summaryStatus)) {
            if (caseFilterState.summaryStatus.some(status => status?.value?.trim() !== "")) {
                count += 1;
            }
        }

        if (Array.isArray(caseFilterState?.createdOnStartDate)) {
            if (caseFilterState.createdOnStartDate.some(createdOnStartDate => createdOnStartDate?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.createdOnEndDate)) {
            if (caseFilterState.createdOnEndDate.some(createdOnEndDate => createdOnEndDate?.trim() !== "")) {
                count += 1;
            }
        }
        return count;
    };


    return (
        <>
            <Box sx={{ borderTop: "1px solid #E4E4E4", p: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                    <Box sx={{ marginLeft: "1px", marginTop: "-7px", display: "flex", alignItems: "center" }}>
                        {!(page === "alerts") && (
                            <Badge
                                badgeContent={countActiveFilters()}
                                color="error"
                                overlap="circular"
                                sx={{
                                    zIndex: 2,
                                    marginRight: "0px",
                                    '& .MuiBadge-badge': {
                                        minWidth: '10px',
                                        height: '16px',
                                        fontSize: '10px',
                                        paddingLeft: '5',
                                        transform: 'translate(25%, -25%)',
                                        backgroundColor: '#FD5707',
                                    },
                                }}
                            >
                                <HiFilter
                                    style={styleConstants.filterDownloadStyle}
                                    onClick={handleFilterClick}
                                />
                            </Badge>
                        )}
                    </Box>
                    <InputLabel sx={styles.label}>Technical Summary</InputLabel>
                    <Drawer
                        anchor="left"
                        open={filterPanelOpen}
                        onClose={handleFilterPanelClose}
                        sx={{
                            width: '300px',
                            flexShrink: 0,
                        }}
                        variant="persistent"
                    >
                        {filterPanelOpen && (
                            <>
                                {usedfor === 'case' ? (
                                    <SummarySelector
                                        handleClose={handleFilterPanelClose}
                                        usedfor={usedfor}
                                        open={filterPanelOpen}
                                        page={page}
                                        documentType={documentType}
                                        onApplyFilters={applyFiltersAndFetch}
                                        getSummaryListing={getSummaryListing}
                                        style={{ position: 'absolute', left: 0 }}
                                    />
                                ) : (
                                    <ProjectSummaryFilter
                                        handleClose={handleFilterPanelClose}
                                        projectId={projectId}
                                        usedfor={usedfor}
                                        open={filterPanelOpen}
                                        page={page}
                                        documentType={documentType}
                                        onApplyFilters={applyFiltersAndFetch}
                                        style={{ position: 'absolute', left: 0 }}
                                    />
                                )}
                            </>
                        )}
                    </Drawer>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem", width: "20%", marginRight: "-80px" }}>
                        <Tooltip title="Download Summary">
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "10px",
                                    backgroundColor: "#00A398",
                                    height: "2.2em",
                                    minWidth: "5px",
                                    padding: "0 0.5em",
                                    "&:hover": {
                                        backgroundColor: "#00A398",
                                    },
                                }}
                                onClick={handleOpen}
                            >
                                <Download sx={{ height: 20 }} />
                            </Button>
                        </Tooltip>
                    </Box>
                    <InputBase type="text" placeholder="search..." onChange={(e) => { handleSearch(e.target.value) }} startAdornment={<InputAdornment position='start'><SearchIcon sx={styles.searchIconStyle} /></InputAdornment>} sx={{ ...styles.inputBase, width: "25%", alignItems: "right" }} />
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
                    mt: -1.5,
                    borderLeft: "1px solid #E4E4E4",
                }}>
                    <Table stickyHeader aria-label="simple table">
                        <MiniTableHeader tableData={tableData} usedfor={usedfor} fetchSortParams={getTechnicalSummarySortParams} />
                        <CaseSummaryListing handleShowSummaryListing={handleShowSummaryListing} getTechnicalSummaryId={getTechnicalSummaryId} rowData={filteredData} usedfor={usedfor} />
                    </Table>
                    {loader && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", minHeight: "380px" }}>
                            <CircularProgress sx={{ color: "#00A398" }} />
                        </div>
                    )}
                    {filteredData.length === 0 && !loader && (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", minHeight: "380px" }}>
                            No Technical Summary found.
                        </div>
                    )}
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={summaryDatas.length}
                    rowsPerPage={rowsPerPage}
                    page={currentPageNumber}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Box>
            {isCase && (
                <DownloadModal
                    open={showUpdateSpocModal}
                    handleClose={handleClose}
                    updatePurpose={UpdatePurposeRef.current}
                    projects={summaryDatas}
                    postUpdate={getSummaryListing}
                    usedfor="case"
                />
            )}
            {isProject && (
                <ProjectSummaryDownloadModal
                    open={showUpdateSpocModal}
                    handleClose={handleClose}
                    updatePurpose={UpdatePurposeRef.current}
                    projects={summaryDatas}
                    postUpdate={getSummaryListing}
                    usedfor="project"
                />
            )}
        </>
    );
};

export default TechnicalSummaryListing;

