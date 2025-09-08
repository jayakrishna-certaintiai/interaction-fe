import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { BaseURL } from "../constants/Baseurl";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";
import toast from "react-hot-toast";
import { intersection, isArray } from "lodash";
import { useLocation } from "react-router-dom";

let sessionExpiredToastShown = false;

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState([]);
  const [projectFilterState, setProjectFilterState] = useState({
    caseId: [],
    companyId: [],
    portfolioId: [],
    accountingYear: [],
    fiscalYear: [],
    company: [],
    project: [],
    spocName: [],
    spocEmail: [],
    dataGathering: [],
    projectStatus: [],
    surveyStatus: [],
    intersectionStatus: [],
    timesheetStatus: [],
    fteCostStatus: [],
    subconCostStatus: [],
    technicalInterviewStatus: [],
    technicalSummaryStatus: [],
    financialSummaryStatus: [],
    claimsFormstatus: [],
    finalReviewStatus: [],
    lastUpdateBy: [],
    s_fte_cost: [null, null],
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
  const [clearProjectFilterTrigger, setClearProjectFilterTrigger] = useState(false);
  const [isProjectFilterApplied, setIsProjectFilterApplied] = useState(false);
  const [sortParams, setSortPrams] = useState({ sortField: null, sortOrder: null });
  const [projectSortParams, setProjectSortParams] = useState({ sortField: null, sortOrder: null });
  const [currentState, setCurrentState] = useState(
    pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Projects"
  );

  // const [projectId, setProjectId] = useState("");

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const ProjectId = queryParams.get('projectId');
  // useEffect(() => {
  //   setProjectId(ProjectId);
  // }, [localStorage?.getItem("keys")]);

  const [timesheetProject, setTimesheetProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthContext();
  const [projectsFilterOptions, setProjectsFilterOptions] = useState({});
  const [projectsFilterFields, setProjectsFilterFields] = useState("");
  const [projectsSortFields, setProjectsSortFields] = useState("");
  const [detailedCase, setDetailedCase] = useState(null);
  const [projectSummaryData, setSummaryData] = useState([]);
  const [projectInteractionData, setProjectInteractionData] = useState([]);
  const [loader, setLoader] = useState(false);

  // const location = useLocation();
  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const companyId = queryParams.get("companyId");
  //   let options = {};
  //   const savedFilters = localStorage.getItem("projectFilters");
  //   if (savedFilters) {
  //     options = JSON.parse(savedFilters);
  //   } else if (companyId) {
  //     options = { companyId: [companyId] };
  //   }
  //   fetchProjects(options);

  // }, [sortParams]);

  // const getProjectsSortParams = ({ sortField, sortOrder }) => {
  //   // switch(sortField) 
  //   // {
  //   //   case "Project Name":
  //   //     sortField: "projectName";
  //   //     break;
  //   //   case ""
  //   // }


  //   setSortPrams({
  //     sortField,
  //     sortOrder
  //   })
  // }



  const showSessionExpiredToast = () => {
    if (!sessionExpiredToastShown) {
      toast.error("Session expired, you need to login again");
      sessionExpiredToastShown = true;
  
      // Reset the flag after a few seconds to allow future toasts if needed
      setTimeout(() => {
        sessionExpiredToastShown = false;
      }, 10000); // Adjust delay as needed
    }
  };


  const getProjectsSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Project Name":
        sortField = "projectName";
        break;
      case "Project ID":
        sortField = "projectCode";
        break;
      case "Account":
        sortField = "companyName";
        break;
      case "Fiscal Year":
        sortField = "fiscalYear";
        break;
      case "SPOC Name":
        sortField = "spocName";
        break;
      case "SPOC Email":
        sortField = "spocEmail";
        break;
      case "Data Gathering":
        sortField = "s_data_gathering";
        break;
      case "Pending Data":
        sortField = "s_pending_data";
        break;
      case "Project Status":
        sortField = "s_project_status";
        break;
      case "Survey - Status":
        sortField = "surveyStatus";
        break;
      case "interaction - Status":
        sortField = "s_interaction_status";
        break;
      case "Project Cost - FTE":
        sortField = "s_fte_cost";
        break;
      case "Project Cost - Subcon":
        sortField = "s_subcon_cost";
        break;
      case "Project Cost - Total":
        sortField = "s_total_project_cost";
        break;
      case "QRE (%) - Potential":
        sortField = "rndPotential";
        break;
      case "QRE (%) - Adjustment":
        sortField = "s_rnd_adjustment";
        break;
      case "QRE (%) - Final":
        sortField = "rndFinal";
        break;
      case "QRE - FTE":
        sortField = "s_fte_qre_cost";
        break;
      case "QRE - Subcon":
        sortField = "s_subcon_qre_cost";
        break;
      case "QRE - Final":
        sortField = "s_qre_cost";
        break;
      case "QRE - Total":
        sortField = "s_qre_cost";
        break;
      case "R&D Credits":
        sortField = "s_rd_credits";
        break;
      case "Timesheet Status":
        sortField = "s_timesheet_status";
        break;
      case "Cost Status - Employee":
        sortField = "s_fte_cost_status";
        break;
      case "Cost Status - Subcon":
        sortField = "s_subcon_cost_status";
        break;
      case "Survey - Sent Date":
        sortField = "surveySentDate";
        break;
      case "Survey - Reminder Sent Date":
        sortField = "reminderSentDate";
        break;
      case "Survey - Response Date":
        sortField = "surveyResponseDate";
        break;
      case "Interaction - Status":
        sortField = "s_interaction_status";
        break;
      case "Technical Interview Status":
        sortField = "s_technical_interview_status";
        break;
      case "Technical Summary Status":
        sortField = "s_technical_summary_status";
        break;
      case "Financial summary Status":
        sortField = "s_financial_summary_status";
        break;
      case "Claims Form Status":
        sortField = "s_claims_form_status";
        break;
      case "Final Review Status":
        sortField = "s_final_review_status";
        break;
      case "Last Updated Date":
        sortField = "s_last_updated_timestamp";
        break;
      case "Last Updated By":
        sortField = "s_last_updated_by";
        break;
      case "Project Hours - FTE":
        sortField = "s_fte_hours";
        break;
      case "Project Hours - Subcon":
        sortField = "s_subcon_hours";
        break;
      case "Project Hours - Total":
        sortField = "s_total_hours";
        break;
      case "Pending Data":
        sortField = "s_pending_data";
        break;
      case "Notes":
        sortField = "s_notes";
        break;
      case "Project Identifer":
        sortField = "projectIdentifier";
        break;
      default:
        sortField = null;
    }
    setSortPrams({ sortField: sortField, sortOrder: sortOrder })
  }


  const triggerProjectClearFilters = () => {
    setProjectFilterState({
      companyId: [],
      portfolioId: [],
      accountingYear: [],
      fiscalYear: [],
      company: [],
      project: [],
      spocName: [],
      spocEmail: [],
      dataGathering: [],
      projectStatus: [],
      surveyStatus: [],
      intersectionStatus: [],
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
    setClearProjectFilterTrigger((prev) => !prev);
  };
  // useEffect(() => {
  //   if (clearProjectFilterTrigger) {
  //     // fetchProjects();
  //   }
  // }, [clearProjectFilterTrigger]);


  // useEffect(() => {
  //   if (clearProjectFilterTrigger) {
  //     // fetchTimesheetProjects();
  //   }
  // }, [clearProjectFilterTrigger]);

  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }

  useEffect(() => {
    if (sortParams?.sortField && sortParams?.sortOrder) {
      getProjects();
    }
  }, [sortParams])

  const ProjectSort = async ({ sortField, sortOrder }) => {
    const url = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/a0ds/get-projects`;
    try {
      toast.loading("Fetching projects data");
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        params: {
          sortField: sortField,
          sortOrder: sortOrder,
        },
      };
      const response = await axios.get(url, config)
      toast.dismiss();

      setProjects(response?.data?.data?.list);
      setProjectId(response?.data?.data?.list);
      setProjectsFilterFields(response?.data?.data?.appliedFilter);
      setProjectsSortFields(response?.data?.data?.appliedSort);
      toast.success(response?.data?.message || "Succesfully fetched data");
    } catch (error) {
      toast.dismiss();
      toast.error("Error in fetching client data");
      console.error("Error in fetching client data : ", error);
    }
  }

  const getProjects = async () => {


    const queryParams = new URLSearchParams();

    if (projectsFilterOptions?.companyId || projectFilterState?.companyId?.length > 0)
      queryParams.append("companyIds", JSON.stringify(projectFilterState?.companyId || projectFilterState?.companyId));
    if (projectsFilterOptions.spocName || projectFilterState.spocName?.length > 0) {
      queryParams.append(
        "spocNames",
        JSON.stringify(projectsFilterOptions.spocName || projectFilterState.spocName)
      );
    }

    if (projectsFilterOptions.spocEmail || projectFilterState.spocEmail?.length > 0) {
      queryParams.append(
        "spocEmails",
        JSON.stringify(projectsFilterOptions.spocEmail || projectFilterState.spocEmail)
      );
    }
    if (projectsFilterOptions.accountingYear || projectFilterState?.accountingYear?.length > 0)
      queryParams.append(
        "fiscalYears",
        JSON.stringify(projectsFilterOptions.accountingYear || projectFilterState.accountingYear)
      );
    if (projectsFilterOptions.minTotalExpense != null && projectsFilterOptions.minTotalExpense > 0) {
      queryParams.append("minTotalExpense", projectsFilterOptions.minTotalExpense);
    }

    if (projectsFilterOptions.maxTotalExpense != null && projectsFilterOptions.maxTotalExpense < 2000000) {
      queryParams.append("maxTotalExpense", projectsFilterOptions.maxTotalExpense);
    }

    if (projectsFilterOptions.minRnDExpense != null && projectsFilterOptions.minRnDExpense > 0) {
      queryParams.append("minRnDExpense", projectsFilterOptions.minRnDExpense);
    }

    if (projectsFilterOptions.maxRnDExpense != null && projectsFilterOptions.maxRnDExpense < 2000000) {
      queryParams.append("maxRnDExpense", projectsFilterOptions.maxRnDExpense);
    }

    // if (projectsFilterOptions.minRnDPotential != null && projectsFilterOptions.minRnDPotential > 0) {
    //   queryParams.append("minRnDPotential", projectsFilterOptions.minRnDPotential);
    // }

    if (projectsFilterOptions.maxRnDPotential != null && projectsFilterOptions.maxRnDPotential < 100) {
      queryParams.append("maxRnDPotential", projectsFilterOptions.maxRnDPotential);
    }
    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }
    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/projects/${localStorage.getItem(
      "userid"
    )}/projects${queryString ? `?${queryString}` : ""}`;
    setIsProjectFilterApplied(queryString);
    try {
      if (window.location.pathname !== "/projects" && window.location.pathname !== '/timesheets/details') return;
      const response = await axios.get(url, Authorization_header());
      setProjects(response?.data?.data?.list);
      setProjectsFilterFields(response?.data?.data?.appliedFilter);
      setProjectsSortFields(response?.data?.data?.appliedSort);
      if (projectsFilterOptions?.timesheetId) {
        setTimesheetProject(response?.data?.data?.list)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      console.error("Failed to fetch Projects:", error);
    }
  }

  const fetchProjects = async (options = {}) => {
    const queryParams = new URLSearchParams();
    if (options.companyId && options.companyId.length > 0) {
      if (!isArray(options.companyId)) {
        const idArray = [];
        idArray[0] = options.companyId;
        queryParams.append("companyIds", JSON.stringify(idArray));
      } else {
        queryParams.append("companyIds", JSON.stringify(options.companyId));
      }
    }
    if (options.spocName || projectFilterState.spocName?.length > 0) { queryParams.append("spocNames", JSON.stringify(options.spocName || projectFilterState.spocName)); }
    if (options.fiscalYear || projectFilterState.fiscalYear?.length > 0) { queryParams.append("fiscalYears", JSON.stringify(options.fiscalYear || projectFilterState.fiscalYear)); }
    if (options.spocEmail || projectFilterState.spocEmail?.length > 0) { queryParams.append("spocEmails", JSON.stringify(options.spocEmail || projectFilterState.spocEmail)); }
    if (options.dataGathering || projectFilterState.dataGathering?.length > 0) { queryParams.append("dataGatherings", JSON.stringify(options.dataGathering || projectFilterState.dataGathering)); }
    if (options.projectStatus || projectFilterState.projectStatus?.length > 0) { queryParams.append("projectStatuses", JSON.stringify(options.projectStatus || projectFilterState.projectStatus)); }
    if (options.surveyStatus || projectFilterState.surveyStatus?.length > 0) { queryParams.append("surveyStatuses", JSON.stringify(options.surveyStatus || projectFilterState.surveyStatus)); }
    if (options.interactionStatus || projectFilterState.interactionStatus?.length > 0) { queryParams.append("interactionStatuses", JSON.stringify(options.interactionStatus || projectFilterState.interactionStatus)); }
    if (options.timesheetStatus || projectFilterState.timesheetStatus?.length > 0) { queryParams.append("timesheetStatuses", JSON.stringify(options.timesheetStatus || projectFilterState.timesheetStatus)); }
    if (options.fteCostStatus || projectFilterState.fteCostStatus?.length > 0) { queryParams.append("fteCostStatuses", JSON.stringify(options.fteCostStatus || projectFilterState.fteCostStatus)); }
    if (options.subconCostStatus || projectFilterState.subconCostStatus?.length > 0) { queryParams.append("subconCostStatuses", JSON.stringify(options.subconCostStatus || projectFilterState.subconCostStatus)); }
    if (options.technicalInterviewStatus || projectFilterState.technicalInterviewStatus?.length > 0) { queryParams.append("technicalInterviewStatuses", JSON.stringify(options.technicalInterviewStatus || projectFilterState.technicalInterviewStatus)); }
    if (options.technicalSummaryStatus || projectFilterState.technicalSummaryStatus?.length > 0) { queryParams.append("technicalSummaryStatuses", JSON.stringify(options.technicalSummaryStatus || projectFilterState.technicalSummaryStatus)); }
    if (options.financialSummaryStatus || projectFilterState.financialSummaryStatus?.length > 0) { queryParams.append("financialSummaryStatuses", JSON.stringify(options.financialSummaryStatus || projectFilterState.financialSummaryStatus)); }
    if (options.claimsFormstatus || projectFilterState.claimsFormstatus?.length > 0) { queryParams.append("claimsFormStatuses", JSON.stringify(options.claimsFormstatus || projectFilterState.claimsFormstatus)); }
    if (options.finalReviewStatus || projectFilterState.finalReviewStatus?.length > 0) { queryParams.append("finalReviewStatuses", JSON.stringify(options.finalReviewStatus || projectFilterState.finalReviewStatus)); }
    if (options.lastUpdateBy || projectFilterState.lastUpdateBy?.length > 0) { queryParams.append("lastUpdatedBys", JSON.stringify(options.lastUpdateBy || projectFilterState.lastUpdateBy)); }

    //numeric value filter filed
    let rndPotential = [null, null];
    if (options.minRnDPotential != null && options.minRnDPotential !== 0) { rndPotential[0] = Number(options.minRnDPotential); }
    if (options.maxRnDPotential != null) { rndPotential[1] = Number(options.maxRnDPotential); }
    if (rndPotential[0] || rndPotential[1]) { queryParams.append("rndPotentials", JSON.stringify(rndPotential)); }

    let s_fte_cost = [null, null];
    if (options.minFteCost != null && options.minFteCost !== 0) { s_fte_cost[0] = (Number(options.minFteCost)); }
    if (options.maxFteCost != null) { s_fte_cost[1] = (Number(options.maxFteCost)); }
    if (s_fte_cost[0] || s_fte_cost[1]) { queryParams.append("fteCosts", JSON.stringify(s_fte_cost)); }

    let s_subcon_cost = [null, null];
    if (options.minSubconCost != null && options.minSubconCost !== 0) { s_subcon_cost[0] = Number(options.minSubconCost); }
    if (options.maxSubconCost != null) { s_subcon_cost[1] = Number(options.maxSubconCost); }
    if (s_subcon_cost[0] || s_subcon_cost[1]) { queryParams.append("subconCosts", JSON.stringify(s_subcon_cost)); }

    let s_total_project_cost = [null, null];
    if (options.minTotalProjectCost != null && options.minTotalProjectCost !== 0) { s_total_project_cost[0] = Number(options.minTotalProjectCost); }
    if (options.maxTotalProjectCost != null) { s_total_project_cost[1] = Number(options.maxTotalProjectCost); }
    if (s_total_project_cost[0] || s_total_project_cost[1]) { queryParams.append("totalProjectCosts", JSON.stringify(s_total_project_cost)); }

    let s_fte_qre_cost = [null, null];
    if (options.minQreFte != null && options.minQreFte !== 0) { s_fte_qre_cost[0] = Number(options.minQreFte); }
    if (options.maxQreFte != null) { s_fte_qre_cost[1] = Number(options.maxQreFte); }
    if (s_fte_qre_cost[0] || s_fte_qre_cost[1]) { queryParams.append("fteQreCosts", JSON.stringify(s_fte_qre_cost)); }

    let s_subcon_qre_cost = [null, null];
    if (options.minQreSubcon != null && options.minQreSubcon !== 0) { s_subcon_qre_cost[0] = Number(options.minQreSubcon); }
    if (options.maxQreSubcon != null) { s_subcon_qre_cost[1] = Number(options.maxQreSubcon); }
    if (s_subcon_qre_cost[0] || s_subcon_qre_cost[1]) { queryParams.append("subconQreCosts", JSON.stringify(s_subcon_qre_cost)); }

    let s_qre_cost = [null, null];
    if (options.minQreTotal != null && options.minQreTotal !== 0) { s_qre_cost[0] = Number(options.minQreTotal); }
    if (options.maxQreTotal != null) { s_qre_cost[1] = Number(options.maxQreTotal); }
    if (s_qre_cost[0] || s_qre_cost[1]) { queryParams.append("qreCosts", JSON.stringify(s_qre_cost)); }

    let s_fte_hours = [null, null];
    if (options.minFteHours != null && options.minFteHours !== 0) { s_fte_hours[0] = Number(options.minFteHours); }
    if (options.maxFteHours != null) { s_fte_hours[1] = Number(options.maxFteHours); }
    if (s_fte_hours[0] || s_fte_hours[1]) { queryParams.append("FTEhours", JSON.stringify(s_fte_hours)); }

    let s_subcon_hours = [null, null];
    if (options.minSubconHours != null && options.minSubconHours !== 0) { s_subcon_hours[0] = Number(options.minSubconHours); }
    if (options.maxSubconHours != null) { s_subcon_hours[1] = Number(options.maxSubconHours); }
    if (s_subcon_hours[0] || s_subcon_hours[1]) { queryParams.append("SubconHours", JSON.stringify(s_subcon_hours)); }

    let s_total_hours = [null, null];
    if (options.minTotalHours != null && options.minTotalHours !== 0) { s_total_hours[0] = Number(options.minTotalHours); }
    if (options.maxTotalHours != null) { s_total_hours[1] = Number(options.maxTotalHours); }
    if (s_total_hours[0] || s_total_hours[1]) { queryParams.append("TotalHours", JSON.stringify(s_total_hours)); }

    let s_rnd_adjustment = [null, null];
    if (options.minRndAdjustment != null && options.minRndAdjustment !== 0) { s_rnd_adjustment[0] = Number(options.minRndAdjustment); }
    if (options.maxRndAdjustment != null) { s_rnd_adjustment[1] = Number(options.maxRndAdjustment); }
    if (s_rnd_adjustment[0] || s_rnd_adjustment[1]) { queryParams.append("rndAdjustments", JSON.stringify(s_rnd_adjustment)); }

    let rndFinal = [null, null];
    if (options.minRndFinal != null && options.minRndFinal !== 0) { rndFinal[0] = Number(options.minRndFinal); }
    if (options.maxRndFinal != null) { rndFinal[1] = Number(options.maxRndFinal); }
    if (rndFinal[0] || rndFinal[1]) { queryParams.append("rndFinals", JSON.stringify(rndFinal)); }

    let s_rd_credits = [null, null];
    if (options.minRndCredits != null && options.minRndCredits !== 0) { s_rd_credits[0] = Number(options.minRndCredits); }
    if (options.maxRndCredits != null) { s_rd_credits[1] = Number(options.maxRndCredits); }
    if (s_rd_credits[0] || s_rd_credits[1]) { queryParams.append("rndCredits", JSON.stringify(s_rd_credits)); }

    //date filters

    const surveySentDates = [null, null];
    if (options.surveySentStartDate || projectFilterState.surveySentStartDate) { surveySentDates[0] = options.surveySentStartDate || projectFilterState.surveySentStartDate; }
    if (options.surveySentEndDate || projectFilterState.surveySentEndDate) { surveySentDates[1] = options.surveySentEndDate || projectFilterState.surveySentEndDate; }
    if (surveySentDates[0] || surveySentDates[1]) { queryParams.append("surveySentDates", JSON.stringify(surveySentDates)); }


    const reminderSentDates = [null, null];
    if (options.surveyReminderStartDate || projectFilterState.surveyReminderStartDate) { reminderSentDates[0] = (options.surveyReminderStartDate || projectFilterState.surveyReminderStartDate); }
    if (options.surveyReminderEndDate || projectFilterState.surveyReminderEndDate) { reminderSentDates[1] = options.surveyReminderEndDate || projectFilterState.surveyReminderEndDate; }
    if (reminderSentDates[0] || reminderSentDates[1]) { queryParams.append("reminderSentDates", JSON.stringify(reminderSentDates)); }

    const surveyResponseDates = [null, null];
    if (options.surveyResponseStartDate || projectFilterState.surveyResponseStartDate) { surveyResponseDates[0] = (options.surveyResponseStartDate || projectFilterState.surveyResponseStartDate); }
    if (options.surveyResponseEndDate || projectFilterState.surveyResponseEndDate) { surveyResponseDates[1] = options.surveyResponseEndDate || projectFilterState.surveyResponseEndDate; }
    if (surveyResponseDates[0] || surveyResponseDates[1]) { queryParams.append("surveyResponseDates", JSON.stringify(surveyResponseDates)); }

    const lastUpdatedDates = [null, null];
    if (options.lastUpdatedStartDate || projectFilterState.lastUpdatedStartDate) { lastUpdatedDates[0] = (options.lastUpdatedStartDate || projectFilterState.lastUpdatedStartDate); }
    if (options.lastUpdatedEndDate || projectFilterState.lastUpdatedEndDate) { lastUpdatedDates[1] = options.lastUpdatedEndDate || projectFilterState.lastUpdatedEndDate; }
    if (lastUpdatedDates[0] || lastUpdatedDates[1]) { queryParams.append("lastUpdatedTimestamps", JSON.stringify(lastUpdatedDates)); }

    //sort
    if (options?.sortField != null && options?.sortField) {
      queryParams.append("sortField", options.sortField)
    }
    if (options?.sortOrder != null && options?.sortOrder) {
      queryParams.append("sortOrder", options.sortOrder)
    }
    if (options?.timesheetId !== null && options?.timesheetId) {
      queryParams.append("timesheetId", (options.timesheetId));
    }
    if (options?.projectId !== null && options?.projectId) {
      queryParams.append("projectId", (options.projectId));
    }

    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/projects/${localStorage.getItem(
      "userid"
    )}/projects${queryString ? `?${queryString}` : ""}`;
    setIsProjectFilterApplied(queryString);

    try {
      if (window.location.pathname !== "/projects" && window.location.pathname !== '/timesheets/details') return;
      const response = await axios.get(url, Authorization_header());
      setProjects(response?.data?.data?.list);
      setProjectId(response?.data?.data?.list);
      setProjectsFilterFields(response?.data?.data?.appliedFilter || {});
      setProjectsSortFields(response?.data?.data?.appliedSort);
      setLoading(false);
      if (options?.timesheetId) {
        setTimesheetProject(response?.data?.data?.list);
      }
    } catch (error) {
      if (
        error?.response?.data?.logout === true ||
        error?.response?.data?.message === "session timed out"
      ) {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      console.error("Failed to fetch Projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdown = async (options = {}) => {
    setProjectFilterState(options);
    setLoading(true);
    const queryParams = new URLSearchParams();

    if (options.companyId && options.companyId?.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/projects/get-project-field-options${queryString ? `?${queryString}` : ""}`;
    setIsProjectFilterApplied(queryString);
    try {
      if (window.location.pathname !== "/projects" && window.location.pathname !== '/timesheets/details') return;
      const response = await axios.get(url, Authorization_header());
      setProjects(response?.data);
   
      if (options?.timesheetId) {
        setTimesheetProject(response?.data?.data?.list);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error?.response?.data?.logout === true ||
        error?.response?.data?.message === "session timed out"
      ) {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      console.error("Failed to fetch Projects:", error);
    }
  };

  const fetchCaseProjects = async (options = {}) => {
    setProjectFilterState(options);
    setLoading(true);
    const queryParams = new URLSearchParams();

    if (options.companyId && options.companyId?.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));

    if (options.spocName || projectFilterState.spocName?.length > 0) {
      queryParams.append(
        "spocNames",
        JSON.stringify(options.spocName || projectFilterState.spocName)
      );
    }

    if (options.spocEmail || projectFilterState.spocEmail?.length > 0) {
      queryParams.append(
        "spocEmails",
        JSON.stringify(options.spocEmail || projectFilterState.spocEmail)
      );
    }

    if (options.minTotalExpense != null && options.minTotalExpense > 0) {
      queryParams.append("minTotalExpense", options.minTotalExpense);
    }

    if (options.maxTotalExpense != null && options.maxTotalExpense) {
      queryParams.append("maxTotalExpense", options.maxTotalExpense);
    }

    if (options.minRnDExpense != null && options.minRnDExpense > 0) {
      queryParams.append("minRnDExpense", options.minRnDExpense);
    }

    if (options.maxRnDExpense != null && options.maxRnDExpense) {
      queryParams.append("maxRnDExpense", options.maxRnDExpense);
    }

    if (options.maxRnDPotential != null) {
      queryParams.append("maxRnDPotential", options.maxRnDPotential);
    }
    if (options?.sortField != null && options?.sortField) {
      queryParams.append("sortField", options.sortField)
    }
    if (options?.sortOrder != null && options?.sortOrder) {
      queryParams.append("sortOrder", options.sortOrder)
    }
    if (options?.timesheetId !== null && options?.timesheetId) {
      queryParams.append("timesheetId", JSON.stringify(options.timesheetId));
    }

    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams.sortOrder);
    }


    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/projects/${localStorage.getItem(
      "userid"
    )}/a0ds/get-projects${queryString ? `?${queryString}` : ""}`;
    setIsProjectFilterApplied(queryString);

    try {
      if (window.location.pathname !== "/projects" && window.location.pathname !== '/timesheets/details') return;
      const response = await axios.get(url, Authorization_header());
      setProjects(response?.data?.data?.list);
      setProjectsFilterFields(response?.data?.data?.appliedFilter);
      setProjectsSortFields(response?.data?.data?.appliedSort);
      if (options?.timesheetId) {
        setTimesheetProject(response?.data?.data?.list);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error?.response?.data?.logout === true ||
        error?.response?.data?.message === "session timed out"
      ) {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      console.error("Failed to fetch Projects:", error);
    }
  };

  const getCaseProjects = async () => {

    const queryParams = new URLSearchParams();

    if (projectsFilterOptions?.companyId || projectFilterState?.companyId?.length > 0)
      queryParams.append("companyIds", JSON.stringify(projectFilterState?.companyId || projectFilterState?.companyId));
    if (projectsFilterOptions.spocName || projectFilterState.spocName?.length > 0) {
      queryParams.append(
        "spocNames",
        JSON.stringify(projectsFilterOptions.spocName || projectFilterState.spocName)
      );
    }

    if (projectsFilterOptions.spocEmail || projectFilterState.spocEmail?.length > 0) {
      queryParams.append(
        "spocEmails",
        JSON.stringify(projectsFilterOptions.spocEmail || projectFilterState.spocEmail)
      );
    }
    if (projectsFilterOptions.accountingYear || projectFilterState?.accountingYear?.length > 0)
      queryParams.append(
        "fiscalYears",
        JSON.stringify(projectsFilterOptions.accountingYear || projectFilterState.accountingYear)
      );
    if (projectsFilterOptions.minTotalExpense != null && projectsFilterOptions.minTotalExpense > 0) {
      queryParams.append("minTotalExpense", projectsFilterOptions.minTotalExpense);
    }

    if (projectsFilterOptions.maxTotalExpense != null && projectsFilterOptions.maxTotalExpense < 2000000) {
      queryParams.append("maxTotalExpense", projectsFilterOptions.maxTotalExpense);
    }

    if (projectsFilterOptions.minRnDExpense != null && projectsFilterOptions.minRnDExpense > 0) {
      queryParams.append("minRnDExpense", projectsFilterOptions.minRnDExpense);
    }

    if (projectsFilterOptions.maxRnDExpense != null && projectsFilterOptions.maxRnDExpense < 2000000) {
      queryParams.append("maxRnDExpense", projectsFilterOptions.maxRnDExpense);
    }

    if (projectsFilterOptions.minRnDPotential != null && projectsFilterOptions.minRnDPotential > 0) {
      queryParams.append("minRnDPotential", projectsFilterOptions.minRnDPotential);
    }

    if (projectsFilterOptions.maxRnDPotential != null && projectsFilterOptions.maxRnDPotential < 100) {
      queryParams.append("maxRnDPotential", projectsFilterOptions.maxRnDPotential);
    }

    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }

    const queryString = queryParams.toString();

    const url = `${BaseURL}/api/v1/projects/${localStorage.getItem(
      "userid"
    )}/a0ds/get-projects?caseId=${detailedCase.caseId}${queryString ? `?${queryString}` : ""}`;
    setIsProjectFilterApplied(queryString);
    try {
      if (window.location.pathname !== "/projects" && window.location.pathname !== '/timesheets/details') return;
      const response = await axios.get(url, Authorization_header());
      setProjects(response?.data?.data?.list);
      setProjectsFilterFields(response?.data?.data?.appliedFilter);
      setProjectsSortFields(response?.data?.data?.appliedSort);
      if (projectsFilterOptions?.timesheetId) {
        setTimesheetProject(response?.data?.data?.list)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      console.error("Failed to fetch Projects:", error);
    }
  };
  const fetchTimesheetProjects = async (options = {}) => {
    setLoading(true);

    const queryParams = new URLSearchParams();

    // Add filters to the query
    if (options.companyId && options.companyId.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));

    if (options.projectNames && options.projectNames.length > 0)
      queryParams.append("projectNames", JSON.stringify(options.projectNames));

    if (options.projectCodes && options.projectCodes.length > 0)
      queryParams.append("projectCodes", JSON.stringify(options.projectCodes));

    if (options.spocName || projectFilterState.spocName?.length > 0)
      queryParams.append("spocNames", JSON.stringify(options.spocName || projectFilterState.spocName));

    if (options.spocEmail || projectFilterState.spocEmail?.length > 0)
      queryParams.append("spocEmails", JSON.stringify(options.spocEmail || projectFilterState.spocEmail));

    if (options.minTotalExpense != null && options.minTotalExpense > 0)
      queryParams.append("minTotalExpense", options.minTotalExpense);

    if (options.maxTotalExpense != null && options.maxTotalExpense)
      queryParams.append("maxTotalExpense", options.maxTotalExpense);

    if (options.minRnDExpense != null && options.minRnDExpense > 0)
      queryParams.append("minRnDExpense", options.minRnDExpense);

    if (options.maxRnDExpense != null && options.maxRnDExpense)
      queryParams.append("maxRnDExpense", options.maxRnDExpense);

    // Uncomment these lines if the QRE potential fields are used
    // if (options.minRnDPotential != null)
    //     queryParams.append("minRnDPotential", options.minRnDPotential);

    // if (options.maxRnDPotential != null)
    //     queryParams.append("maxRnDPotential", options.maxRnDPotential);

    // Add sorting parameters to the query, avoiding duplication
    if (options?.sortField != null && options?.sortField) {
      queryParams.set("sortField", options.sortField); // Use set to avoid duplicating the parameter
    }

    if (options?.sortOrder != null && options?.sortOrder) {
      queryParams.set("sortOrder", options.sortOrder); // Use set to avoid duplicating the parameter
    }

    // Construct the full URL with query parameters
    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/projects/${localStorage.getItem(
      "userid"
    )}/a0ds/get-projects?timesheetId=${options?.timesheetId}${queryString ? `&${queryString}` : ""}`;

    // Store the applied filter in the state
    setIsProjectFilterApplied(queryString);

    // Perform the request
    try {
      if (window.location.pathname !== "/projects" && window.location.pathname !== '/timesheets/details') return;
      const response = await axios.get(url, Authorization_header());

      // Update the state with response data
      setProjects(response?.data?.data?.list);
      setProjectsFilterFields(response?.data?.data?.appliedFilter);
      setProjectsSortFields(response?.data?.data?.appliedSort);

      // Update timesheet-specific projects if available
      if (options?.timesheetId) {
        setTimesheetProject(response?.data?.data?.list);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle session expiration and other errors
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      console.error("Failed to fetch Projects:", error);
    }
  };


  const getSummaryListing = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.summaryStatus && filters.summaryStatus?.length > 0)
        queryParams.append("summaryStatus", JSON.stringify(filters.summaryStatus));
      if (filters.createdOnStartDate && filters.createdOnStartDate?.length > 0)
        queryParams.append("createdOnStartDate", (filters.createdOnStartDate));
      if (filters.createdOnEndDate && filters.createdOnEndDate?.length > 0)
        queryParams.append("createdOnEndDate", (filters.createdOnEndDate));
      // if (filters.projectId && filters.projectId?.length > 0)
      //   queryParams.append("projectIdentifier", (filters.projectId));

      const queryString = queryParams.toString();
      const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/summary-list?projectIdentifier=${filters?.projectId}${queryString ? `&${queryString}` : ""}`, Authorization_header());
      setSummaryData(response?.data?.data || []);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };



  useEffect(() => {
    // getSummaryListing();
  }, [detailedCase?.projectId]);

  const getInteractionListing = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status?.length > 0)
        queryParams.append("status", JSON.stringify(filters.status));
      if (filters.sentTo && filters.sentTo?.length > 0)
        queryParams.append("sentTo", (filters.sentTo));
      if (filters.sentStartDate && filters.sentStartDate?.length > 0)
        queryParams.append("sentStartDate", (filters.sentStartDate));
      if (filters.sentEndDate && filters.sentEndDate?.length > 0)
        queryParams.append("sentEndDate", (filters.sentEndDate));
      if (filters.responseReceivedStartDate && filters.responseReceivedStartDate?.length > 0)
        queryParams.append("responseReceivedStartDate", (filters.responseReceivedStartDate));
      if (filters.responseReceivedEndDate && filters.responseReceivedEndDate?.length > 0)
        queryParams.append("responseReceivedEndDate", (filters.responseReceivedEndDate));
      const queryString = queryParams.toString();
      const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/interaction-list?projectIdentifier=${filters?.projectId}${queryString ? `&${queryString}` : ""}`, Authorization_header());
      setProjectInteractionData(response?.data?.data || []);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        projectId,
        getProjects,
        projectSummaryData,
        getSummaryListing,
        projectInteractionData,
        getInteractionListing,
        timesheetProject,
        getCaseProjects,
        fetchProjects,
        fetchDropdown,
        fetchTimesheetProjects,
        fetchCaseProjects,
        getAccessToken,
        ProjectSort,
        // getProjectSortParams,
        projectFilterState,
        setProjectFilterState,
        triggerProjectClearFilters,
        clearProjectFilterTrigger,
        isProjectFilterApplied,
        setIsProjectFilterApplied,
        setCurrentState,
        currentState,
        loading,
        getProjectsSortParams,
        projectsFilterFields,
        projectsSortFields,
        setSortPrams,
        sortParams,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
