import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Drawer, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { DocumentContext } from "../../context/DocumentContext";
// import CompanyFilters from "../Companies/CompanyFilters";
import DocumentFilters from "../Documents/DocumentFilters";
import ActionButton from "../FilterComponents/ActionButton";
// import TitleSelector from "../FilterComponents/TitleSelector";
// import MonthSelector from "../FilterComponents/MonthSelector";
import { ClientContext } from "../../context/ClientContext";
import { PortfolioContext } from "../../context/PortfolioContext";
import { ProjectContext } from "../../context/ProjectContext";
// import ProjectFilters from "../Projects/ProjectFilters";
import WorkbenchFilters from "../Reconciliations/WorkbenchFilters";
import { FilterListContext } from "../../context/FiltersListContext";
import TimesheetFilters from "../Timesheets/TimesheetFilter";
import { TimesheetContext } from "../../context/TimesheetContext";
import { WorkbenchContext } from "../../context/WorkbenchContext";
import ContactFilters from "../Contacts/ContactFilters";
import ActivityFilter from "../Activity/ActivityFilter";
import { ContactContext } from "../../context/ContactContext";
import { ActivityContext } from "../../context/ActivityContext";
import UserManagementFilters from "../Settings/UserManagement/UserManagementFilters";
import { UserManagementContext } from "../../context/UserManagementContext";
import { EmployeeContext } from "../../context/EmployeeContext";
import CompanyFilters from "../Projects/CompanyFilters";
import { Authorization_header } from "../../utils/helper/Constant";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import toast from "react-hot-toast";
import ProjectsFilters from "../Projects/ProjectsFilters";
import { CaseContext } from "../../context/CaseContext";
import CaseFilter from "../Cases/CaseFilter";
import AccountFilters from "../Companies/AccountFilters";

