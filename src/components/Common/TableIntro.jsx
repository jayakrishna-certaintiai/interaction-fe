import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import {
  Box,
  Button,
  InputAdornment,
  InputBase,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { GiPin } from "react-icons/gi";
import { GoUpload } from "react-icons/go";
import { HiFilter } from "react-icons/hi";
import { ActivityContext } from "../../context/ActivityContext";
import { ClientContext } from "../../context/ClientContext";
import { ContactContext } from "../../context/ContactContext";
import { DocumentContext } from "../../context/DocumentContext";
import { PortfolioContext } from "../../context/PortfolioContext";
import { ProjectContext } from "../../context/ProjectContext";
import { TimesheetContext } from "../../context/TimesheetContext";
import { WorkbenchContext } from "../../context/WorkbenchContext";
import { ProjectTeammemberContext } from "../../context/ProjectTeammemberContext"
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { formatFilters } from "../../utils/helper/FormatFilters";
import FilterPanel from "./FilterPanel";
import TableHeaderDropdown from "./TableHeaderDropdown";
import { Link } from "react-router-dom";
import { CaseContext } from "../../context/CaseContext";
import { Add, Download, Edit, FileUpload } from "@mui/icons-material";

function TableIntro({
  heading,
  btnName,
  page,
  onUploadClick,
  totalItems,
  currentPage,
  itemsPerPage,
  onSearch,
  latestUpdateTime,
  items,
  documentType = "",
  onApplyFilters,
  appliedFilters = "",
  onSelectedItem,
  createPermission = true,
  searchPermission = true,
  isPinnedState,
  onPinClicked,
  btnName2,
  btnNameD,
  btnName3,
  btnNameX,
  onUploadClickX,
  onUploadClick2,
  onDownloadClick,
  onDownloadClick2,
  onUploadClick3,
  handleSelectedTab,
  selectedTab,
  projectNavs,
  employeeNavs,
  totalSheetsNumber,
  handleHiFilterClick,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);
  const {
    setDocFilterState,
    triggerClearFilters,
    isDocFilterApplied,
    setIsDocFilterApplied,
    documentFilterFields,
    documentSortFields,
  } = useContext(DocumentContext);
  const {
    setPortfolioFilters,
    triggerPortfolioClearFilters,
    isPortfolioFilterApplied,
    setIsPortfolioFilterApplied,
  } = useContext(PortfolioContext);
  const {
    setProjectFilterState,
    triggerProjectClearFilters,
    isProjectFilterApplied,
    setIsProjectFilterApplied,
    projectsFilterFields,
    projectsSortFields,
    projectFilterState,
    fetchProjects
  } = useContext(ProjectContext);
  const {
    setClientFilters,
    isClientFilterApplied,
    setIsClientFilterApplied,
    triggerClientClearFilters,
    clientFilterFields,
    clientSortFields,
  } = useContext(ClientContext);
  const {
    setWorkbenchFilterState,
    isWorkbenchFilterApplied,
    setIsWorkbenchFilterApplied,
    triggerWorkbenchClearFilters,
  } = useContext(WorkbenchContext);
  const {
    setContactFilterState,
    isContactFilterApplied,
    setIsContactFilterApplied,
    triggerContactClearFilters,
    contactFilterFields,
    contactSortFileds
  } = useContext(ContactContext);
  const {
    setActivityFilterState,
    isActivityFilterApplied,
    setIsActivityFilterApplied,
    triggerActivityClearFilters,
  } = useContext(ActivityContext);

  const {
    isTimesheetFilterApplied,
    setTimesheetFilterState,
    triggerTimesheetClearFilters,
    setIsTimesheetFilterApplied,
    timeSheetFilterFields,
    timeSheetSortFields
  } = useContext(TimesheetContext);
  const {
    isCaseFilterApplied,
    setCaseFilterState,
    triggerCaseClearFilters,
    setIsCaseFilterApplied,
    caseFilterFields,
    caseSortFields
  } = useContext(CaseContext);

  const { setTriggerClear, appliedTeamSortParams, appliedTeamFilterParams } = useContext(ProjectTeammemberContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(heading);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterClicked, setFilterClicked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const styleConstants = {
    companyStyle: {
      fontSize: "13px",
      color: "#9F9F9F",
      ml: 2,
      fontWeight: 500,
      mb: 0,
      mt: 0
    },
    projectStyle: {
      fontSize: "13px",
      color: "#9F9F9F",
      ml: 2,
      fontWeight: 500,
      mb: -2,
      mt: 1.5
    },
    clearFiltersStyle: {
      color: "#FD5707",
      fontSize: "13px",
      marginLeft: "5px",
      fontWeight: "500",
      textDecoration: "underline",
      cursor: "pointer",
    },
    pinStyle: {
      borderRadius: "50%",
      border: "1px solid #00A398",
      padding: "15px",
      fontSize: "28px",
      color: isPinnedState ? "white" : "#00A398",
      backgroundColor: isPinnedState ? "#00A398" : "transparent",
      transform: isPinnedState ? "rotate(-45deg)" : "none",
      transition: "transform 0.5s, color 0.5s, background-color 0.5s",
      cursor: "pointer",
    },
    inputStyle: {
      borderRadius: "20px",
      width: "30%",
      height: "30px",
      border: "1px solid #9F9F9F",
      mr: 2,
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
    titleStyle: {
      display: "flex",
      alignItems: "center",
      fontSize: "25px",
      color: "#404040",
      ml: 2,
      fontWeight: 600,
      cursor: "pointer",
    },
    subTitleStyle: {
      fontSize: "13px",
      color: "#9F9F9F",
      ml: 2,
      mb: -5,
      mt: 2
    },
    newCompanyButtonStyle: {
      borderRadius: "10px",
      backgroundColor: "#00A398",
      mr: 2,
      "&:hover": {
        backgroundColor: "#00A398",
      },
      width: "-6em",
      // height: "3em"

    },
    updateButtonStyle: {
      borderRadius: "10px",
      backgroundColor: "#00A398",
      height: "2.2em",
      mr: 2,
      "&:hover": {
        backgroundColor: "#00A398",
      },
      width: "-6em",
    },
    downloadButtonStyle: {
      borderRadius: "10px",
      backgroundColor: "#00A398",
      height: "2.2em",
      mr: 2,
      "&:hover": {
        backgroundColor: "#00A398",
      },
      width: "5px",
    },
    iconStyle: { fontSize: "20px", color: "#FFFFFF" },
    addIconStyle: {
      fontSize: "25px",
      fontWeight: "bold",
      strokeWidth: "10px",
      color: "#FFFFFF",
    },
  };
  const buttonStyle = (buttonName) => ({
    textTransform: "capitalize",
    color: "#404040",
    fontSize: "0.82rem",
    fontWeight: "500",
    px: 1.5,
    mx: "1",
    minHeight: "40px",
    minWidth: "140px",
    borderBottom: selectedTab === buttonName ? "3px solid #00A398" : "none",
    backgroundColor:
      selectedTab === buttonName ? "#00A3981A" : "transparent",
    borderRadius: "0px",
    mb: 1,
    "&:hover": {
      backgroundColor: "#03A69B1A",
      borderBottom: "3px solid #00A398",
    },
  });

  const buttonStyle1 = (buttonName) => ({
    textTransform: "capitalize",
    color: "#404040",
    fontSize: "0.82rem",
    fontWeight: "500",
    px: 1.5,
    mr: "0",
    minHeight: "60px",
    minWidth: "140px",
    borderBottom: selectedTab === buttonName ? "3px solid #00A398" : "none",
    backgroundColor:
      selectedTab === buttonName ? "#00A3981A" : "transparent",
    borderRadius: "0px",
    "&:hover": {
      backgroundColor: "#03A69B1A",
      borderBottom: "3px solid #00A398",
    },
  });

  const handlePinClick = () => {
    if (onPinClicked) {
      onPinClicked(heading);
    }
  };

  const handleFilterClick = () => {
    setFilterClicked(!filterClicked);
    setDrawerOpen(!drawerOpen);
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
    setTimeout(() => {
      setDrawerOpen(false);
      setFilterClicked(false);  // Reset the table movement after drawer closes
    }, 300);  // Timeout to match the drawer's closing transition duration
  };

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (selectedItem) => {
    setSelectedItem(selectedItem);
    handleClose();
    onSelectedItem(selectedItem);
  };

  const handleSearchInputChange = (event) => {
    onSearch(event.target.value);
  };

  const clearFilters = () => {
    if (page === "document") {
      setDocFilterState({
        companyId: [],
        projectId: "",
        document: "",
        company: "",
        project: "",
      });
      onApplyFilters({});
      triggerClearFilters();
      setIsDocFilterApplied(false);
    }
    if (page === "portfolio") {
      setPortfolioFilters({
        companyId: [],
        projectsCount: [1, 500],
        company: "",
      });
      onApplyFilters({});
      triggerPortfolioClearFilters();
      setIsPortfolioFilterApplied(false);
    }
    if (page === "project") {
      localStorage.removeItem("projectFilters");
      setProjectFilterState({
        ...projectFilterState,
        companyId: [],
        accountingYear: [],
        fiscalYear: [],
        company: [],
        project: [],
        spocName: [],
        spocEmail: [],
        dataGathering: [],
        projectStatus: [],
        surveyStatus: [],
        timesheetStatus: [],
        fteCostStatus: [],
        subconCostStatus: [],
        technicalInterviewStatus: [],
        technicalSummaryStatus: [],
        financialSummaryStatus: [],
        claimsFormstatus: [],
        finalReviewStatus: [],
        lastUpdateBy: [],
        s_fte_cost: [0, null],
        s_subcon_cost: [0, null],
        s_total_project_cost: [0, null],
        s_fte_qre_cost: [0, null],
        s_subcon_qre_cost: [0, null],
        s_qre_cost: [0, null],
        s_fte_hours: [0, null],
        s_subcon_hours: [0, null],
        s_total_hours: [0, null],
        rndPotential: [0, null],
        s_rnd_adjustment: [0, null],
        rndFinal: [0, null],
        s_rd_credits: [0, null],
      });
      setActiveFilterCount(0);
      fetchProjects({});
      onApplyFilters({});
      triggerProjectClearFilters();
      setIsProjectFilterApplied(false);
    }
    if (page === "company") {
      setClientFilters({
        type: "",
        projectsCount: [0, null],
        billingCountry: [],
        totalProjectCost: [0, null],
        totalRnDCost: [0, null],
      });
      onApplyFilters({});
      triggerClientClearFilters();
      setIsClientFilterApplied(false);
    }
    if (page === "workbench") {
      setWorkbenchFilterState({
        companyId: [],
        projectId: [],
        timesheetId: [],
        month: [],
        company: "",
        project: "",
        timesheet: "",
        monthName: "",
      });
      onApplyFilters({});
      triggerWorkbenchClearFilters();
      setIsWorkbenchFilterApplied(false);
    }
    if (page === "Employees") {
      setContactFilterState({
        companyId: [],
        employementType: "",
        company: "",
      });
      onApplyFilters({});
      triggerContactClearFilters();
      setIsContactFilterApplied(false);
    }
    if (page === "activity") {
      setActivityFilterState({
        interactionActivityType: [],
        interactionTo: [],
        modifiedTime: [],
        from: "",
        to: "",
        activityStatus: [],
        activityType: "",
        sentTo: "",
        date: "",
        dateFrom: "",
        dateTo: "",
        status: "",
      });
      onApplyFilters({});
      triggerActivityClearFilters();
      setIsActivityFilterApplied(false);
    }
    if (page === "timesheet") {
      setTimesheetFilterState({
        companyId: [],
        company: "",
        accountingYear: [],
        accYear: "",
        totalhours: [0, null],
      });
      onApplyFilters({});
      triggerTimesheetClearFilters();
      setIsTimesheetFilterApplied(false);
    }
    if (page === "case") {
      setCaseFilterState({
        companyId: [],
        sortField: "",
        sortOrder: "",
        company: "",
        countryName: "",
      });
      onApplyFilters({});
      triggerCaseClearFilters();
      setIsCaseFilterApplied(false);
    }
  };

  useEffect(() => {
    setActiveFilterCount(0);
  }, [setProjectFilterState]);


  return (
    <>


      <Box sx={{ display: "flex", pt: 1, pb: page === "activity" ? 1 : 0, pl: 5 }}>

        {/* <Box sx={{ marginLeft: "7px", marginTop: "4px", display: "flex", alignItems: "center" }}>
          {!(page === "alerts") && (
            <HiFilter
              style={styleConstants.filterDownloadStyle}
              onClick={handleFilterClick}  // Click to toggle filter panel
            />
          )}
        </Box>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleFilterPanelClose}
          sx={{
            width: '300px',
            flexShrink: 0,
            transition: 'transform 0.3s ease-in-out',
          }}
          variant="persistent"
        >
          {filterPanelOpen && (
            <FilterPanel
              handleClose={handleFilterClose}
              open={filterPanelOpen}
              page={page}
              documentType={documentType}
              onApplyFilters={onApplyFilters}
              style={{ position: 'absolute', left: 0 }}
            />

          )}
        </Drawer> */}
        <Box
          sx={{
            marginLeft: filterClicked ? '300px' : '0',   // Shift table if filter clicked
            transition: 'margin-left 0.3s ease',         // Smooth transition for table movement
          }}
        >

          <Box sx={{ flex: 5, display: "flex", alignItems: "center" }}>
            <Typography
              sx={styleConstants.titleStyle}
              onClick={
                page !== "alerts" && page !== "document" ? handleClick : undefined
              }
            >
              {selectedItem}{" "}
              {!(page === "alerts" || page === "document") && (
                <>
                  <KeyboardArrowDownIcon
                    sx={{ fontSize: "17px", ml: 0.5, mr: 1 }}
                  />
                </>
              )}
            </Typography>
            {/*// git pin has been removed here*/}
            {/* {!(page === "alerts" || page === "document") && (
            // <GiPin style={styleConstants.pinStyle} onClick={(handlePinClick)} />
            <GiPin style={styleConstants.pinStyle} onClick={(() => {})} />
          )} */}
            <TableHeaderDropdown
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorEl={anchorEl}
              items={items}
              handleMenuItemClick={handleMenuItemClick}
            />
            {/* {searchPermission && (
              <>
                <InputBase
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearchInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon sx={styleConstants.searchIconStyle} />
                    </InputAdornment>
                  }
                  sx={styleConstants.inputStyle}
                />
              </>
            )
            } */}

            <Box sx={{ display: "flex" }}>
              {page === "project" && projectNavs?.map(({ name, isAuth }) => {
                if (isAuth) {
                  return (
                    <Button key={name} sx={buttonStyle(name)} component={Link} onClick={() => { handleSelectedTab(name) }}>{name}</Button>
                  )
                }
              })}
            </Box>
            <Box sx={{ display: "flex" }}>
              {page === "Employees" && employeeNavs?.map(({ name, isAuth }) => {
                if (isAuth) {
                  return (
                    <Button key={name} sx={buttonStyle(name)} component={Link} onClick={() => { handleSelectedTab(name) }}>{name}</Button>
                  )
                }
              })}
            </Box>
          </Box>
        </Box>
        {!(page === "workbench") && <Box sx={{ flex: 1 }}></Box>}
        <Box
          sx={{
            flex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!(page === "workbench" || page === "alerts") && createPermission && (
            <>
              {(page === "projectTeam" || page === "upload-sheet") && (
                <>
                  {<Tooltip
                    title={page === "projectTeam" || page === "upload-sheet" ? "Download Sample Sheet" : "Perform action"}> <Button variant="contained" sx={{
                      ...styleConstants.downloadButtonStyle,
                      minWidth: 42,
                      padding: "4px 8px",
                    }} onClick={onDownloadClick2}> <Download sx={{ height: 20 }} />{btnNameD}</Button> </Tooltip>}
                </>
              )}
              {(page === "project") &&
                (<>
                  {selectedTab === "All Projects" && <Tooltip
                    title={page === "project" ? "Download Projects" : "Perform action"}> <Button variant="contained" sx={{
                      ...styleConstants.downloadButtonStyle,
                      minWidth: 45,
                      padding: "4px 8px",
                    }} onClick={onDownloadClick}> <Download sx={{ height: 20 }} />{btnNameD}</Button> </Tooltip>}
                  {selectedTab === "All Projects" && <Tooltip
                    title={page === "project" ? "Update SPOC" : "Perform action"}> <Button variant="contained" sx={
                      {
                        ...styleConstants.downloadButtonStyle,
                        minWidth: 85,
                        padding: "4px 8px"
                      }} onClick={onUploadClick2}> <Edit sx={{ mr: 0.2, height: 16 }} />{btnName2}</Button> </Tooltip>}
                  {selectedTab === "Uploaded Sheets" && <Tooltip
                    title={page === "project" ? "Upload Project" : "Perform action"}><Button variation="contained" sx={{ ...styleConstants.updateButtonStyle, color: "white", px: 2, py: 0.8, my: -0.1 }} onClick={onUploadClick3}>{(page === "project") && (
                      <GoUpload style={styleConstants.iconStyle} />
                    )}{" "}</Button></Tooltip>} </>)}

              {/* {(page === "project") &&
                  (<> <Button variant="contained" sx={styleConstants.newCompanyButtonStyle} onClick={onUploadClick2}>{btnName2}</Button> <Button variation="contained" sx={{ ...styleConstants.newCompanyButtonStyle, color: "white" }} onClick={onUploadClick3}>{btnName3}</Button> </>)} */}

              {(page === "Employees") &&
                (<>
                  <Tooltip title="Upload Employees/Wages"> <Button variation="contained" sx={{ ...styleConstants.newCompanyButtonStyle, color: "white", px: 1, py: 1, my: -0.1 }} onClick={onUploadClickX}>{(page === "Employees") && (
                    // <GoUpload style={styleConstants.iconStyle} />
                    <FileUpload style={styleConstants.iconStyle} />
                  )}</Button></Tooltip> </>)}
              {(page === "Employees") &&
                (<>  {selectedTab === "Uploaded Sheets" && <Button variation="contained" sx={{ ...styleConstants.newCompanyButtonStyle, color: "white" }} onClick={onUploadClickX}>{(page === "Employees") && (
                  <GoUpload style={styleConstants.iconStyle} />
                )}{" "}{btnNameX}</Button>} </>)}

              <Tooltip
                title={
                  page === "company" ? "Create Account" :
                    page === "project" ? "Add Project" :
                      page === "Employees" ? "Create Employee" :
                        page === "case" ? "Create Case" :
                          page === "timesheet" ? "Upload Timesheet" :
                            page === "document" ? "Upload Document" :
                              page === "projectTeam" ? "Upload Team Members" :
                                page === "upload-sheet" ? "Upload Sheets" :
                                  "Perform action"
                }
              >
                {<Button
                  sx={{
                    ...styleConstants.newCompanyButtonStyle,
                    width: "0.5em",
                    height: "2.5em",
                    fontSize: "12px",
                    minWidth: "unset",
                    padding: "10px 20px !important",
                  }}
                  onClick={onUploadClick}
                >
                  {(page === "company" ||
                    page === "project" ||
                    page === "Employees" ||
                    page === "activity" ||
                    page === "portfolio" ||
                    page === "case") && (
                      <Add style={styleConstants.addIconStyle} />
                    )}{" "}
                  {(page === "timesheet" || page === "document" || page === "projectTeam" || page === "upload-sheet") && (
                    <FileUpload style={styleConstants.iconStyle} />
                  )}{" "}
                  {/* {btnName} */}
                </Button>}
              </Tooltip>
            </>
          )}
          {searchPermission && (
            <>
              <InputBase
                type="text"
                placeholder="Search..."
                onChange={handleSearchInputChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon sx={styleConstants.searchIconStyle} />
                  </InputAdornment>
                }
                sx={styleConstants.inputStyle}
              />
            </>
          )
          }
        </Box >
        {/* {filterPanelOpen && (
          <FilterPanel
            handleClose={handleFilterClose}
            open={filterPanelOpen}
            page={page}
            documentType={documentType}
            onApplyFilters={onApplyFilters}
          />
        )} */}
      </Box >
      {/* <Typography sx={styleConstants.subTitleStyle}> */}
      <Typography
        sx={page === "company" || page === "project" ? styleConstants.companyStyle : styleConstants.projectStyle}
      >
        {/* {(selectedTab === "Uploaded Sheets" && page === "project")
          ? `${startItem} - ${totalSheetsNumber} of ${totalSheetsNumber} items; Updated ${latestUpdateTime}`
          : `${startItem} - ${endItem} of ${totalItems} items; Updated ${latestUpdateTime}`
        } */}

        {page === "Employees" && `Sorted by: ${contactSortFileds};`}
        {page === "timesheet" && `Sorted by: ${timeSheetSortFields};`}
        {page === "document" && `Sorted by: ${documentSortFields};`}
        {page === "case" && `Sorted by: ${caseSortFields};`}
        {page === "Employees" && ` Filtered by: ${contactFilterFields}`}
        {page === "timesheet" && ` Filtered by: ${timeSheetFilterFields}`}
        {page === "document" && ` Filtered by: ${documentFilterFields}`}
        {page === "case" && ` Filtered by: ${caseFilterFields}`}
        {page === "company" && `Sorted by: ${clientSortFields};`}
        {page === "project" && `Sorted by: ${projectsSortFields};`}
        {page === "company" && ` Filtered by: ${clientFilterFields}`}
        {page === "project" && ` Filtered by: ${projectsFilterFields}`}
        {page === "projectTeam" && `Sorted by: ${appliedTeamSortParams};`}
        {page === "projectTeam" && ` Filtered by: ${appliedTeamFilterParams}`}
        <span
          style={styleConstants.clearFiltersStyle}
          onClick={() => {
            if (page === "projectTeam") {
              setTriggerClear(true);
            }
            else clearFilters();
          }}
        >
          Clear Filters
        </span>
        {/* <span>
          Active Filters: {countActiveFilters()}
        </span> */}
        {/* {page === "document" &&
          areFiltersApplied(appliedFilters) &&
          isDocFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "portfolio" &&
          areFiltersApplied(appliedFilters) &&
          isPortfolioFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "project" &&
          areFiltersApplied(appliedFilters) &&
          isProjectFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "company" &&
          areFiltersApplied(appliedFilters) &&
          isClientFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "workbench" &&
          areFiltersApplied(appliedFilters) &&
          isWorkbenchFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "Employees" &&
          areFiltersApplied(appliedFilters) &&
          isContactFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "activity" &&
          areFiltersApplied(appliedFilters) &&
          isActivityFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "timesheet" &&
          areFiltersApplied(appliedFilters) &&
          isTimesheetFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )}
        {page === "case" &&
          areFiltersApplied(appliedFilters) &&
          isCaseFilterApplied && (
            <span>
              &bull; Filtered By {formatFilters(appliedFilters)}
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </span>
          )} */}
      </Typography>
    </>
  );

}

export default TableIntro;