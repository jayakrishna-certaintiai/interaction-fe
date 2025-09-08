import { Box, Accordion, AccordionDetails, Typography, Drawer, FormControlLabel, Checkbox, Collapse, TextField, InputBase, InputAdornment, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { ProjectContext } from "../../context/ProjectContext";
import AccYearSelector from "../FilterComponents/AccYearSelector";
import CompanySelector from "../FilterComponents/CompanySelector";
import ActionButton from "../FilterComponents/ActionButton";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";
import SpocNameFilters from "../FilterComponents/SpocNameFilters";
import SpocEmailFilters from "../FilterComponents/SpocEmailFilters";
import DataGatheringSelect from "../FilterComponents/DataGatheringSelect";
import AllStatusSelect from "../FilterComponents/AllStatusSelect";
const styles = {
  drawerPaper: {
    "& .MuiDrawer-paper": {
      height: "67.5%",
      display: "flex",
      flexDirection: "column",
      marginTop: "12rem",
      marginLeft: "20px",
      // borderBottom: "1px solid #E4E4E4",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      borderLeft: "1px solid #E4E4E4",
      overflow: "hidden",
    },
  },
  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "-0%",
    flex: 1,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #E4E4E4",
    borderTop: "1px solid #E4E4E4",
    px: 2,
    height: "45px",
    justifyContent: "space-between",
    backgroundColor: "#ececec",
  },
  title: {
    fontWeight: "500",
    textTransform: "capitalize",
    marginRight: '-2px',
    color: 'black',
    fontSize: '16px',
    position: "sticky",
    backgroundColor: "#ececec",
    top: 0,
    zIndex: 1,
  },
  closeButton: {
    color: "#9F9F9F",
    "&:hover": { color: "#FD5707" },
    marginRight: "-15px"
  },
  accordion: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'transparent',
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    '&:hover': { backgroundColor: '#03A69B1A' },
    padding: '10px',
    marginTop: "-20px"
  },
  accordionDetails: {
    overflowY: 'auto',
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px",
    borderTop: "1px solid #E4E4E4",
    marginTop: "5px",
    gap: 1,
  },
  textField: {
    fontSize: '0.82rem',
    padding: '2px 0px',
    height: '32px',
    width: "100px",
    borderRadius: "20px",
  },
  applyButton: {
    color: "#00A398",
  },
  clearButton: {
    color: "#9F9F9F",
    mt: -1
  },
  searchBox: {
    mt: 1,
    alignItems: "center",
    display: "flex",
    p: 1,
    pl: 2,
    width: "115%"
  },
  inputBase: {
    borderRadius: "20px",
    width: "80%",
    height: "35px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
  searchIcon: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "90%",
    height: "37px",
    border: "1px solid #9F9F9F",
    mt: 2,
    ml: 1.5,
  },
};
function ProjectsFilters({ open, handleClose, onApplyFilters, countActiveFilters }) {
  const { projectFilterState, setProjectFilterState, clearProjectFilterTrigger, setIsProjectFilterApplied, triggerProjectClearFilters, fetchProjects } = useContext(ProjectContext);
  const [company, setCompany] = useState(projectFilterState.company);
  const [showCompany, setShowCompany] = useState(false);
  const [spocName, setSpocName] = useState(projectFilterState.spocName);
  const [spocNameList, setSpocNameList] = useState([]);
  const [showSpocName, setShowSpocName] = useState(false);
  const [spocEmail, setSpocEmail] = useState(projectFilterState.spocEmail);
  const [spocEmailList, setSpocEmailList] = useState([]);
  const [showSpocEmail, setShowSpocEmail] = useState(false);
  const [timesheetStatus, setTimesheetStatus] = useState(projectFilterState.s_timesheet_status);
  const [timesheetStatusList, setTimesheetStatusList] = useState([]);
  const [showTimesheetStatus, setShowTimesheetStatus] = useState(false);
  const [fteCostStatus, setFteCostStatus] = useState(projectFilterState.s_fte_cost_status);
  const [fteCostStatusList, setFteCostStatusList] = useState([]);
  const [showFteCostStatus, setShowFteCostStatus] = useState(false);
  const [subconCostStatus, setSubconCostStatus] = useState(projectFilterState.s_subcon_cost_status);
  const [subconCostStatusList, setSubconCostStatusList] = useState([]);
  const [showSubconCostStatus, setShowSubconCostStatus] = useState(false);
  const [technicalInterviewStatus, setTechnicalInterviewStatus] = useState(projectFilterState.s_technical_interview_status);
  const [technicalInterviewStatusList, setTechnicalInterviewStatusList] = useState([]);
  const [showTechnicalInterviewStatus, setShowTechnicalInterviewStatus] = useState(false);
  const [technicalSummaryStatus, setTechnicalSummaryStatus] = useState(projectFilterState.s_technical_summary_status);
  const [technicalSummaryStatusList, setTechnicalSummaryStatusList] = useState([]);
  const [showTechnicalSummaryStatus, setShowTechnicalSummaryStatus] = useState(false);
  const [financialSummaryStatus, setFinancialSummaryStatus] = useState(projectFilterState.s_financial_summary_status);
  const [financialSummaryStatusList, setFinancialSummaryStatusList] = useState([]);
  const [showFinancialSummaryStatus, setShowFinancialSummaryStatus] = useState(false);
  const [claimsFormstatus, setClaimsFormstatus] = useState(projectFilterState.s_claims_form_status);
  const [claimsFormstatusList, setClaimsFormstatusList] = useState([]);
  const [showClaimsFormstatus, setShowClaimsFormstatus] = useState(false);
  const [finalReviewStatus, setFinalReviewStatus] = useState(projectFilterState.s_final_review_status);
  const [finalReviewStatusList, setFinalReviewStatusList] = useState([]);
  const [showFinalReviewStatus, setShowFinalReviewStatus] = useState(false);
  const [lastUpdateBy, setLastUpdateBy] = useState(projectFilterState.s_last_updated_by);
  const [lastUpdateByList, setLastUpdateByList] = useState([]);
  const [showLastUpdateBy, setShowLastUpdateBy] = useState(false);
  const [dataGathering, setDataGathering] = useState(projectFilterState.s_subcon_cost_status);
  const [dataGatheringList, setDataGatheringList] = useState([]);
  const [showDataGathering, setShowDataGathering] = useState(false);
  const [projectStatus, setProjectStatus] = useState(projectFilterState.s_project_status);
  const [projectStatusList, setProjectStatusList] = useState([]);
  const [showProjectStatus, setShowProjectStatus] = useState(false);
  const [surveyStatus, setSurveyStatus] = useState(projectFilterState.surveyStatus);
  const [surveyStatusList, setSurveyStatusList] = useState([]);
  const [showSurveyStatus, setShowSurveyStatus] = useState(false);
  const [interactionStatus, setInteractionStatus] = useState(projectFilterState.s_interaction_status);
  const [interactionStatusList, setInteractionStatusList] = useState([]);
  const [showInteractionStatus, setShowInteractionStatus] = useState(false);
  const [fiscalYear, setAccYear] = useState(projectFilterState.fiscalYear);
  const [accountingYearList, setAccountingYearList] = useState([]);
  const [showAccountingYear, setShowAccountingYear] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [rndPotentialCountError, setRndPotentialCountError] = useState('');
  const [projectsCountError2, setProjectsCountError2] = useState('');
  const [projectsCountError3, setProjectsCountError3] = useState('');
  const [projectsCountError4, setProjectsCountError4] = useState('');
  const [qreFteCountError, setQreFteCountError] = useState('');
  const [qreSubconCountError, setQreSubconCountError] = useState('');
  const [qreTotalCountError, setQreTotalCountError] = useState('');
  const [fteHoursCountError, setFteHoursCountError] = useState('');
  const [subconHoursCountError, setSubconHoursCountError] = useState('');
  const [totalHoursCountError, setTotalHoursCountError] = useState('');
  const [rndAdjustmentCountError, setRndAdjustmentCountError] = useState('');
  const [rndFinalCountError, setRndFinalCountError] = useState('');
  const [rndCreditsCountError, setrndCreditsCountError] = useState('');
  const [positiveNumberError, setPositiveNumberError] = useState('');
  const [positiveNumberError2, setPositiveNumberError2] = useState('');
  const [positiveNumberError3, setPositiveNumberError3] = useState('');
  const [positiveNumberError4, setPositiveNumberError4] = useState('');
  const [qreFteNumberError, setQreFteNumberError] = useState('');
  const [qreSubconNumberError, setQreSubconNumberError] = useState('');
  const [qreTotalNumberError, setQreTotalNumberError] = useState('');
  const [fteHoursNumberError, setFteHoursNumberError] = useState('');
  const [subconHoursNumberError, setSubconHoursNumberError] = useState('');
  const [totalHoursNumberError, setTotalHoursNumberError] = useState('');
  const [rndAdjustmentNumberError, setRndAdjustmentNumberError] = useState('');
  const [rndFinalNumberError, setRndFinalNumberError] = useState('');
  const [rndCreditsNumberError, setRndCreditsNumberError] = useState('');
  const { clientList } = useContext(FilterListContext);
  const [showRnDPotential, setShowRnDPotential] = useState(false);
  const [showFteCost, setShowFteCost] = useState(false);
  const [showSubconCost, setShowSubconCost] = useState(false);
  const [showTotalProjectCost, setShowTotalProjectCost] = useState(false);
  const [showQreFte, setShowQreFte] = useState(false);
  const [showQreSubcon, setShowQreSubcon] = useState(false);
  const [showQreTotal, setShowQreTotal] = useState(false);
  const [showFteHours, setShowFteHours] = useState(false);
  const [showSubconHours, setShowSubconHours] = useState(false);
  const [showTotalHours, setShowTotalHours] = useState(false);
  const [showRndAdjustment, setShowRndAdjustment] = useState(false);
  const [showRndFinal, setShowRndFinal] = useState(false);
  const [showRndCredits, setShowRndCredits] = useState(false);
  const [showSurveySentDate, setShowSurveySentDate] = useState(false);
  const [showSurveyReminderDate, setShowSurveyReminderDate] = useState(false);
  const [showSurveyResponseDate, setShowSurveyResponseDate] = useState(false);
  const [showLastUpdatedDate, setShowLastUpdatedDate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [surveySentStartDate, setSurveySentStartDate] = useState("");
  const [surveySentEndDate, setSurveySentEndDate] = useState("");
  const [surveyReminderStartDate, setSurveyReminderStartDate] = useState("");
  const [surveyReminderEndDate, setSurveyReminderEndDate] = useState("");
  const [surveyResponseStartDate, setSurveyResponseStartDate] = useState("");
  const [surveyResponseEndDate, setSurveyResponseEndDate] = useState("");
  const [lastUpdatedStartDate, setLastUpdatedStartDate] = useState("");
  const [lastUpdatedEndDate, setLastUpdatedEndDate] = useState("");
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const filterFields = [
    { label: 'Account' },
    { label: 'Fiscal year' },
    { label: 'SPOC Name' },
    { label: 'SPOC Email' },
    { label: 'Data Gathering' },
    { label: 'Project Status' },
    { label: 'Survey Status' },
    { label: 'Interaction Status' },
    { label: 'Timesheet Status' },
    { label: 'Cost Status - Employee' },
    { label: 'Cost Status - Subcon' },
    { label: 'Technical Interview Status' },
    { label: 'Technical Summary Status' },
    { label: 'Financial Summary Status' },
    { label: 'Claims Form Status' },
    { label: 'Final Review Status' },
    { label: 'Last Updated By' },
    { label: 'FTE Cost' },
    { label: 'Subcon Cost' },
    { label: 'Total Project Cost' },
    { label: 'QRE FTE' },
    { label: 'QRE Subcon' },
    { label: 'Total QRE' },
    { label: 'Project Hours - FTE' },
    { label: 'Project Hours - Subcon' },
    { label: 'Project Hours - Total' },
    { label: 'QRE (%) - Potential' },
    { label: 'QRE (%) - Adjustment' },
    { label: 'QRE (%) - Final' },
    { label: 'R&D Credits' },
    // { label: 'Project Identifiers' },
    { label: "Survey-Sent Date" },
    { label: "Survey-Reminder Sent Date" },
    { label: "Survey-Response Date" },
    { label: "Last Updated Date" },
  ];
  const handleSearchInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const handleFilterChange = ({ field, scale }) => (event, newValue) => {
    const value = newValue ?? event.target.value;
    setProjectFilterState((prev) => {
      if (scale === "min" || scale === "max") {
        const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [];
        updatedField[scale === "min" ? 0 : 1] = value;

        const minValue = parseFloat(updatedField[0]);
        const maxValue = parseFloat(updatedField[1]);
        //cost
        if (field === "s_fte_cost") {
          setProjectsCountError2('');
          setPositiveNumberError2('');
        }
        if (field === "s_subcon_cost") {
          setProjectsCountError3('');
          setPositiveNumberError3('');
        }
        if (field === "s_total_project_cost") {
          setProjectsCountError4('');
          setPositiveNumberError4('');
        }
        //qre
        if (field === "s_fte_qre_cost") {
          setQreFteCountError('');
          setQreFteNumberError('');
        }
        if (field === "s_subcon_qre_cost") {
          setQreSubconCountError('');
          setQreSubconNumberError('');
        }
        if (field === "s_qre_cost") {
          setQreTotalCountError('');
          setQreTotalNumberError('');
        }

        //hours
        if (field === "s_fte_hours") {
          setFteHoursCountError('');
          setFteHoursNumberError('');
        }
        if (field === "s_subcon_hours") {
          setSubconHoursCountError('');
          setSubconHoursNumberError('');
        }
        if (field === "s_total_hours") {
          setTotalHoursCountError('');
          setTotalHoursNumberError('');
        }
        //rnd
        if (field === "rndPotential") {
          setRndPotentialCountError('');
          setPositiveNumberError('');
        }
        if (field === "s_rnd_adjustment") {
          setRndAdjustmentCountError('');
          // setRndAdjustmentNumberError('');
        }
        if (field === "rndFinal") {
          setRndFinalCountError('');
          setRndFinalNumberError('');
        }
        if (field === "s_rd_credits") {
          setrndCreditsCountError('');
          setRndCreditsNumberError('');
        }

        if (value < 0) {
          if (field === "s_fte_cost") {
            setPositiveNumberError2("Only positive num");
          }
          if (field === "s_subcon_cost") {
            setPositiveNumberError3("Only positive num");
          }
          if (field === "s_total_project_cost") {
            setPositiveNumberError4("Only positive num");
          }
          //qre
          if (field === "s_fte_qre_cost") {
            setQreFteNumberError("Only positive num");
          }
          if (field === "s_subcon_qre_cost") {
            setQreSubconNumberError("Only positive num");
          }
          if (field === "s_qre_cost") {
            setQreTotalNumberError("Only positive num");
          }

          //hours
          if (field === "s_fte_hours") {
            setFteHoursNumberError("Only positive num");
          }

          if (field === "s_subcon_hours") {
            setSubconHoursNumberError("Only positive num");
          }
          if (field === "s_total_hours") {
            setTotalHoursNumberError("Only positive num");
          }

          //rnd
          if (field === "rndPotential") {
            setPositiveNumberError("Only positive num");
          }
          // if (field === "s_rnd_adjustment") {
          //   setRndAdjustmentNumberError("Only positive num");
          // }
          if (field === "rndFinal") {
            setRndFinalNumberError("Only positive num");
          }
          if (field === "s_rd_credits") {
            setRndCreditsNumberError("Only positive num");
          }
        }
        else {
          if (minValue && maxValue && minValue > maxValue) {
            if (field === "s_fte_cost") {
              setProjectsCountError2("Max should be greater than Min");
            }
            if (field === "s_subcon_cost") {
              setProjectsCountError3("Max should be greater than Min");
            }
            if (field === "s_total_project_cost") {
              setProjectsCountError4("Max should be greater than Min");
            }
            //qre
            if (field === "s_fte_qre_cost") {
              setQreFteCountError("Max should be greater than Min");
            }
            if (field === "s_subcon_qre_cost") {
              setQreSubconCountError("Max should be greater than Min");
            }
            if (field === "s_qre_cost") {
              setQreTotalCountError("Max should be greater than Min");
            }
            //hours
            if (field === "s_fte_hours") {
              setFteHoursCountError("Max should be greater than Min");
            }
            if (field === "s_subcon_hours") {
              setSubconHoursCountError("Max should be greater than Min");
            }
            if (field === "s_total_hours") {
              setTotalHoursCountError("Max should be greater than Min");
            }
            //rnd
            if (field === "rndPotential") {
              setRndPotentialCountError("Max should be greater than Min");
            }
            if (field === "s_rnd_adjustment") {
              setRndAdjustmentCountError("Max should be greater than Min");
            }
            if (field === "rndFinal") {
              setRndFinalCountError("Max should be greater than Min");
            }
            if (field === "s_rd_credits") {
              setrndCreditsCountError("Max should be greater than Min");
            }
          }
        }
        return {
          ...prev,
          [field]: updatedField
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };
  useEffect(() => {
    const updatedCompanyId = Array.isArray(company) ? company.map(c => c.companyId) : undefined;
    const updatedSpocNameId = spocNameList?.find((proj) => proj?.name === spocName)?.spocNameId;
    const updatedSpocEmailId = spocEmailList?.find((proj) => proj?.name === spocEmail)?.spocEmailId;
    const updatedAccountingYearId = accountingYearList?.find((proj) => proj?.name === fiscalYear)?.accYearId;
    const updateDataGatheringId = dataGatheringList?.find((proj) => proj?.name === dataGathering)?.dataGatheringId;
    const updateProjectStatusId = projectStatusList?.find((proj) => proj?.name === projectStatus)?.projectStatusId;
    const updateSurveyStatusId = surveyStatusList?.find((proj) => proj?.name === surveyStatus)?.surveyStatusId;
    const updateInteractionStatusId = interactionStatusList?.find((proj) => proj?.name === interactionStatus)?.interactionStatusId;
    const updatedTimesheetStatusId = timesheetStatusList?.find((proj) => proj?.name === timesheetStatus)?.timesheetStatusId;
    const updatedfteCostStatusId = fteCostStatusList?.find((proj) => proj?.name === fteCostStatus)?.fteCostStatusId;
    const updatedSubconCostStatusId = subconCostStatusList?.find((proj) => proj?.name === subconCostStatus)?.subconCostStatusId;
    const updatedTechnicalInterviewStatusId = technicalInterviewStatusList?.find((proj) => proj?.name === technicalInterviewStatus)?.technicalInterviewStatusId;
    const updatedTechSumStatusId = technicalSummaryStatusList?.find((proj) => proj?.name === technicalInterviewStatus)?.technicalSummaryStatusId;
    const updatedFinSumStatusId = financialSummaryStatusList?.find((proj) => proj?.name === finalReviewStatus)?.financialSummaryStatusId;
    const updatedClaimsFormStatusId = claimsFormstatusList?.find((proj) => proj?.name === claimsFormstatus)?.claimsFormstatusId;
    const updatedFinalReviewStatusId = finalReviewStatusList?.find((proj) => proj?.name === finalReviewStatus)?.finalReviewStatusId;
    const updatedLastUpdatedById = lastUpdateByList?.find((proj) => proj?.name === lastUpdateBy)?.lastUpdateById;

    setProjectFilterState(prev => ({
      ...prev,
      companyId: updatedCompanyId,
      company,
      spocNameId: [updatedSpocNameId],
      spocName,
      spocEmailId: [updatedSpocEmailId],
      spocEmail,
      accYearId: [updatedAccountingYearId],
      fiscalYear,
      dataGatheringId: [updateDataGatheringId],
      dataGathering,
      projectStatusId: [updateProjectStatusId],
      projectStatus,
      surveyStatusId: [updateSurveyStatusId],
      surveyStatus,
      interactionStatusId: [updateInteractionStatusId],
      interactionStatus,
      timesheetStatusId: [updatedTimesheetStatusId],
      timesheetStatus,
      fteCostStatusId: [updatedfteCostStatusId],
      fteCostStatus,
      subconCostStatusId: [updatedSubconCostStatusId],
      subconCostStatus,
      technicalInterviewStatusId: [updatedTechnicalInterviewStatusId],
      technicalInterviewStatus,
      technicalSummaryStatusId: [updatedTechSumStatusId],
      technicalSummaryStatus,
      financialSummaryStatusId: [updatedFinSumStatusId],
      financialSummaryStatus,
      claimsFormstatusId: [updatedClaimsFormStatusId],
      claimsFormstatus,
      finalReviewStatusId: [updatedFinalReviewStatusId],
      finalReviewStatus,
      lastUpdateById: [updatedLastUpdatedById],
      lastUpdateBy,
      surveySentStartDate,
      surveySentEndDate,
      surveyReminderStartDate,
      surveyReminderEndDate,
      surveyResponseStartDate,
      surveyResponseEndDate,
      lastUpdatedStartDate,
      lastUpdatedEndDate,
    }));
  }, [company, clientList, spocName, spocEmail, spocNameList, spocEmailList, fiscalYear, dataGathering, dataGatheringList, projectStatus, projectStatusList, surveyStatus, surveyStatusList,
    timesheetStatus, timesheetStatusList, fteCostStatus, fteCostStatusList, subconCostStatus, subconCostStatusList, technicalInterviewStatus, technicalInterviewStatusList, technicalSummaryStatus,
    technicalSummaryStatusList, financialSummaryStatus, financialSummaryStatusList, claimsFormstatus, claimsFormstatusList, finalReviewStatus, finalReviewStatusList, lastUpdateBy, lastUpdateByList,
    surveySentStartDate, surveySentEndDate, surveyReminderStartDate, surveyReminderEndDate, surveyResponseStartDate, surveyReminderEndDate, lastUpdatedStartDate, lastUpdatedEndDate, interactionStatus, interactionStatusList,
  ]);

  const fetchProjectsList = async () => {
    try {
      const url = `${BaseURL}/api/v1/projects/project-filter-values`;
      const response = await axios.get(url, Authorization_header());
      const data = response?.data?.data || {};
      setCompany(data?.companyIds || []);
      setAccountingYearList(data?.fiscalYears || []);
      setSpocNameList(data?.spocNames || []);
      setSpocEmailList(data?.spocEmails || []);
      setDataGatheringList(data?.s_data_gathering || []);
      setProjectStatusList(data?.s_project_status || []);
      setSurveyStatusList(data?.surveyStatuses || []);
      setInteractionStatusList(data?.s_interaction_status || []);
      setTimesheetStatusList(data?.s_timesheet_status || []);
      setFteCostStatusList(data?.s_fte_cost_status || []);
      setSubconCostStatusList(data?.s_subcon_cost_status || []);
      setTechnicalInterviewStatusList(data?.s_technical_interview_status || []);
      setTechnicalSummaryStatusList(data?.s_technical_summary_status);
      setFinancialSummaryStatusList(data?.s_financial_summary_status);
      setClaimsFormstatusList(data?.s_claims_form_status);
      setFinalReviewStatusList(data?.s_final_review_status);
      setLastUpdateByList(data?.lastUpdatedBys);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, [projectFilterState.companyIds]);

  useEffect(() => {
    if (clearProjectFilterTrigger) {
      setCompany([]);
      setAccYear([]);
      setSpocName([]);
      setSpocEmail([]);
      setDataGathering([]);
      setProjectStatus([]);
      setSurveyStatus([]);
      setInteractionStatus([]);
      setTimesheetStatus([]);
      setFteCostStatus([]);
      setSubconCostStatus([]);
      setTechnicalInterviewStatus([]);
      setTechnicalSummaryStatus([]);
      setFinancialSummaryStatus([]);
      setFinalReviewStatus([]);
      setLastUpdateBy([]);
      setProjectFilterState({
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
        interactionStatus: [],
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
      setShowCompany(false);
      setShowSpocName(false);
      setShowSpocEmail(false);
      setShowRnDPotential(false);
      setShowFteCost(false);
      setShowSubconCost(false);
      setShowTotalProjectCost(false);
      setShowQreFte(false);
      setShowQreSubcon(false);
      setShowQreTotal(false);
      setShowFteHours(false);
      setShowSubconHours(false);
      setShowTotalHours(false);
      setShowRndAdjustment(false);
      setShowRndFinal(false);
      setShowRndCredits(false);
      setShowDataGathering(false);
      setShowProjectStatus(false);
      setShowSurveyStatus(false);
      setShowInteractionStatus(false);
      setShowTimesheetStatus(false);
      setShowFteCostStatus(false);
      setShowSubconCostStatus(false);
      setShowTechnicalInterviewStatus(false);
      setShowTechnicalSummaryStatus(false);
      setShowFinancialSummaryStatus(false);
      setShowClaimsFormstatus(false);
      setShowFinalReviewStatus(false);
      setShowLastUpdateBy(false);
      setShowSurveySentDate(false);
      setShowSurveyReminderDate(false);
      setShowSurveyResponseDate(false);
      setShowLastUpdatedDate(false);
    }
  }, [clearProjectFilterTrigger]);
  const clearFilters = () => {
    localStorage.removeItem("projectFilters");
    setCompany([]);
    setAccYear([]);
    setSpocName([]);
    setSpocEmail([]);
    setDataGathering([]);
    setProjectStatus([]);
    setSurveyStatus([]);
    setInteractionStatus([]);
    setTimesheetStatus([]);
    setFteCostStatus([]);
    setSubconCostStatus([]);
    setTechnicalInterviewStatus([]);
    setTechnicalSummaryStatus([]);
    setFinancialSummaryStatus([]);
    setFinalReviewStatus([]);
    setLastUpdateBy([]);
    setClaimsFormstatus([]);
    setSearchTerm('');
    setSurveySentStartDate('');
    setSurveySentEndDate('');
    setSurveyReminderStartDate('');
    setSurveyReminderEndDate('');
    setSurveyResponseStartDate('');
    setSurveyResponseEndDate('');
    setLastUpdatedStartDate('');
    setLastUpdatedEndDate('');
    setProjectFilterState({
      ...projectFilterState,
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
      interactionStatus: [],
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
      surveySentStartDate: '',
      surveySentEndDate: '',
      surveyReminderStartDate: '',
      surveyReminderEndDate: '',
      surveyResponseStartDate: '',
      surveyResponseEndDate: '',
      lastUpdatedStartDate: '',
      lastUpdatedEndDate: '',
    });
    setActiveFilterCount(0);
    fetchProjects({});
    setPositiveNumberError('');
    setPositiveNumberError2('');
    setPositiveNumberError3('');
    setRndPotentialCountError('');
    setProjectsCountError2('');
    setProjectsCountError3('');
    onApplyFilters({});
    triggerProjectClearFilters();
    setIsProjectFilterApplied(false);
    setShowAccountingYear(false);
    setShowFteCost(false);
    setShowSubconCost(false);
    setShowTotalProjectCost(false);
    setShowQreFte(false);
    setShowQreSubcon(false);
    setShowQreTotal(false);
    setShowFteHours(false);
    setShowSubconHours(false);
    setShowTotalHours(false);
    setShowRndAdjustment(false);
    setShowRndFinal(false);
    setShowRndCredits(false);
    setShowRnDPotential(false);
    setShowSurveySentDate(false);
    setShowSurveyReminderDate(false);
    setShowSurveyResponseDate(false);
    setShowLastUpdatedDate(false);
    setShowInteractionStatus(false);
    setTriggerFilter(true);
  };

  useEffect(() => {
    if (triggerFilter) {
      applyFilters();
    }
  }, [triggerFilter])

  const applyFilters = () => {
    const filters = {
      ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
      ...(fiscalYear?.length > 0 && { fiscalYear }),
      ...(spocName?.length > 0 && { spocName }),
      ...(spocEmail?.length > 0 && { spocEmail }),
      ...(dataGathering?.length > 0 && { dataGathering }),
      ...(projectStatus?.length > 0 && { projectStatus }),
      ...(surveyStatus?.length > 0 && { surveyStatus }),
      ...(interactionStatus?.length > 0 && { interactionStatus }),
      ...(timesheetStatus?.length > 0 && { timesheetStatus }),
      ...(fteCostStatus?.length > 0 && { fteCostStatus }),
      ...(subconCostStatus?.length > 0 && { subconCostStatus }),
      ...(technicalInterviewStatus?.length > 0 && { technicalInterviewStatus }),
      ...(technicalSummaryStatus?.length > 0 && { technicalSummaryStatus }),
      ...(financialSummaryStatus?.length > 0 && { financialSummaryStatus }),
      ...(claimsFormstatus?.length > 0 && { claimsFormstatus }),
      ...(finalReviewStatus?.length > 0 && { finalReviewStatus }),
      ...(lastUpdateBy?.length > 0 && { lastUpdateBy }),
      ...(surveySentStartDate && { surveySentStartDate }),
      ...(surveyReminderEndDate && { surveyReminderEndDate }),
      ...(surveyReminderStartDate && { surveyReminderStartDate }),
      ...(surveySentEndDate && { surveySentEndDate }),
      ...(surveyResponseStartDate && { surveyResponseStartDate }),
      ...(surveyResponseEndDate && { surveyResponseEndDate }),
      ...(surveySentStartDate && { lastUpdatedStartDate }),
      ...(lastUpdatedEndDate && { lastUpdatedEndDate }),
      ...(projectFilterState.rndPotential && {
        minRnDPotential: projectFilterState.rndPotential[0],
        maxRnDPotential: projectFilterState.rndPotential[1],
      }),
      ...(projectFilterState.s_fte_cost && {
        minFteCost: projectFilterState.s_fte_cost[0],
        maxFteCost: projectFilterState.s_fte_cost[1],
      }),
      ...(projectFilterState.s_subcon_cost && {
        minSubconCost: projectFilterState.s_subcon_cost[0],
        maxSubconCost: projectFilterState.s_subcon_cost[1],
      }),
      ...(projectFilterState.s_total_project_cost && {
        minTotalProjectCost: projectFilterState.s_total_project_cost[0],
        maxTotalProjectCost: projectFilterState.s_total_project_cost[1],
      }),
      ...(projectFilterState.s_fte_qre_cost && {
        minQreFte: projectFilterState.s_fte_qre_cost[0],
        maxQreFte: projectFilterState.s_fte_qre_cost[1],
      }),
      ...(projectFilterState.s_subcon_qre_cost && {
        minQreSubcon: projectFilterState.s_subcon_qre_cost[0],
        maxQreSubcon: projectFilterState.s_subcon_qre_cost[1],
      }),
      ...(projectFilterState.s_qre_cost && {
        minQreTotal: projectFilterState.s_qre_cost[0],
        maxQreTotal: projectFilterState.s_qre_cost[1],
      }),
      ...(projectFilterState.s_fte_hours && {
        minFteHours: projectFilterState.s_fte_hours[0],
        maxFteHours: projectFilterState.s_fte_hours[1],
      }),
      ...(projectFilterState.s_subcon_hours && {
        minSubconHours: projectFilterState.s_subcon_hours[0],
        maxSubconHours: projectFilterState.s_subcon_hours[1],
      }),
      ...(projectFilterState.s_total_hours && {
        minTotalHours: projectFilterState.s_total_hours[0],
        maxTotalHours: projectFilterState.s_total_hours[1],
      }),
      ...(projectFilterState.s_rnd_adjustment && {
        minRndAdjustment: projectFilterState.s_rnd_adjustment[0],
        maxRndAdjustment: projectFilterState.s_rnd_adjustment[1],
      }),
      ...(projectFilterState.rndFinal && {
        minRndFinal: projectFilterState.rndFinal[0],
        maxRndFinal: projectFilterState.rndFinal[1],
      }),
      ...(projectFilterState.s_rd_credits && {
        minRndCredits: projectFilterState.s_rd_credits[0],
        maxRndCredits: projectFilterState.s_rd_credits[1],
      }),
    };

    // localStorage.setItem("projectFilters", JSON.stringify(filters));
    fetchProjects(filters);
    setTriggerFilter(false);
  };

  const handleDateChange = (type, field) => (event) => {
    const value = event.target.value;
    if (field === "Survey-Sent Date") {
      if (type === "startDate") {
        setSurveySentStartDate(value);
      } else {
        setSurveySentEndDate(value);
      }
    } else if (field === "Survey-Reminder Sent Date") {
      if (type === "startDate") {
        setSurveyReminderStartDate(value);
      } else {
        setSurveyReminderEndDate(value);
      }
    } else if (field === "Survey-Response Date") {
      if (type === "startDate") {
        setSurveyResponseStartDate(value);
      } else {
        setSurveyResponseEndDate(value);
      }
    } else if (field === "Last Updated Date") {
      if (type === "startDate") {
        setLastUpdatedStartDate(value);
      } else {
        setLastUpdatedEndDate(value);
      }
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      variant="persistent"
      sx={styles.drawerPaper}
    >
      <Box sx={styles.drawerContainer}>
        <Box sx={{
          ...styles.header,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Typography sx={styles.title}>
            Project Filter
          </Typography>
        </Box>
        <Box sx={{
          position: 'sticky',
          top: "10px",
          zIndex: 9,
        }}>
          <InputBase
            type="text"
            placeholder="Search Field Here..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            value={searchTerm}
            onChange={handleSearchInputChange}
            sx={styles.inputStyle}
          />
        </Box>
        <Box sx={styles.accordion}>
          <Accordion
            sx={{
              height: "100%",
              overflow: 'auto',
              backgroundColor: isAccordionOpen ? '#FFFFFF' : 'transparent',
              '&:hover': { backgroundColor: '#FFFFFF' },
              boxShadow: 'none',
              borderRadius: "20px",
            }}
            expanded={isAccordionOpen}
          >
            <AccordionDetails sx={styles.accordionDetails}>
              <Box>
                {filterFields
                  .filter(field => field.label.toLowerCase().includes(searchTerm))
                  .map((field, index) => (
                    <Box key={index}>
                      <FormControlLabel
                        control={
                          <>
                            <Checkbox
                              checked={
                                field.label === "Account"
                                  ? showCompany
                                  : field.label === "Fiscal year"
                                    ? showAccountingYear
                                    : field.label === "SPOC Name"
                                      ? showSpocName
                                      : field.label === "SPOC Email"
                                        ? showSpocEmail
                                        : field.label === "Data Gathering"
                                          ? showDataGathering
                                          : field.label === "Project Status"
                                            ? showProjectStatus
                                            : field.label === "Survey Status"
                                              ? showSurveyStatus
                                              : field.label === "Interaction Status"
                                                ? showInteractionStatus
                                                : field.label === "Timesheet Status"
                                                  ? showTimesheetStatus
                                                  : field.label === "Cost Status - Employee"
                                                    ? showFteCostStatus
                                                    : field.label === "Cost Status - Subcon"
                                                      ? showSubconCostStatus
                                                      : field.label === "Technical Interview Status"
                                                        ? showTechnicalInterviewStatus
                                                        : field.label === "Technical Summary Status"
                                                          ? showTechnicalSummaryStatus
                                                          : field.label === "Financial Summary Status"
                                                            ? showFinancialSummaryStatus
                                                            : field.label === "Claims Form Status"
                                                              ? showClaimsFormstatus
                                                              : field.label === "Final Review Status"
                                                                ? showFinalReviewStatus
                                                                : field.label === "Last Updated By"
                                                                  ? showLastUpdateBy
                                                                  : field.label === "FTE Cost"
                                                                    ? showFteCost
                                                                    : field.label === "Subcon Cost"
                                                                      ? showSubconCost
                                                                      : field.label === "Total Project Cost"
                                                                        ? showTotalProjectCost
                                                                        : field.label === "QRE FTE"
                                                                          ? showQreFte
                                                                          : field.label === "QRE Subcon"
                                                                            ? showQreSubcon
                                                                            : field.label === "Total QRE"
                                                                              ? showQreTotal
                                                                              : field.label === "Project Hours - FTE"
                                                                                ? showFteHours
                                                                                : field.label === "Project Hours - Subcon"
                                                                                  ? showSubconHours
                                                                                  : field.label === "Project Hours - Total"
                                                                                    ? showTotalHours
                                                                                    : field.label === "QRE (%) - Potential"
                                                                                      ? showRnDPotential
                                                                                      : field.label === "QRE (%) - Adjustment"
                                                                                        ? showRndAdjustment
                                                                                        : field.label === "QRE (%) - Final"
                                                                                          ? showRndFinal
                                                                                          : field.label === "R&D Credits"
                                                                                            ? showRndCredits
                                                                                            : field.label === "Survey-Sent Date"
                                                                                              ? showSurveySentDate
                                                                                              : field.label === "Survey-Reminder Sent Date"
                                                                                                ? showSurveyReminderDate
                                                                                                : field.label === "Survey-Response Date"
                                                                                                  ? showSurveyResponseDate
                                                                                                  : field.label === "Last Updated Date"
                                                                                                    ? showLastUpdatedDate
                                                                                                    : false
                              }
                              onChange={(e) => {
                                if (field.label === "Account") {
                                  if (e.target.checked) {
                                    setShowCompany(true);
                                  } else {
                                    setShowCompany(false);
                                    setCompany([]);
                                  }
                                } else if (field.label === "Fiscal year") {
                                  if (e.target.checked) {
                                    setShowAccountingYear(true);
                                  } else {
                                    setShowAccountingYear(false);
                                    setAccYear([]);
                                  }
                                } else if (field.label === "SPOC Name") {
                                  if (e.target.checked) {
                                    setShowSpocName(true);
                                  } else {
                                    setShowSpocName(false);
                                    setSpocName([]);
                                  }
                                } else if (field.label === "SPOC Email") {
                                  if (e.target.checked) {
                                    setShowSpocEmail(true);
                                  } else {
                                    setShowSpocEmail(false);
                                    setSpocEmail([]);
                                  }
                                } else if (field.label === "Data Gathering") {
                                  if (e.target.checked) {
                                    setShowDataGathering(true);
                                  } else {
                                    setShowDataGathering(false);
                                    setDataGathering([]);
                                  }
                                } else if (field.label === "Project Status") {
                                  if (e.target.checked) {
                                    setShowProjectStatus(true);
                                  } else {
                                    setShowProjectStatus(false);
                                    setProjectStatus([]);
                                  }
                                } else if (field.label === "Survey Status") {
                                  if (e.target.checked) {
                                    setShowSurveyStatus(true);
                                  } else {
                                    setShowSurveyStatus(false);
                                    setSurveyStatus([]);
                                  }
                                }
                                else if (field.label === "Interaction Status") {
                                  if (e.target.checked) {
                                    setShowInteractionStatus(true);
                                  } else {
                                    setShowInteractionStatus(false);
                                    setInteractionStatus([]);
                                  }
                                }
                                else if (field.label === "Timesheet Status") {
                                  if (e.target.checked) {
                                    setShowTimesheetStatus(true);
                                  } else {
                                    setShowTimesheetStatus(false);
                                    setTimesheetStatus([]);
                                  }
                                }
                                else if (field.label === "Cost Status - Employee") {
                                  if (e.target.checked) {
                                    setShowFteCostStatus(true);
                                  } else {
                                    setShowFteCostStatus(false);
                                    setFteCostStatus([]);
                                  }
                                }
                                else if (field.label === "Cost Status - Subcon") {
                                  if (e.target.checked) {
                                    setShowSubconCostStatus(true);
                                  } else {
                                    setShowSubconCostStatus(false);
                                    setSubconCostStatus([]);
                                  }
                                }
                                else if (field.label === "Technical Interview Status") {
                                  if (e.target.checked) {
                                    setShowTechnicalInterviewStatus(true);
                                  } else {
                                    setShowTechnicalInterviewStatus(false);
                                    setTechnicalInterviewStatus([]);
                                  }
                                }
                                else if (field.label === "Technical Summary Status") {
                                  if (e.target.checked) {
                                    setShowTechnicalSummaryStatus(true);
                                  } else {
                                    setShowTechnicalSummaryStatus(false);
                                    setTechnicalSummaryStatus([]);
                                  }
                                }
                                else if (field.label === "Financial Summary Status") {
                                  if (e.target.checked) {
                                    setShowFinancialSummaryStatus(true);
                                  } else {
                                    setShowFinancialSummaryStatus(false);
                                    setFinancialSummaryStatus([]);
                                  }
                                }
                                else if (field.label === "Claims Form Status") {
                                  if (e.target.checked) {
                                    setShowClaimsFormstatus(true);
                                  } else {
                                    setShowClaimsFormstatus(false);
                                    setClaimsFormstatus([]);
                                  }
                                }
                                else if (field.label === "Final Review Status") {
                                  if (e.target.checked) {
                                    setShowFinalReviewStatus(true);
                                  } else {
                                    setShowFinalReviewStatus(false);
                                    setFinalReviewStatus([]);
                                  }
                                }
                                else if (field.label === "Last Updated By") {
                                  if (e.target.checked) {
                                    setShowLastUpdateBy(true);
                                  } else {
                                    setShowLastUpdateBy(false);
                                    setLastUpdateBy([]);
                                  }
                                }
                                else if (field.label === "FTE Cost") {
                                  if (e.target.checked) {
                                    setShowFteCost(true);
                                  } else {
                                    setShowFteCost(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_fte_cost: [0, null],
                                    }));
                                  }
                                } else if (field.label === "Subcon Cost") {
                                  if (e.target.checked) {
                                    setShowSubconCost(true);
                                  } else {
                                    setShowSubconCost(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_subcon_cost: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "Total Project Cost") {
                                  if (e.target.checked) {
                                    setShowTotalProjectCost(true);
                                  } else {
                                    setShowTotalProjectCost(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_total_project_cost: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "QRE FTE") {
                                  if (e.target.checked) {
                                    setShowQreFte(true);
                                  } else {
                                    setShowQreFte(false);
                                    setProjectFilterState(prev => {
                                      return {
                                        ...prev,
                                        s_fte_qre_cost: [0, null],
                                      };
                                    });
                                  }
                                }
                                else if (field.label === "QRE Subcon") {
                                  if (e.target.checked) {
                                    setShowQreSubcon(true);
                                  } else {
                                    setShowQreSubcon(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_subcon_qre_cost: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "Total QRE") {
                                  if (e.target.checked) {
                                    setShowQreTotal(true);
                                  } else {
                                    setShowQreTotal(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_qre_cost: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "Project Hours - FTE") {
                                  if (e.target.checked) {
                                    setShowFteHours(true);
                                  } else {
                                    setShowFteHours(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_fte_hours: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "Project Hours - Subcon") {
                                  if (e.target.checked) {
                                    setShowSubconHours(true);
                                  } else {
                                    setShowSubconHours(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_subcon_hours: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "Project Hours - Total") {
                                  if (e.target.checked) {
                                    setShowTotalHours(true);
                                  } else {
                                    setShowTotalHours(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_total_hours: [0, null],
                                    }));
                                  }
                                } else if (field.label === "QRE (%) - Potential") {
                                  if (e.target.checked) {
                                    setShowRnDPotential(true);
                                  } else {
                                    setShowRnDPotential(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      rndPotential: [0, null],
                                    }));
                                  }
                                }


                                else if (field.label === "QRE (%) - Adjustment") {
                                  if (e.target.checked) {
                                    setShowRndAdjustment(true);
                                  } else {
                                    setShowRndAdjustment(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_rnd_adjustment: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "QRE (%) - Final") {
                                  if (e.target.checked) {
                                    setShowRndFinal(true);
                                  } else {
                                    setShowRndFinal(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      rndFinal: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "R&D Credits") {
                                  if (e.target.checked) {
                                    setShowRndCredits(true);
                                  } else {
                                    setShowRndCredits(false);
                                    setProjectFilterState(prev => ({
                                      ...prev,
                                      s_rd_credits: [0, null],
                                    }));
                                  }
                                }
                                else if (field.label === "Survey-Sent Date") {
                                  setShowSurveySentDate(e.target.checked);
                                  if (!e.target.checked) {
                                    setSurveySentStartDate("");
                                    setSurveySentEndDate("");
                                  }
                                }
                                else if (field.label === "Survey-Reminder Sent Date") {
                                  setShowSurveyReminderDate(e.target.checked);
                                  if (!e.target.checked) {
                                    setSurveyReminderStartDate("");
                                    setSurveyReminderEndDate("");
                                  }
                                }
                                else if (field.label === "Survey-Response Date") {
                                  setShowSurveyResponseDate(e.target.checked);
                                  if (!e.target.checked) {
                                    setSurveyResponseStartDate("");
                                    setSurveyResponseEndDate("");
                                  }
                                }
                                else if (field.label === "Last Updated Date") {
                                  setShowLastUpdatedDate(e.target.checked);
                                  if (!e.target.checked) {
                                    setLastUpdatedStartDate("");
                                    setLastUpdatedEndDate("");
                                  }
                                }
                              }}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#00A398",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          </>
                        }
                        label={field.label}
                      />
                      {field.label === 'Account' && (
                        <Collapse in={showCompany}>
                          <CompanySelector company={company} clientList={clientList} setCompany={setCompany} />
                        </Collapse>
                      )}
                      {field.label === 'Fiscal year' && (
                        <Collapse in={showAccountingYear}>
                          <AccYearSelector fiscalYear={fiscalYear} setAccountingYear={setAccYear} accountingYearList={accountingYearList} />
                        </Collapse>
                      )}
                      {field.label === 'SPOC Name' && (
                        <Collapse in={showSpocName}>
                          <SpocNameFilters
                            spocName={spocName}
                            spocNameList={spocNameList}
                            setSpocName={setSpocName}
                          />
                        </Collapse>
                      )}
                      {field.label === 'SPOC Email' && (
                        <Collapse in={showSpocEmail}>
                          <SpocEmailFilters
                            spocEmail={spocEmail}
                            spocEmailList={spocEmailList}
                            setSpocEmail={setSpocEmail}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Data Gathering' && (
                        <Collapse in={showDataGathering}>
                          <DataGatheringSelect dataGathering={dataGathering} dataGatheringList={dataGatheringList} setDataGathering={setDataGathering} />
                        </Collapse>
                      )}
                      {field.label === 'Project Status' && (
                        <Collapse in={showProjectStatus}>
                          <AllStatusSelect
                            status={projectStatus}
                            statusList={projectStatusList}
                            setStatus={setProjectStatus} />
                        </Collapse>
                      )}
                      {field.label === 'Survey Status' && (
                        <Collapse in={showSurveyStatus}>
                          <AllStatusSelect
                            status={surveyStatus}
                            statusList={surveyStatusList}
                            setStatus={setSurveyStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Interaction Status' && (
                        <Collapse in={showInteractionStatus}>
                          <AllStatusSelect
                            status={interactionStatus}
                            statusList={interactionStatusList}
                            setStatus={setInteractionStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Timesheet Status' && (
                        <Collapse in={showTimesheetStatus}>
                          <AllStatusSelect
                            status={timesheetStatus}
                            statusList={timesheetStatusList}
                            setStatus={setTimesheetStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Cost Status - Employee' && (
                        <Collapse in={showFteCostStatus}>
                          <AllStatusSelect
                            status={fteCostStatus}
                            statusList={fteCostStatusList}
                            setStatus={setFteCostStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Cost Status - Subcon' && (
                        <Collapse in={showSubconCostStatus}>
                          <AllStatusSelect
                            status={subconCostStatus}
                            statusList={subconCostStatusList}
                            setStatus={setSubconCostStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Technical Interview Status' && (
                        <Collapse in={showTechnicalInterviewStatus}>
                          <AllStatusSelect
                            status={technicalInterviewStatus}
                            statusList={technicalInterviewStatusList}
                            setStatus={setTechnicalInterviewStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Technical Summary Status' && (
                        <Collapse in={showTechnicalSummaryStatus}>
                          <AllStatusSelect
                            status={technicalSummaryStatus}
                            statusList={technicalSummaryStatusList}
                            setStatus={setTechnicalSummaryStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Financial Summary Status' && (
                        <Collapse in={showFinancialSummaryStatus}>
                          <AllStatusSelect
                            status={financialSummaryStatus}
                            statusList={financialSummaryStatusList}
                            setStatus={setFinancialSummaryStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Claims Form Status' && (
                        <Collapse in={showClaimsFormstatus}>
                          <AllStatusSelect
                            status={claimsFormstatus}
                            statusList={claimsFormstatusList}
                            setStatus={setClaimsFormstatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Final Review Status' && (
                        <Collapse in={showFinalReviewStatus}>
                          <AllStatusSelect
                            status={finalReviewStatus}
                            statusList={finalReviewStatusList}
                            setStatus={setFinalReviewStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Last Updated By' && (
                        <Collapse in={showLastUpdateBy}>
                          <AllStatusSelect
                            status={lastUpdateBy}
                            statusList={lastUpdateByList}
                            setStatus={setLastUpdateBy}
                          />
                        </Collapse>
                      )}
                      {field.label === 'FTE Cost' && (
                        <Collapse in={showFteCost}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_fte_cost?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_fte_cost", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!positiveNumberError2}
                              helperText={positiveNumberError2 || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_fte_cost?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_fte_cost", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!positiveNumberError2}
                            />
                          </Box>
                          {projectsCountError2 && (
                            <Typography color="error" variant="body2">
                              {projectsCountError2}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'Subcon Cost' && (
                        <Collapse in={showSubconCost}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_subcon_cost?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_subcon_cost", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!positiveNumberError3}
                              helperText={positiveNumberError3 || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_subcon_cost?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_subcon_cost", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!positiveNumberError3}
                            />
                          </Box>
                          {projectsCountError3 && (
                            <Typography color="error" variant="body2">
                              {projectsCountError3}
                            </Typography>
                          )}
                        </Collapse>
                      )}
                      {field.label === 'Total Project Cost' && (
                        <Collapse in={showTotalProjectCost}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_total_project_cost?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_total_project_cost", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!positiveNumberError4}
                              helperText={positiveNumberError4 || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_total_project_cost?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_total_project_cost", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!positiveNumberError4}
                            />
                          </Box>
                          {projectsCountError4 && (
                            <Typography color="error" variant="body2">
                              {projectsCountError4}
                            </Typography>
                          )}
                        </Collapse>
                      )}
                      {field.label === 'QRE FTE' && (
                        <Collapse in={showQreFte}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_fte_qre_cost?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_fte_qre_cost", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!qreFteNumberError}
                              helperText={qreFteNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_fte_qre_cost?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_fte_qre_cost", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!qreFteNumberError}
                            />
                          </Box>
                          {qreFteCountError && (
                            <Typography color="error" variant="body2">
                              {qreFteCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'QRE Subcon' && (
                        <Collapse in={showQreSubcon}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_subcon_qre_cost?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_subcon_qre_cost", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!qreSubconNumberError}
                              helperText={qreSubconNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_subcon_qre_cost?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_subcon_qre_cost", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!qreSubconNumberError}
                            />
                          </Box>
                          {qreSubconCountError && (
                            <Typography color="error" variant="body2">
                              {qreSubconCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'Total QRE' && (
                        <Collapse in={showQreTotal}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_qre_cost?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_qre_cost", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!qreTotalNumberError}
                              helperText={qreTotalNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_qre_cost?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_qre_cost", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!qreTotalNumberError}
                            />
                          </Box>
                          {qreTotalCountError && (
                            <Typography color="error" variant="body2">
                              {qreTotalCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}


                      {field.label === 'Project Hours - FTE' && (
                        <Collapse in={showFteHours}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_fte_hours?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_fte_hours", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!fteHoursNumberError}
                              helperText={fteHoursNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_fte_hours?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_fte_hours", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!fteHoursNumberError}
                            />
                          </Box>
                          {fteHoursCountError && (
                            <Typography color="error" variant="body2">
                              {fteHoursCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'Project Hours - Subcon' && (
                        <Collapse in={showSubconHours}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_subcon_hours?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_subcon_hours", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!subconHoursNumberError}
                              helperText={subconHoursNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_subcon_hours?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_subcon_hours", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!subconHoursNumberError}
                            />
                          </Box>
                          {subconHoursCountError && (
                            <Typography color="error" variant="body2">
                              {subconHoursCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'Project Hours - Total' && (
                        <Collapse in={showTotalHours}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_total_hours?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_total_hours", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!totalHoursNumberError}
                              helperText={totalHoursNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_total_hours?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_total_hours", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!totalHoursNumberError}
                            />
                          </Box>
                          {totalHoursCountError && (
                            <Typography color="error" variant="body2">
                              {totalHoursCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'QRE (%) - Potential' && (
                        <Collapse in={showRnDPotential}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.rndPotential?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "rndPotential", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!positiveNumberError}
                              helperText={positiveNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.rndPotential?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "rndPotential", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                          </Box>
                          {rndPotentialCountError && (
                            <Typography color="error" variant="body2">
                              {rndPotentialCountError}
                            </Typography>
                          )}
                        </Collapse>
                      )}

                      {field.label === 'QRE (%) - Adjustment' && (
                        <Collapse in={showRndAdjustment}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_rnd_adjustment?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_rnd_adjustment", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!rndAdjustmentNumberError}
                              helperText={rndAdjustmentNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_rnd_adjustment?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_rnd_adjustment", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!rndAdjustmentNumberError}
                            />
                          </Box>
                          {rndAdjustmentCountError && (
                            <Typography color="error" variant="body2">
                              {rndAdjustmentCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'QRE (%) - Final' && (
                        <Collapse in={showRndFinal}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.rndFinal?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "rndFinal", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!rndFinalNumberError}
                              helperText={rndFinalNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.rndFinal?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "rndFinal", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!rndFinalNumberError}
                            />
                          </Box>
                          {rndFinalCountError && (
                            <Typography color="error" variant="body2">
                              {rndFinalCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}
                      {field.label === 'R&D Credits' && (
                        <Collapse in={showRndCredits}>
                          <Box display="flex" gap={3}>
                            <TextField
                              name="min"
                              type="number"
                              value={projectFilterState.s_rd_credits?.[0] ?? ''}
                              onChange={handleFilterChange({ field: "s_rd_credits", scale: "min" })}
                              placeholder="Min Value"
                              fullWidth
                              InputProps={{
                                sx: styles.textField,
                              }}
                              InputLabelProps={{
                                style: { width: '100%', marginTop: "-10px" },
                              }}
                              error={!!rndCreditsNumberError}
                              helperText={rndCreditsNumberError || ""}
                              FormHelperTextProps={{
                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                              }}
                              sx={{ padding: '0px' }}
                            />
                            <TextField
                              name="max"
                              type="number"
                              value={projectFilterState.s_rd_credits?.[1] ?? ''}
                              onChange={handleFilterChange({ field: "s_rd_credits", scale: "max" })}
                              fullWidth
                              placeholder="Max Value"
                              sx={{ marginRight: "10px" }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                              error={!!rndCreditsNumberError}
                            />
                          </Box>
                          {rndCreditsCountError && (
                            <Typography color="error" variant="body2">
                              {rndCreditsCountError}
                            </Typography>
                          )}
                          {/* </Box> */}
                        </Collapse>
                      )}

                      {/*date*/}
                      {field.label === 'Survey-Sent Date' && (
                        <Collapse in={showSurveySentDate}>
                          <Box display="flex" gap={3}>
                            <TextField
                              type="date"
                              label="Start Date"
                              value={surveySentStartDate || ""}
                              onChange={handleDateChange('startDate', 'Survey-Sent Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                            <TextField
                              type="date"
                              label="End Date"
                              value={surveySentEndDate || ""}
                              onChange={handleDateChange('endDate', 'Survey-Sent Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                          </Box>
                          {surveySentStartDate && surveySentEndDate && new Date(surveySentEndDate) < new Date(surveySentStartDate) && (
                            <Box color="error.main" mt={1} ml={-1}>
                              End date cannot be earlier than start date.
                            </Box>
                          )}
                        </Collapse>
                      )}
                      {field.label === 'Survey-Reminder Sent Date' && (
                        <Collapse in={showSurveyReminderDate}>
                          <Box display="flex" gap={3}>
                            <TextField
                              type="date"
                              label="Start Date"
                              value={surveyReminderStartDate || ""}
                              onChange={handleDateChange('startDate', 'Survey-Reminder Sent Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                            <TextField
                              type="date"
                              label="End Date"
                              value={surveyReminderEndDate || ""}
                              onChange={handleDateChange('endDate', 'Survey-Reminder Sent Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                          </Box>
                          {surveyReminderStartDate && surveyReminderEndDate && new Date(surveyReminderEndDate) < new Date(surveyReminderStartDate) && (
                            <Box color="error.main" mt={1} ml={-1}>
                              End date cannot be earlier than start date.
                            </Box>
                          )}
                        </Collapse>
                      )}
                      {field.label === 'Survey-Response Date' && (
                        <Collapse in={showSurveyResponseDate}>
                          <Box display="flex" gap={3}>
                            <TextField
                              type="date"
                              label="Start Date"
                              value={surveyResponseStartDate || ""}
                              onChange={handleDateChange('startDate', 'Survey-Response Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                            <TextField
                              type="date"
                              label="End Date"
                              value={surveyResponseEndDate || ""}
                              onChange={handleDateChange('endDate', 'Survey-Response Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                          </Box>
                          {surveyResponseStartDate && surveyResponseEndDate && new Date(surveyResponseEndDate) < new Date(surveyResponseStartDate) && (
                            <Box color="error.main" mt={1} ml={-1}>
                              End date cannot be earlier than start date.
                            </Box>
                          )}
                        </Collapse>
                      )}
                      {field.label === 'Last Updated Date' && (
                        <Collapse in={showLastUpdatedDate}>
                          <Box display="flex" gap={3}>
                            <TextField
                              type="date"
                              label="Start Date"
                              value={lastUpdatedStartDate || ""}
                              onChange={handleDateChange('startDate', 'Last Updated Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                            <TextField
                              type="date"
                              label="End Date"
                              value={lastUpdatedEndDate || ""}
                              onChange={handleDateChange('endDate', 'Last Updated Date')}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                sx: styles.textField,
                              }}
                            />
                          </Box>
                          {lastUpdatedStartDate && lastUpdatedEndDate && new Date(lastUpdatedEndDate) < new Date(lastUpdatedStartDate) && (
                            <Box color="error.main" mt={1} ml={-1}>
                              End date cannot be earlier than start date.
                            </Box>
                          )}
                        </Collapse>
                      )}
                    </Box>
                  ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={styles.footer}>
          <ActionButton
            label="Clear"
            color={styles.clearButton.color}
            onClick={clearFilters}
          />
          <ActionButton
            label="Apply"
            color={styles.applyButton.color}
            onClick={applyFilters}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default ProjectsFilters;
