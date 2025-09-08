import React, { useEffect, useState } from 'react';
import { BaseURL } from "../constants/Baseurl";
import axios from 'axios';
import FormatDatetime from '../utils/helper/FormatDatetime';
import { Authorization_header } from '../utils/helper/Constant';
import { useAuthContext } from './AuthProvider';
import toast from 'react-hot-toast';
import usePinnedData from '../components/CustomHooks/usePinnedData';

let sessionExpiredToastShown = false;

export const CaseContext = React.createContext();

export const CaseContextProvider = ({ children }) => {
  const [caseData, setCaseData] = useState([]);
  const [cases, setCase] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [detailedCase, setDetailedCase] = useState(null);
  const [reqCaseId, setReqCaseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [clearCaseFilterTrigger, setClearCaseFilterTrigger] = useState(false);
  const [isCaseFilterApplied, setIsCaseFilterApplied] = useState(false);
  const { logout } = useAuthContext();
  const { pinnedObject } = usePinnedData();
  const [sortParams, setSortPrams] = useState({ sortField: null, sortOrder: null });
  const [projectSortParams, setProjectSortParams] = useState({ sortField: null, sortOrder: null });
  const [filterCaseSurveysList, setCaseSurveysList] = useState([]);
  const [unsentSurveyList, setUnsentSurveyList] = useState([]);
  const [caseFilterOptions, setCaseFilterOptions] = useState({});
  const [caseFilterFields, setCaseFilterFields] = useState("");
  const [caseSortFields, setCaseSortFields] = useState("");
  const [caseProjects, setCaseProjects] = useState([]);
  const [caseSummaryData, setSummaryData] = useState([]);
  const [interactionFilterData, setInteractionData] = useState([]);
  const [loader, setLoader] = useState(false);
  // const [caseFilterOptions]
  const [currentState, setCurrentState] = useState(
    pinnedObject?.CASES === 'RV' ? 'Recently Viewed' : 'All Cases'
  );
  const [caseFilterState, setCaseFilterState] = useState({
    projectNames: [],
    projectId: [],
    companyId: [],
    company: [],
    sortField: '',
    sortOrder: '',
    countryName: [],
    caseOwners: [],
  });


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

  const getCaseSortParams = ({ sortField, sortOrder }) => {
    setSortPrams({
      sortField,
      sortOrder
    })
  }

  const getSortParams = ({ sortField, sortOrder }) => {
    setProjectSortParams({ sortField: sortField, sortOrder: sortOrder });
  }

  const triggerCaseClearFilters = () => {
    setCaseFilterState({
      project: [],
      projectId: [],
      companyId: [],
      company: [],
      sortField: '',
      sortOrder: '',
      countryName: [],
      caseOwners: [],
    });
    setClearCaseFilterTrigger((prev) => !prev);
  };

  useEffect(() => {
    if (clearCaseFilterTrigger) {
      getAllCases();
    }
  }, [clearCaseFilterTrigger]);

  useEffect(() => {
    if (clearCaseFilterTrigger) {
      fetchFilterProjectsList();
    }
  }, [clearCaseFilterTrigger]);

  useEffect(() => {
    fetchAllCases();
  }, [sortParams])

  const getCaseById = async (id) => {
    try {
      const response1 = await axios.get(`${BaseURL}/api/v1/case/${localStorage.getItem(
        "userid"
      )}/${id}/casedetails`, Authorization_header());
      const singleCase = response1?.data?.data?.casedetails;
      setDetailedCase(singleCase);
    } catch (error) {
      if (error?.response?.data?.logout === true) {
        logout();
      }
      console.error("Error fetching case by ID:", error);
    }
  };

  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }
  const caseSort = async ({ sortField, sortOrder }) => {
    const url = `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/cases`;
    try {
      toast.loading("Fetching case data");
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
      const caseList = response?.data?.data?.caseDetails?.list?.map((elemnt) => ({
        caseCode: elemnt.caseCode,
        caseId: elemnt.caseId,
        status: elemnt.status,
        caseType: elemnt.caseType,
        companyId: elemnt.companyId,
        companyName: elemnt.companyName,
        countryName: elemnt.countryName,
        contactId: elemnt.primaryContactId,
        contactName: elemnt.primaryContactName,
        caseRoleName: elemnt.caseRoleName,
        caseOwnerName: elemnt?.caseOwnerName,
        email: elemnt.primaryContactEmail,
        caseTypeDescription: elemnt.caseTypeDescription,
        createdOn: FormatDatetime(elemnt?.createdOn).split("T")[0].split(' ')[0],
      }))
      setCaseData(caseList);
      setCaseFilterFields(response?.data?.data?.caseDetails?.appliedFilter);
      setCaseSortFields(response?.data?.data?.caseDetails?.appliedSort);
      toast.dismiss();

      toast.success(response?.data?.message || "Succesfully fetched data");
    } catch (error) {
      toast.dismiss();
      toast.error("Error in fetching Case data");
      console.error("Error in fetching Case data : ", error);
    }
  }

  const fetchAllCases = async () => {
    // Ensure API call is made only when URL endpoint is "/cases"
    if (window.location.pathname !== "/cases") return;
  
    const queryParams = new URLSearchParams();
    try {
      if (Array.isArray(caseFilterOptions?.companyId) && caseFilterOptions.companyId?.length > 0) {
        queryParams.append("companyIds", JSON.stringify(caseFilterOptions.companyId));
      }
      if (caseFilterOptions?.countryName && caseFilterOptions.countryName?.length > 0)
        queryParams.append("countryName", JSON.stringify(caseFilterOptions.countryName));
  
      if (caseFilterOptions?.caseOwners && caseFilterOptions.caseOwners?.length > 0)
        queryParams.append("caseOwners", JSON.stringify(caseFilterOptions.caseOwners));
  
      if (sortParams?.sortField && sortParams?.sortOrder) {
        queryParams.append("sortField", sortParams?.sortField);
      }
      if (sortParams?.sortOrder) {
        queryParams.append("sortOrder", sortParams?.sortOrder);
      }
      const url = `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/cases${queryParams ? `?${queryParams}` : ""}`;
      const response = await axios.get(url, Authorization_header());
      const caseList = response?.data?.data?.caseDetails?.list?.map((elemnt) => ({
        caseCode: elemnt.caseCode,
        caseId: elemnt.caseId,
        status: elemnt.status,
        caseType: elemnt.caseType,
        companyId: elemnt.companyId,
        companyName: elemnt.companyName,
        countryName: elemnt.countryName,
        contactId: elemnt.primaryContactId,
        contactName: elemnt.primaryContactName,
        caseRoleName: elemnt.caseRoleName,
        caseOwnerName: elemnt?.caseOwnerName,
        email: elemnt.primaryContactEmail,
        caseTypeDescription: elemnt.caseTypeDescription,
        createdOn: FormatDatetime(elemnt?.createdOn).split("T")[0].split(' ')[0],
      }));
      setCaseData(caseList);
      setCaseFilterFields(response?.data?.data?.caseDetails?.appliedFilter);
      setCaseSortFields(response?.data?.data?.caseDetails?.appliedSort);
      setLoading(false);
      return caseList;
    } catch (error) {
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setLoading(false);
      console.error("Error in fetching cases: ", error);
    }
  };

  const getAllCases = async (options = {}) => {
    setCaseFilterOptions(options);
    try {
      if (window.location.pathname !== "/cases") return;
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (options.companyId && options.companyId?.length > 0)
        queryParams.append("companyIds", JSON.stringify(options.companyId));

      if (options.countryName && options.countryName?.length > 0)
        queryParams.append("countryName", JSON.stringify(options.countryName));

      if (options.caseOwners && options.caseOwners?.length > 0)
        queryParams.append("caseOwners", JSON.stringify(options.caseOwners));

      if (options?.sortField) {
        queryParams.append("sortField", options.sortField);
      }

      if (options?.sortOrder) {
        queryParams.append("sortOrder", options.sortOrder);
      }

      if (sortParams?.sortField && sortParams?.sortOrder) {
        queryParams.append("sortField", sortParams?.sortField);
      }

      if (sortParams?.sortOrder && sortParams?.sortOrder) {
        queryParams.append("sortOrder", sortParams?.sortOrder);
      }
      const url = `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/cases${queryParams ? `?${queryParams}` : ""}`;

      const response = await axios.get(url, Authorization_header());
      const caseList = response?.data?.data?.caseDetails?.list?.map((elemnt) => ({
        caseCode: elemnt.caseCode,
        caseId: elemnt.caseId,
        status: elemnt.status,
        caseType: elemnt.caseType,
        companyId: elemnt.companyId,
        companyName: elemnt.companyName,
        countryName: elemnt.countryName,
        contactId: elemnt.primaryContactId,
        contactName: elemnt.primaryContactName,
        caseRoleName: elemnt.caseRoleName,
        caseOwnerName: elemnt?.caseOwnerName,
        email: elemnt.primaryContactEmail,
        caseTypeDescription: elemnt.caseTypeDescription,
        createdOn: FormatDatetime(elemnt?.createdOn).split("T")[0].split(' ')[0],
      }));
      setCaseData(caseList);
      setCaseFilterFields(response?.data?.data?.caseDetails?.appliedFilter);
      setCaseSortFields(response?.data?.data?.caseDetails?.appliedSort);
      setLoading(false);
      return caseList;
    } catch (error) {
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setLoading(false);
      // toast.error("Error fetching cases");
      console.error("Error in fetching cases: ", error);
    }
  };

  const getCaseOnLanding = async (options = {}) => {
    const queryParams = new URLSearchParams(window.location.search);
    if (options.client || caseFilterState?.companyId?.length > 0) {
      queryParams.append("companyIds", JSON.stringify(options.client || caseFilterState.companyId));
    }
    if (options.countryName) {
      queryParams.append("countryName", options.countryName);
    } options.sortField && queryParams.append("sortField", options.sortField);
    options.sortOrder && queryParams.append("sortOrder", options.sortOrder);

    const value = queryParams.get('caseId');
    setReqCaseId(value);

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/case/${localStorage.getItem(
      "userid"
    )}/cases${queryString ? `?${queryString}` : ""}`;

    setIsCaseFilterApplied(Boolean(queryString));

    try {
      if (window.location.pathname !== "/cases") return;
      const response = await axios.get(url, Authorization_header());
      setCase(response?.data?.data?.list);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setLoading(false);
      console.error(error);
    }
  }

  const handleSelectedCase = (c) => {
    setSelectedCase(c);
  }
  useEffect(() => {
  }, [caseProjects]);

  const fetchFilterProjectsList = async (options = {}) => {
    setCaseFilterState(options);
    // const payload = { headers: Authorization_header().headers };
    const queryParams = new URLSearchParams();

    try {
      if (options.caseId && options.caseId.length > 0) {
        queryParams.append("caseId", (options.caseId));
      }
      // dropdown filter values
      if (options.companyId && options.companyId?.length > 0)
        queryParams.append("companyIds", JSON.stringify(options.companyId));
      if (options.spocName) { queryParams.append("spocNames", JSON.stringify(options.spocName)); }
      if (options.fiscalYear) { queryParams.append("fiscalYears", JSON.stringify(options.fiscalYear)); }
      if (options.spocEmail) { queryParams.append("spocEmails", JSON.stringify(options.spocEmail)); }
      if (options.dataGathering) { queryParams.append("dataGatherings", JSON.stringify(options.dataGathering)); }
      if (options.projectStatus) { queryParams.append("projectStatuses", JSON.stringify(options.projectStatus)); }
      if (options.surveyStatus) { queryParams.append("surveyStatuses", JSON.stringify(options.surveyStatus)); }
      if (options.interactionStatus) { queryParams.append("interactionStatuses", JSON.stringify(options.interactionStatus)); }
      if (options.timesheetStatus) { queryParams.append("timesheetStatuses", JSON.stringify(options.timesheetStatus)); }
      if (options.fteCostStatus) { queryParams.append("fteCostStatuses", JSON.stringify(options.fteCostStatus)); }
      if (options.subconCostStatus) { queryParams.append("subconCostStatuses", JSON.stringify(options.subconCostStatus)); }
      if (options.technicalInterviewStatus) { queryParams.append("technicalInterviewStatuses", JSON.stringify(options.technicalInterviewStatus)); }
      if (options.technicalSummaryStatus) { queryParams.append("technicalSummaryStatuses", JSON.stringify(options.technicalSummaryStatus)); }
      if (options.financialSummaryStatus) { queryParams.append("financialSummaryStatuses", JSON.stringify(options.financialSummaryStatus)); }
      if (options.claimsFormstatus) { queryParams.append("claimsFormStatuses", JSON.stringify(options.claimsFormstatus)); }
      if (options.finalReviewStatus) { queryParams.append("finalReviewStatuses", JSON.stringify(options.finalReviewStatus)); }
      if (options.lastUpdateBy) { queryParams.append("lastUpdatedBys", JSON.stringify(options.lastUpdateBy)); }

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
      if (options.surveySentStartDate) { surveySentDates[0] = options.surveySentStartDate; }
      if (options.surveySentEndDate) { surveySentDates[1] = options.surveySentEndDate; }
      if (surveySentDates[0] || surveySentDates[1]) { queryParams.append("surveySentDates", JSON.stringify(surveySentDates)); }


      const reminderSentDates = [null, null];
      if (options.surveyReminderStartDate) { reminderSentDates[0] = (options.surveyReminderStartDate); }
      if (options.surveyReminderEndDate) { reminderSentDates[1] = options.surveyReminderEndDate; }
      if (reminderSentDates[0] || reminderSentDates[1]) { queryParams.append("reminderSentDates", JSON.stringify(reminderSentDates)); }

      const surveyResponseDates = [null, null];
      if (options.surveyResponseStartDate) { surveyResponseDates[0] = (options.surveyResponseStartDate); }
      if (options.surveyResponseEndDate) { surveyResponseDates[1] = options.surveyResponseEndDate; }
      if (surveyResponseDates[0] || surveyResponseDates[1]) { queryParams.append("surveyResponseDates", JSON.stringify(surveyResponseDates)); }

      const lastUpdatedDates = [null, null];
      if (options.lastUpdatedStartDate) { lastUpdatedDates[0] = (options.lastUpdatedStartDate); }
      if (options.lastUpdatedEndDate) { lastUpdatedDates[1] = options.lastUpdatedEndDate; }
      if (lastUpdatedDates[0] || lastUpdatedDates[1]) { queryParams.append("lastUpdatedTimestamps", JSON.stringify(lastUpdatedDates)); }

      if (options?.timesheetId !== null && options?.timesheetId) {
        queryParams.append("timesheetId", (options.timesheetId));
      }
      if (options?.projectId !== null && options?.projectId) {
        queryParams.append("projectId", (options.projectId));
      }

      if (options?.sortField != null && options?.sortField) {
        queryParams.append("sortField", options.sortField)
      }
      if (options?.sortOrder != null && options?.sortOrder) {
        queryParams.append("sortOrder", options.sortOrder)
      }

      // Apply sorting (from projectSortParams)
      if (projectSortParams?.sortField) {
        queryParams.append("sortField", projectSortParams.sortField);
      }

      if (projectSortParams?.sortOrder) {
        queryParams.append("sortOrder", projectSortParams.sortOrder);
      }

      const queryString = queryParams.toString();
      const url = `${BaseURL}/api/v1/projects/damy/projects${queryString ? `?${queryString}` : ""}`;

      // Fetch projects
      const response = await axios.get(url, Authorization_header());
      setCaseProjects(response?.data?.data?.list || []);
      setCaseFilterFields(response?.data?.data?.appliedFilter);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // fetchFilterProjectsList();
  }, [detailedCase?.caseId, projectSortParams]);


  const fetchSurveyList = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.surveyProjectNames && filters.surveyProjectNames?.length > 0)
        queryParams.append("caseProjectNames", JSON.stringify(filters.surveyProjectNames));
      if (filters.caseId && filters.caseId?.length > 0) {
        queryParams.append("caseId", JSON.stringify(filters.caseId));
      } if (filters.status && filters.status?.length > 0)
        queryParams.append("status", JSON.stringify(filters.status));
      if (filters.sentBy && filters.sentBy?.length > 0)
        queryParams.append("sentBy", JSON.stringify(filters.sentBy));
      if (filters.sentTo && filters.sentTo?.length > 0)
        queryParams.append("sentTo", JSON.stringify(filters.sentTo));
      if (filters.sentStartDate && filters.sentStartDate?.length > 0)
        queryParams.append("sentStartDate", (filters.sentStartDate));
      if (filters.sentEndDate && filters.sentEndDate?.length > 0)
        queryParams.append("sentEndDate", (filters.sentEndDate));
      if (filters.responseReceivedStartDate && filters.responseReceivedStartDate?.length > 0)
        queryParams.append("responseReceivedStartDate", JSON.stringify(filters.responseReceivedStartDate));
      if (filters.responseReceivedStartDate && filters.responseReceivedStartDate?.length > 0)
        queryParams.append("responseReceivedStartDate", JSON.stringify(filters.responseReceivedStartDate));
      const queryString = queryParams.toString();
      const response = await axios.get(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId}/surveylist${queryString ? `?${queryString}` : ""}`, Authorization_header()
      );
      setCaseSurveysList(response?.data?.data.data);
      setUnsentSurveyList(response?.data?.data?.unSentSurveys || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setCaseSurveysList([]);
    }
  }

  useEffect(() => {
    // fetchSurveyList();
  }, [detailedCase?.caseId]);

  const getSummaryListing = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.summaryProjectNames && filters.summaryProjectNames?.length > 0)
        queryParams.append("caseProjectNames", JSON.stringify(filters.summaryProjectNames));
      if (filters.projectCodes && filters.projectCodes?.length > 0)
        queryParams.append("caseProjectCodes", JSON.stringify(filters.projectCodes));
      if (detailedCase?.caseId && detailedCase?.caseId?.length > 0) {
        queryParams.append("caseId", detailedCase?.caseId);
      } if (filters.caseProjectCodes && filters.caseProjectCodes?.length > 0)
        queryParams.append("caseProjectCodes", JSON.stringify(filters.caseProjectCodes));
      if (filters.createdOnStartDate && filters.createdOnStartDate?.length > 0)
        queryParams.append("createdOnStartDate", (filters.createdOnStartDate));
      if (filters.createdOnEndDate && filters.createdOnEndDate?.length > 0)
        queryParams.append("createdOnEndDate", (filters.createdOnEndDate));
      const queryString = queryParams.toString();
      const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/summary-list?${queryString ? `${queryString}` : ""}`, Authorization_header());
      setSummaryData(response?.data?.data || []);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  useEffect(() => {
    // getSummaryListing();
  }, [detailedCase?.caseId]);


  const getAllInteractions = async (filters = {}) => {
    // let url_suffix;
    // if (usedfor == 'case') {
    //   url_suffix = `caseId=${detailedCase?.caseId}`;
    // } else if (usedfor == 'project') {
    //   url_suffix = `projectIdentifier=${detailedCase?.projectId}`;
    // }
    // setLoader(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.interactionProjectNames && filters.interactionProjectNames?.length > 0)
        queryParams.append("caseProjectNames", JSON.stringify(filters.interactionProjectNames));
      if (detailedCase?.caseId && detailedCase?.caseId?.length > 0) {
        queryParams.append("caseId", detailedCase?.caseId);
      }
      if (filters.interactionStatus && filters.interactionStatus?.length > 0)
        queryParams.append("interactionStatus", JSON.stringify(filters.interactionStatus));
      if (filters.sentTo && filters.sentTo?.length > 0)
        queryParams.append("sentToEmails", JSON.stringify(filters.sentTo));
      if (filters.sentStartDate && filters.sentStartDate?.length > 0)
        queryParams.append("sentStartDate", (filters.sentStartDate));
      if (filters.sentEndDate && filters.sentEndDate?.length > 0)
        queryParams.append("sentEndDate", (filters.sentEndDate));
      if (filters.responseReceivedStartDate && filters.responseReceivedStartDate?.length > 0)
        queryParams.append("responseReceivedStartDate", (filters.responseReceivedStartDate));
      if (filters.responseReceivedEndDate && filters.responseReceivedEndDate?.length > 0)
        queryParams.append("responseReceivedEndDate", (filters.responseReceivedEndDate));
      const queryString = queryParams.toString();
      const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/interaction-list?${queryString ? `${queryString}` : ""}`, Authorization_header());
      setInteractionData(response?.data?.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  useEffect(() => {
    // getAllInteractions();
  }, [detailedCase?.caseId]);


  return (
    <CaseContext.Provider
      value={{
        getAllCases,
        caseFilterState,
        fetchFilterProjectsList,
        filterCaseSurveysList,
        fetchSurveyList,
        setCaseFilterState,
        getSummaryListing,
        getAllInteractions,
        interactionFilterData,
        caseSummaryData,
        isCaseFilterApplied,
        caseData,
        selectedCase,
        caseProjects,
        handleSelectedCase,
        getCaseById,
        detailedCase,
        currency,
        loading,
        getCaseOnLanding,
        setIsCaseFilterApplied,
        triggerCaseClearFilters,
        clearCaseFilterTrigger,
        caseSort,
        getCaseSortParams,
        caseFilterFields,
        caseSortFields,
        getSortParams
      }}
    >{children}
    </CaseContext.Provider>)
}