const styles = {
  drawerPaper: {
    "& .MuiDrawer-paper": {
      borderRadius: "20px 0px 0px 20px",
      height: "72%",
      marginTop: "15%",
      borderRadius: "20px"
    },
  },
  label: {
    fontWeight: 500,
    color: "#404040",
    fontSize: "13px",
  },
  formControl: {
    m: 1,
    minWidth: 120,
    borderRadius: "20px",
  },
  select: {
    borderRadius: "20px",
    height: "30px",
    width: "240px",
    // marginLeft: "7px",
  },
  slider: {
    color: "#b9e4c9",
    "& .MuiSlider-thumb": {
      height: "14px",
      width: "14px",
      backgroundColor: "#FFFFFF",
      border: "2px solid #00A398",
      "&:focus, &:hover, &.Mui-active": {
        boxShadow: "inherit",
      },
    },
    "& .MuiSlider-track": {
      height: "16px",
      borderRadius: "4px",
      backgroundColor: "#00A398",
    },
    "& .MuiSlider-rail": {
      height: "16px",
      borderRadius: "10px",
      opacity: 0.5,
      backgroundColor: "#E4E4E4",
    },
  },
  valueBox: {
    borderRadius: "20px",
    border: "1px solid #E4E4E4",
    width: "84px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#404040",
  },
  button: {
    width: "60px",
    height: "30px",
    borderRadius: "20px",
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: "13px",
    color: "white",
    marginRight: "8px",
  },
  title: {
    fontSize: "13px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  valueBoxStyle: { display: "flex", justifyContent: "space-between" },
};

function FilterPanel({
  handleClose,
  open,
  page,
  documentType,
  onApplyFilters,
}) {
  const { clientList } = useContext(FilterListContext);
  const [companySortParam, setCompanySortParam] = useState({ sortField: "", sortOrder: "" });
  const [projectSortParam, setProjectSortParam] = useState({ sortField: "", sortOrder: "" });
  const [timeSheetSortParam, setTimeSheetSortParam] = useState({ sortField: "", sortOrder: "" });
  const [documentSortParam, setDocumentSortParam] = useState({ sortField: "", sortOrder: "" });
  const [caseSortParam, setCaseSortParam] = useState({ sortField: "", sortOrder: "" });
  const {
    docFilterState,
    setDocFilterState,
    triggerClearFilters,
    setIsDocFilterApplied,
    documentSort,
  } = useContext(DocumentContext);
  const {
    portfolioFilters,
    setPortfolioFilters,
    triggerPortfolioClearFilters,
    setIsPortfolioFilterApplied,
  } = useContext(PortfolioContext);
  const {
    fetchProjects,
    projectFilterState,
    setProjectFilterState,
    triggerProjectClearFilters,
    setIsProjectFilterApplied,
    ProjectSort,
  } = useContext(ProjectContext);
  const {
    clientFilters,
    setClientFilters,
    setIsClientFilterApplied,
    triggerClientClearFilters,
    applySort,
  } = useContext(ClientContext);
  const {
    caseFilterState,
    setCaseFilterState,
    triggerCaseClearFilters,
    setIsCaseFilterApplied,
    caseSort,
  } = useContext(CaseContext);
  const {
    timesheetFilterState,
    setTimesheetFilterState,
    triggerTimesheetClearFilters,
    setIsTimesheetFilterApplied,
    timeSheetSort,
  } = useContext(TimesheetContext);
  const {
    workbenchFilterState,
    setWorkbenchFilterState,
    triggerWorkbenchClearFilters,
    setIsWorkbenchFilterApplied,
  } = useContext(WorkbenchContext);
  const {
    contactFilterState,
    setContactFilterState,
    triggerContactClearFilters,
    setIsContactFilterApplied,
  } = useContext(ContactContext);
  const {
    employeeFilterState,
    setEmployeeFilterState,
    triggerEmployeeClearFilters,
    setIsEmployeeFilterApplied,
  } = useContext(EmployeeContext);
  const {
    activityFilterState,
    setActivityFilterState,
    triggerActivityClearFilters,
    setIsActivityFilterApplied,
  } = useContext(ActivityContext);
  const {
    userFilterState,
    setUserFilterState,
    triggerUserClearFilters,
    setIsUserFilterApplied,
    isUserFilterApplied,
  } = useContext(UserManagementContext);

  let documentOptions;
  useEffect(() => {
    const shouldFetchWithFilters =
      docFilterState.companyId?.length > 0 ||
      docFilterState.projectId.length ||
      docFilterState.document.length ||
      docFilterState?.sortField ||
      docFilterState?.sortOrder;

    if (shouldFetchWithFilters) {
      documentOptions = {
        ...(docFilterState.companyId?.length > 0 && {
          companyIds: docFilterState.companyId,
        }),
        ...(docFilterState.projectId && {
          relationId: docFilterState.projectId,
        }),
        ...(docFilterState.document && {
          documentType: docFilterState.document,
        }),
        ...(docFilterState?.sortField && {
          sortField: docFilterState.sortField,
        }),
        ...(docFilterState?.sortOrder && {
          sortOrder: docFilterState.sortOrder,
        })
      };
    }
  }, [docFilterState]);

  const getCompanySortParams = ({ sortField, sortOrder }) => {
    setCompanySortParam({ sortField: sortField, sortOrder: sortOrder });
  }

  const getProjectSortParams = ({ sortField, sortOrder }) => {
    setProjectSortParam({ sortField: sortField, sortOrder: sortOrder });
  }

  const getTimeSheetSortParams = ({ sortField, sortOrder }) => {
    setTimeSheetSortParam({ sortField: sortField, sortOrder: sortOrder });
  }

  const getDocumentSortParams = ({ sortField, sortOrder }) => {
    setDocumentSortParam({ sortField: sortField, sortOrder: sortOrder });
  }

  const getCaseSortParams = ({ sortField, sortOrder }) => {
    setCaseSortParam({ sortField: sortField, sortOrder: sortOrder });
  }

  let portfolioOptions;
  useEffect(() => {
    const shouldFetchWithFiltersPortfolio =
      portfolioFilters.companyId?.length > 0;

    if (shouldFetchWithFiltersPortfolio) {
      portfolioOptions = {
        ...(portfolioFilters.companyId?.length > 0 && {
          companyIds: portfolioFilters.companyId,
        }),
        ...(portfolioFilters.projectsCount && {
          minProjects: portfolioFilters.projectsCount[0],
        }),
        ...(portfolioFilters.projectsCount && {
          maxProjects: portfolioFilters.projectsCount[1],
        }),
      };
    }
  }, [portfolioFilters]);

  let projectsOptions;
  useEffect(() => {
    const shouldFetchWithFiltersProjects =
      projectFilterState.companyId?.length > 0 ||
      projectFilterState.portfolioId?.length > 0 ||
      projectFilterState.accountingYear?.length > 0 ||
      projectFilterState.totalExpense?.length > 0 ||
      projectFilterState.rndExpense?.length > 0 ||
      projectFilterState.rndPotential?.length > 0 ||
      projectFilterState?.sortField?.length > 0 ||
      projectFilterState?.sortOrder?.length > 0

    if (shouldFetchWithFiltersProjects) {
      projectsOptions = {
        ...(projectFilterState.companyId?.length > 0 && {
          companyId: projectFilterState.companyId,
        }),
        ...(projectFilterState.portfolioId?.length > 0 && {
          portfolioId: projectFilterState.portfolioId,
        }),
        ...(projectFilterState.accountingYear?.length > 0 && {
          accountingYear: projectFilterState.accountingYear,
        }),
        ...(projectFilterState.totalExpense && {
          minTotalExpense: projectFilterState.totalExpense[0],
        }),
        ...(projectFilterState.totalExpense && {
          maxTotalExpense: projectFilterState.totalExpense[1],
        }),
        ...(projectFilterState.rndExpense && {
          minRnDExpense: projectFilterState.rndExpense[0],
        }),
        ...(projectFilterState.rndExpense && {
          maxRnDExpense: projectFilterState.rndExpense[1],
        }),
        ...(projectFilterState.rndPotential && {
          minRnDPotential: projectFilterState.rndPotential[0],
        }),
        ...(projectFilterState.rndPotential && {
          maxRnDPotential: projectFilterState.rndPotential[1],
        }),
        ...(projectFilterState.sortField && {
          sortField: projectFilterState?.sortField
        }),
        ...(projectFilterState.sortOrder && {
          sortOrder: projectFilterState?.sortOrder
        })
      };
    }
  }, [projectFilterState]);

  let clientOptions;
  useEffect(() => {
    const shouldFetchWithFiltersClient =
      clientFilters.billingCountry?.length > 0 ||
      clientFilters.projectsCount?.length > 0 ||
      clientFilters.totalProjectCost?.length > 0 ||
      clientFilters.totalRnDCost?.length > 0 ||
      clientFilters.sortField?.length > 0 ||
      clientFilters.sortOrder?.length > 0;
    if (shouldFetchWithFiltersClient) {
      clientOptions = {
        ...(clientFilters.billingCountry && {
          billingCountry: clientFilters.billingCountry,
        }),
        ...(clientFilters.projectsCount && {
          minProjectsCount: clientFilters.projectsCount[0],
        }),
        ...(clientFilters.projectsCount && {
          maxProjectsCount: clientFilters.projectsCount[1],
        }),
        ...(clientFilters.totalProjectCost && {
          minTotalExpense: clientFilters.totalProjectCost[0],
        }),
        ...(clientFilters.totalProjectCost && {
          maxTotalExpense: clientFilters.totalProjectCost[1],
        }),
        ...(clientFilters.totalRnDCost && {
          minTotalRnDExpense: clientFilters.totalRnDCost[0],
        }),
        ...(clientFilters.totalRnDCost && {
          maxTotalRnDExpense: clientFilters.totalRnDCost[1],
        }),
        ...(clientFilters.sortField && clientFilters.sortOrder && {
          sortField: clientFilters.sortField,
          sortOrder: clientFilters.sortOrder
        })
      };
    }
  }, [clientFilters]);

  let timesheetOptions;
  useEffect(() => {
    const shouldFetchWithFiltersTimesheet =
      timesheetFilterState.companyId?.length > 0 ||
      timesheetFilterState.accountingYear?.length > 0 ||
      timesheetFilterState.totalhours?.length > 0 ||
      timesheetFilterState?.sortField?.length > 0 ||
      timesheetFilterState?.sortOrder?.length > 0;
    if (shouldFetchWithFiltersTimesheet) {
      timesheetOptions = {
        ...(timesheetFilterState.companyId?.length > 0 && {
          client: timesheetFilterState.companyId,
        }),
        ...(timesheetFilterState.accountingYear?.length > 0 && {
          accountingYear: timesheetFilterState.accountingYear,
        }),
        ...(timesheetFilterState.totalhours && {
          minTotalhours: timesheetFilterState.totalhours[0],
        }),
        ...(timesheetFilterState.totalhours && {
          maxTotalhours: timesheetFilterState.totalhours[1],
        }),
        ...(timesheetFilterState?.sortField?.length > 0 && timesheetFilterState?.sortOrder?.length && {
          sortField: timesheetFilterState?.sortField,
          sortOrder: timesheetFilterState?.sortOrder,
        }),

      };
    }
  }, [timesheetFilterState]);

  let caseOptions = {};
  useEffect(() => {
    const shouldFetchWithFiltersCase =
      caseFilterState?.company?.length > 0 ||
      caseFilterState?.companyId?.length > 0 ||
      caseFilterState?.sortField?.length > 0 ||
      caseFilterState?.sortOrder?.length > 0 ||
      caseFilterState?.countryName?.length > 0 ||
      caseFilterState?.sortField?.length ||
      caseFilterState?.sortOrder?.length;
    if (shouldFetchWithFiltersCase) {
      caseOptions = {
        ...(caseFilterState.companyId?.length > 0 && {
          client: caseFilterState.companyId,
        }),
        ...(caseFilterState.sortField.length > 0 && {
          sortField: caseFilterState?.sortField
        }),
        ...(caseFilterState.sortOrder.length > 0 && {
          sortOrder: caseFilterState?.sortOrder
        }),
        ...(caseFilterState.countryName && {
          countryName: caseFilterState.countryName,
        }),
        ...(caseFilterState?.company && {
          company: caseFilterState.company,
        })
      };
    }
  }, [caseFilterState]);



  let workbenchOptions;
  useEffect(() => {
    const shouldFetchWithFilters =
      workbenchFilterState.companyId?.length > 0 ||
      workbenchFilterState.projectId?.length > 0 ||
      workbenchFilterState.monthName !== "" ||
      workbenchFilterState.timesheetId?.length > 0;
    if (shouldFetchWithFilters) {
      workbenchOptions = {
        ...(workbenchFilterState.companyId?.length > 0 && {
          companyId: workbenchFilterState.companyId,
        }),
        ...(workbenchFilterState.projectId?.length > 0 && {
          projectId: workbenchFilterState.projectId,
        }),
        ...(workbenchFilterState.timesheetId?.length > 0 && {
          timesheetId: workbenchFilterState.timesheetId,
        }),
        ...(workbenchFilterState.monthName !== "" && {
          timesheetMonth: [workbenchFilterState.monthName],
        }),
      };
    }
  }, [workbenchFilterState]);

  let contactOptions;
  useEffect(() => {
    const shouldFetchWithFiltersContact =
      contactFilterState.companyId?.length > 0 ||
      contactFilterState.employementType !== "";
    if (shouldFetchWithFiltersContact) {
      contactOptions = {
        ...(timesheetFilterState.companyId?.length > 0 && {
          client: timesheetFilterState.companyId,
        }),
        ...(contactFilterState.employementType !== "" && {
          employementType: [contactFilterState.employementType],
        }),
      };
    }
  }, [contactFilterState]);

  let activityOptions;
  useEffect(() => {
    const shouldFetchWithFiltersActivity =
      activityFilterState.interactionActivityType?.length > 0 ||
      activityFilterState.interactionTo?.length > 0 ||
      activityFilterState.status !== "" ||
      activityFilterState.from !== "" ||
      activityFilterState.to !== "" ||
      activityFilterState.modifiedTime?.length > 0;
    if (shouldFetchWithFiltersActivity) {
      activityOptions = {
        ...(activityFilterState.interactionActivityType?.length > 0 && {
          interactionActivityType: activityFilterState.interactionActivityType,
        }),
        ...(activityFilterState.interactionTo?.length > 0 && {
          interactionTo: activityFilterState.interactionTo,
        }),
        ...(activityFilterState.modifiedTime?.length > 0 && {
          modifiedTime: activityFilterState.modifiedTime,
        }),
        ...(activityFilterState.status !== "" && {
          status: [activityFilterState.status],
        }),
        ...(activityFilterState.from !== "" && {
          from: activityFilterState.from,
        }),
        ...(activityFilterState.to !== "" && {
          to: activityFilterState.to,
        }),
      };
    }
  }, [activityFilterState]);

  let userOptions;
  useEffect(() => {
    const shouldFetchWithFiltersUsers =
      userFilterState.clients?.length > 0 ||
      userFilterState.title?.length > 0 ||
      userFilterState.role?.length > 0 ||
      userFilterState.status !== "";
    if (shouldFetchWithFiltersUsers) {
      userOptions = {
        ...(userFilterState.clients?.length > 0 && {
          clients: userFilterState.clients,
        }),
        ...(userFilterState.title?.length > 0 && {
          title: userFilterState.title,
        }),
        ...(userFilterState.role?.length > 0 && {
          role: userFilterState.role,
        }),
        ...(userFilterState.status !== "" && {
          status: userFilterState.status,
        }),
        // ...(userFilterState.status !== "" && {
        //   status: [userFilterState.status],
        // }),
      };
    }
  }, [isUserFilterApplied]);

  const clearFilters = () => {
    if (page === "document") {
      setDocFilterState({
        ...docFilterState,
        companyId: [],
        projectId: "",
        document: "",
        company: "",
        project: "",
        sortField: "",
        sortOrder: ""
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
      setProjectFilterState({
        companyId: [],
        portfolioId: [],
        accountingYear: [],
        accYear: "",
        company: "",
        project: "",
        totalExpense: [1, 100000],
        rndExpense: [1, 100000],
        rndPotential: [1, 100],
      });
      onApplyFilters({});
      triggerProjectClearFilters();
      setIsProjectFilterApplied(false);
    }
    if (page === "company") {
      setClientFilters({
        ...clientFilters,
        projectsCount: [0, null],
        billingCountry: [],
        totalProjectCost: [0, null],
        totalRnDCost: [0, null],
      });
      onApplyFilters({});
      triggerClientClearFilters();
      setIsClientFilterApplied(false);
    }
    if (page === "timesheet") {
      setTimesheetFilterState({
        ...timesheetFilterState,
        companyId: [],
        company: "",
        accountingYear: [],
        accYear: "",
        totalhours: [1, 100000],
      });
      onApplyFilters({});
      triggerTimesheetClearFilters();
      setIsTimesheetFilterApplied(false);
    }
    if (page === "case") {
      setCaseFilterState({
        ...caseFilterState,
        company: "",
        companyId: [],
        countryName: "",
        caseOwnerName: "",
        sortField: "",
        sortOrder: "",
      });
      onApplyFilters({});
      triggerCaseClearFilters();
      setIsCaseFilterApplied(false);
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
        company: "",
        employementType: "",
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
    if (page === "user management") {
      setUserFilterState({
        clients: [],
        title: [],
        role: [],
        status: "",
        clientName: "",
        employementType: "",
        roleType: "",
        statusType: "",
      });
      onApplyFilters({});
      triggerUserClearFilters();
      setIsUserFilterApplied(false);
    }
  };

  const companySort = () => {
    applySort(companySortParam);
  }

  const projectSort = () => {
    ProjectSort(projectSortParam);
  }

  const TimeSheetSort = () => {
    timeSheetSort(timeSheetSortParam);
  }

  const DocumentSort = () => {
    documentSort(documentSortParam)
  }

  const CaseSort = () => {
    caseSort(caseSortParam);
  }

  const applyFilters = () => {
    if (page === "document") {
      onApplyFilters(documentOptions);
    }
    if (page === "portfolio") {
      onApplyFilters(portfolioOptions);
    }
    if (page === "project") {
      onApplyFilters(projectsOptions);

    }
    if (page === "company") {
      onApplyFilters(clientOptions);
      // applySort(companySortParam);
    }
    if (page === "timesheet") {
      onApplyFilters(timesheetOptions);
    }
    if (page === "case") {
      onApplyFilters(caseOptions);
    }
    if (page === "workbench") {
      onApplyFilters(workbenchOptions);
    }
    if (page === "Employees") {
      onApplyFilters(contactOptions);
    }
    if (page === "activity") {
      onApplyFilters(activityOptions);

    }
    if (page === "user management") {
      onApplyFilters(userOptions);
    }
  };
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      sx={styles.drawerPaper}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E4E4E4",
          px: 2,
          py: 1,
        }}
      >
        <Typography sx={styles.title}>
          {page === "company" ? "Account" : page} Filters
        </Typography>
        <CancelIcon
          sx={{
            color: "#9F9F9F",
            cursor: "pointer",
            "&: hover": { color: "#FD5707" },
          }}
          onClick={handleClose}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 2,
          }}
        >
          {page === "project" && <ProjectsFilters clientData={clientList} getProjectSortParams={getProjectSortParams} projectSort={projectSort} />}
          {(/*page === "project" ||*/ page === "company") && <AccountFilters clientData={clientList} />}

          {/* {page === "portfolio" && <PortfolioFilters clientData={clientList} />} */}
          {page === "document" && (
            <DocumentFilters
              documentClientData={clientList}
              documentType={documentType}
              getDocumentSortParams={getDocumentSortParams}
              DocumentSort={DocumentSort}
            />
          )}
          {/* {page === "company" && <CompanyFilters />} */}
          {page === "workbench" && <WorkbenchFilters />}
          {page === "timesheet" && <TimesheetFilters clientData={clientList} TimeSheetSort={TimeSheetSort} getTimeSheetSortParams={getTimeSheetSortParams} />}
          {page === "case" && <CaseFilter clientData={clientList} CaseSort={CaseSort} getCaseSortParams={getCaseSortParams} />}
          {page === "Employees" && <ContactFilters />}
          {page === "activity" && <ActivityFilter />}
          {page === "user management" && <UserManagementFilters />}
        </Box>
        <Box sx={{ ...styles.valueBoxStyle, p: 2 }}>
          <Box sx={{ flex: 1 }}>
            {/* <ActionButton
              label="Clear"
              color="#9F9F9F"
              onClick={clearFilters}
            /> */}
          </Box>
          <Box
            sx={{
              flex: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <ActionButton
              label="Clear"
              color="#9F9F9F"
              onClick={clearFilters}
            />
            {/* <ActionButton
              label="Cancel"
              color="#9F9F9F"
              onClick={handleClose}
            /> */}

            <ActionButton
              label="Apply"
              color="#00A398"
              onClick={() => {
                applyFilters();
                // projectSort();
              }}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default FilterPanel;