import {
    Box,
    Accordion,
    AccordionDetails,
    Typography,
    Drawer,
    FormControlLabel,
    Checkbox,
    Collapse,
    TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { ProjectContext } from "../../context/ProjectContext";
import CompanySelector from "../FilterComponents/CompanySelector";
import ActionButton from "../FilterComponents/ActionButton";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";
import SpocNameFilters from "../FilterComponents/SpocNameFilters";
import SpocEmailFilters from "../FilterComponents/SpocEmailFilters";
import { CaseContext } from "../../context/CaseContext";
import ProjectSelector from "./ProjectSelector";
import PrimaryContactsFilter from "./PrimaryContactsFilter";
import MinMaxFilter from "./MinMaxFilter"
import DateFilterComponent from "./DateFilterComponent";
const styles = {
    drawerPaper: {
        "& .MuiDrawer-paper": {
            // borderRadius: "20px",
            height: "37%",
            display: "flex",
            flexDirection: "column",
            marginTop: "24.5rem",
            marginLeft: "20px",
            borderBottom: "1px solid #E4E4E4",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderLeft: "1px solid #E4E4E4",
        },
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 10,
        marginTop: "-0%",
        width: "17rem"
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
        overflowX: 'hidden',
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
        borderTop: "1px solid #E4E4E4",
        marginTop: "1px",
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

function CaseProjectFilters({ open, handleClose, onApplyFilters }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        setIsProjectFilterApplied,
        triggerProjectClearFilters,
    } = useContext(ProjectContext);
    const {
        caseFilterState, detailedCase, fetchFilterProjectsList,
    } = useContext(CaseContext);
    const [filterList, setFilterList] = useState([]);
    const [company, setCompany] = useState(projectFilterState.company);
    const [caseId, setCaseId] = useState(caseFilterState.caseId);
    const [caseIdList, setCaseIdList] = useState([]);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [showCompany, setShowCompany] = useState(false);
    const [fiscalYear, setFiscalYear] = useState([]);
    const [showFiscalYear, setShowFiscalYear] = useState(false);
    const [dataGathering, setDataGathering] = useState([]);
    const [showDataGathering, setShowDataGathering] = useState(false);
    const [projectStatus, setProjectStatus] = useState([]);
    const [showProjectStatus, setShowProjectStatus] = useState(false);
    const [surveyStatus, setSurveyStatus] = useState([]);
    const [showSurveyStatus, setShowSurveyStatus] = useState(false);
    const [interactionStatus, setInteractionStatus] = useState([]);
    const [showInteractionStatus, setShowInteractionStatus] = useState(false);
    const [timesheetStatus, setTimesheetStatus] = useState([]);
    const [showTimesheetStatus, setShowTimesheetStatus] = useState(false);
    const [FTECostStatus, setFTECostStatus] = useState([]);
    const [showFteCostStatus, setShowFteCostStatus] = useState(false);
    const [SubconCostStatus, setSubconCostStatus] = useState([]);
    const [showSubconCostStatus, setShowSubconCostStatus] = useState(false);
    const [interviewStatus, setInterviewStatus] = useState([]);
    const [showInterviewStatus, setShowInterviewStatus] = useState(false);
    const [techSummaryStatus, setTechSummaryStatus] = useState([]);
    const [showTechSummaryStatus, setShowTechSummaryStatus] = useState(false);
    const [finSummaryStatus, setFinSummaryStatus] = useState([]);
    const [showFinSummaryStatus, setShowFinSummaryStatus] = useState(false);
    const [cFormStatus, setCFormStatus] = useState([]);
    const [showCFormStatus, setShowCFormStatus] = useState(false);
    const [reviewStatus, setReviewStatus] = useState([]);
    const [showReviewStatus, setShowReviewStatus] = useState(false);
    const [projectNames, setProjectNames] = useState(projectFilterState.projectNames);
    const [projectNamesList, setProjectNamesList] = useState([]);
    const [showCaseProjectName, setShowCaseProjectName] = useState(false);
    const [spocName, setSpocName] = useState(projectFilterState.spocName);
    const [spocNameList, setSpocNameList] = useState([]);
    const [showSpocName, setShowSpocName] = useState(false);
    const [spocEmail, setSpocEmail] = useState(projectFilterState.spocEmail);
    const [spocEmailList, setSpocEmailList] = useState([]);
    const [showSpocEmail, setShowSpocEmail] = useState(false);
    const [lastUpdateBy, setLastUpdateBy] = useState([]);
    const [showLastUpdateBy, setShowLastUpdateBy] = useState(false);
    const [selectedFteCost, setSelectedFteCost] = useState({ min: "", max: "" });
    const [showFteCost, setShowFteCost] = useState(false);
    const [selectedSubconCost, setSelectedSubconCost] = useState({ min: "", max: "" });
    const [showSubCost, setShowSubCost] = useState(false);
    const [selectedTotalProjectCost, setSelectedTotalProjectCost] = useState({ min: "", max: "" });
    const [showTotalCost, setShowTotalCost] = useState(false);
    const [selectedQreFte, setSelectedQreFte] = useState({ min: "", max: "" });
    const [showQreFte, setShowQreFte] = useState(false);
    const [selectedQreSubcon, setSelectedQreSubcon] = useState({ min: "", max: "" });
    const [showQreSub, setShowQreSub] = useState(false);
    const [selectedTotalQre, setSelectedTotalQre] = useState({ min: "", max: "" });
    const [showQreTotal, setShowQreTotal] = useState(false);
    const [selectedProjectHoursFte, setSelectedProjectHoursFte] = useState({ min: "", max: "" });
    const [showFteHours, setShowFteHours] = useState(false);
    const [selectedProjectHoursSubcon, setSelectedProjectHoursSubcon] = useState({ min: "", max: "" });
    const [showSubHours, setShowSubHours] = useState(false);
    const [selectedProjectHoursTotal, setSelectedProjectHoursTotal] = useState({ min: "", max: "" });
    const [showTotalHours, setShowTotalHours] = useState(false);
    const [selectedQrePotential, setSelectedQrePotential] = useState({ min: "", max: "" });
    const [showQrePotential, setShowQrePotential] = useState(false);
    const [selectedQreAdjustment, setSelectedQreAdjustment] = useState({ min: "", max: "" });
    const [showQreAdjust, setShowQreAdjust] = useState(false);
    const [selectedQreFinal, setSelectedQreFinal] = useState({ min: "", max: "" });
    const [showQreFinal, setShowQreFinal] = useState(false);
    const [selectedQreCredits, setSelectedQreCredits] = useState({ min: "", max: "" });
    const [showQreCredits, setShowQreCredits] = useState(false);
    const [selectedDates, setSelectedDates] = useState({
        "Survey-Sent Date": { min: "", max: "", error: "" },
        "Survey-Reminder Sent Date": { min: "", max: "", error: "" },
        "Survey-Response Date": { min: "", max: "", error: "" },
        "Last Updated Date": { min: "", max: "", error: "" },
    });
    const [showSurveySentDate, setShowSurveySentDate] = useState(false);
    const [showSurveyReminderDate, setShowSurveyReminderDate] = useState(false);
    const [showSurveyResponseDate, setShowSurveyResponseDate] = useState(false);
    const [showLastUpdateDate, setShowLastUpdateDate] = useState(false);
    const [fteCostError, setFteCostError] = useState("");
    const [subconCostError, setSubconCostError] = useState("");
    const [totalProjectCostError, setTotalProjectCostError] = useState("");
    const [qreFteError, setQreFteError] = useState("");
    const [qreSubconError, setQreSubconError] = useState("");
    const [totalQreError, setTotalQreError] = useState("");
    const [projectHoursFteError, setProjectHoursFteError] = useState("");
    const [projectHoursSubconError, setProjectHoursSubconError] = useState("");
    const [projectHoursTotalError, setProjectHoursTotalError] = useState("");
    const [qrePotentialError, setQrePotentialError] = useState("");
    const [qreAdjustmentError, setQreAdjustmentError] = useState("");
    const [qreFinalError, setQreFinalError] = useState("");
    const [qreCreditsError, setQreCreditsError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [SurveySendDateError, setSurveySendDateError] = useState('');
    const [ReminderError, setReminderError] = useState('');
    const [responseError, setResponseError] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [projectsCountError3, setProjectsCountError3] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [positiveNumberError2, setPositiveNumberError2] = useState('');
    const [positiveNumberError3, setPositiveNumberError3] = useState('');
    const { clientList } = useContext(FilterListContext);
    const [showTotalExpense, setShowTotalExpense] = useState(false);
    const [showRnDExpense, setShowRnDExpense] = useState(false);
    const [showRnDPotential, setShowRnDPotential] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        // { label: 'Account' },
        // { label: 'Fiscal year' },
        { label: 'SPOC Name' },
        { label: 'SPOC Email' },
        { label: 'Data Gathering' },
        { label: 'Project Status' },
        { label: 'Survey Status' },
        { label: 'Interaction Status' },
        { label: 'Timesheet Status' },
        { label: 'Cost Status - Employee' },
        { label: 'Cost Status - Sub-Con' },
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
        { label: 'Project Hours - Sub-Con' },
        { label: 'Project Hours - Total' },
        { label: 'QRE (%) - Potential' },
        { label: 'QRE (%) - Adjustment' },
        { label: 'QRE (%) - Final' },
        { label: 'QRE Credits' },
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
    const handleFilterChange = ({ field, scale, value }) => {
        const numericValue = Number(value);
        let errorMessage = "";

        const validateDate = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime()); // Ensures the date is valid
        };

        const updateNumericField = (fieldState, setFieldState) => {
            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (fieldState?.min && numericValue <= fieldState.min) {
                        errorMessage = `The max value of ${field} should be greater than the min value of ${field}`;
                    } else {
                        errorMessage = "";
                    }
                    setFieldState({ ...fieldState, max: numericValue });
                } else if (scale === "min") {
                    if (fieldState?.max && numericValue >= fieldState.max) {
                        errorMessage = `The min value of ${field} should be less than the max value of ${field}`;
                    } else {
                        errorMessage = "";
                    }
                    setFieldState({ ...fieldState, min: numericValue });
                }
            }
        };

        const updateDateField = (field, scale, value) => {
            const isValidDate = validateDate(value);
            if (!isValidDate) {
                errorMessage = `Please enter a valid date for ${field}`;
            } else {
                setSelectedDates((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [scale]: value,
                    },
                }));
            }
        };

        switch (field) {
            case "FTE Cost":
                updateNumericField(selectedFteCost, setSelectedFteCost);
                setFteCostError(errorMessage);
                break;
            case "Subcon Cost":
                updateNumericField(selectedSubconCost, setSelectedSubconCost);
                setSubconCostError(errorMessage);
                break;
            case "Total Project Cost":
                updateNumericField(selectedTotalProjectCost, setSelectedTotalProjectCost);
                setTotalProjectCostError(errorMessage);
                break;
            case "QRE FTE":
                updateNumericField(selectedQreFte, setSelectedQreFte);
                setQreFteError(errorMessage);
                break;
            case "QRE Subcon":
                updateNumericField(selectedQreSubcon, setSelectedQreSubcon);
                setQreSubconError(errorMessage);
                break;
            case "Total QRE":
                updateNumericField(selectedTotalQre, setSelectedTotalQre);
                setTotalQreError(errorMessage);
                break;
            case "Project Hours - FTE":
                updateNumericField(selectedProjectHoursFte, setSelectedProjectHoursFte);
                setProjectHoursFteError(errorMessage);
                break;
            case "Project Hours - Sub-Con":
                updateNumericField(selectedProjectHoursSubcon, setSelectedProjectHoursSubcon);
                setProjectHoursSubconError(errorMessage);
                break;
            case "Project Hours - Total":
                updateNumericField(selectedProjectHoursTotal, setSelectedProjectHoursTotal);
                setProjectHoursTotalError(errorMessage);
                break;
            case "QRE (%) - Potential":
                updateNumericField(selectedQrePotential, setSelectedQrePotential);
                setQrePotentialError(errorMessage);
                break;
            case "QRE (%) - Adjustment":
                updateNumericField(selectedQreAdjustment, setSelectedQreAdjustment);
                setQreAdjustmentError(errorMessage);
                break;
            case "QRE (%) - Final":
                updateNumericField(selectedQreFinal, setSelectedQreFinal);
                setQreFinalError(errorMessage);
                break;
            case "QRE Credits":
                updateNumericField(selectedQreCredits, setSelectedQreCredits);
                setQreCreditsError(errorMessage);
                break;
            case "Survey-Sent Date":
                updateDateField(field, scale, value);
                setSurveySendDateError(errorMessage);
                break;
            case "Survey-Reminder Sent Date":
                updateDateField(field, scale, value);
                setReminderError(errorMessage);
                break;
            case "Survey-Response Date":
                updateDateField(field, scale, value);
                setResponseError(errorMessage);
                break;
            case "Last Updated Date":
                updateDateField(field, scale, value);
                setUpdateError(errorMessage);
                break;
            default:
                console.warn(`Unhandled field: ${field}`);
        }
    };

    const handleDateChange = (type, range) => (event) => {
        const value = event.target.value;

        // Validate that the value is a valid date
        const isValidDate = (date) => !isNaN(Date.parse(date));
        if (!isValidDate(value)) {
            setSelectedDates((prevSelectedDates) => ({
                ...prevSelectedDates,
                [`${type}Error`]: 'Invalid date format.',
            }));
            return;
        }

        setSelectedDates((prevSelectedDates) => {
            const currentTypeDates = prevSelectedDates[type];
            const newDates = { ...currentTypeDates, [range]: value };
            let errorMessage = '';

            // Validation: Ensure `min` is not greater than `max`
            if (range === 'min' && newDates.max && new Date(value) > new Date(newDates.max)) {
                errorMessage = `${type}: Start date cannot be greater than End date.`;
                return {
                    ...prevSelectedDates,
                    [`${type}Error`]: errorMessage,
                };
            }

            if (range === 'max' && newDates.min && new Date(value) < new Date(newDates.min)) {
                errorMessage = `${type}: End date cannot be earlier than Start date.`;
                return {
                    ...prevSelectedDates,
                    [`${type}Error`]: errorMessage,
                };
            }

            // Clear error if validation passes
            return {
                ...prevSelectedDates,
                [type]: newDates,
                [`${type}Error`]: '', // Clear any previous error
            };
        });
    };

    const currentData = filteredRows?.slice(
        (currentPageProjects - 1) * itemsPerPage,
        currentPageProjects * itemsPerPage
    );

    while (currentData?.length < itemsPerPage) {
        currentData?.push({});
    }

    useEffect(() => {
        const updatedCompanyId = Array.isArray(company) ? company.map(c => c.companyId) : undefined;
        const updateCaseId = caseIdList?.find((c) => c?.name === caseId)?.caseIds;
        const updatedProjectNamesId = projectNamesList?.find((proj) => proj?.caseprojectName === projectNames)?.projectNamesId;
        const updatedSpocNameId = spocNameList?.find((proj) => proj?.name === spocName)?.spocNameId;
        const updatedSpocEmailId = spocEmailList?.find((proj) => proj?.name === spocEmail)?.spocEmailId;

        setProjectFilterState(prev => ({
            ...prev,
            companyId: updatedCompanyId,
            company,
            projectNamesId: [updatedProjectNamesId],
            projectNames,
            spocNameId: [updatedSpocNameId],
            spocName,
            spocEmailId: [updatedSpocEmailId],
            spocEmail,
            caseIds: [updateCaseId],
            caseId,
        }));
    }, [company, caseId, clientList, projectNames, projectNamesList, spocName, spocEmail, spocNameList, spocEmailList]);


    const fetchProjectsList = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (detailedCase?.caseId) queryParams.append("caseId", detailedCase.caseId);
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/projects/project-filter-values${queryString ? `?${queryString}` : ""}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};

            setFilterList(data);
            setProjectNamesList(data?.projectNames || []);
            setSpocNameList(data?.spocNames || []);
            setSpocEmailList(data?.spocEmails || []);
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
            setProjectNames([]);
            setSpocName([]);
            setSpocEmail([]);
            setFiscalYear([]);
            setProjectFilterState({
                companyId: [],
                caseId: [],
                company: [],
                projectNames: [],
                spocName: [],
                spocEmail: [],
                dataGathering: [],
                fiscalYear: [],
                totalefforts: [0, null],
                rndExpense: [0, null],
                rndPotential: [0, null],
            });
            setShowCompany(false);
            setShowFiscalYear(false);
            setShowSpocName(false);
            setShowSpocEmail(false);
            setShowTotalExpense(false);
            setShowRnDExpense(false);
            setShowRnDPotential(false)
            setShowCaseProjectName(false);
        }
    }, [clearProjectFilterTrigger]);

    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.caseId?.length > 0 ||
            projectFilterState.spocName?.length > 0 ||
            projectFilterState.spocEmail?.length > 0 ||
            projectFilterState.projectNames?.length > 0 ||
            projectFilterState.totalefforts?.length > 0 ||
            projectFilterState.rndExpense?.length > 0 ||
            projectFilterState.rndPotential?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            let projectsOptions = {
                ...(projectFilterState.caseId?.length > 0 && {
                    caseId: projectFilterState.caseId,
                }),
                ...(projectFilterState.spocName?.length > 0 && {
                    spocName: projectFilterState.spocName,
                }),
                ...(projectFilterState.spocEmail?.length > 0 && {
                    spocEmail: projectFilterState.spocEmail,
                }),
                ...(projectFilterState.projectNames?.length > 0 && {
                    projectNames: projectFilterState.projectNames,
                }),
                ...(projectFilterState.totalefforts && {
                    minTotalExpense: projectFilterState.totalefforts[0],
                }),
                ...(projectFilterState.totalefforts && {
                    maxTotalExpense: projectFilterState.totalefforts[1],
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
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setCompany([]);
        setFiscalYear([]);
        setSpocName([]);
        setSpocEmail([]);
        setDataGathering([]);
        setProjectStatus([]);
        setSurveyStatus([]);
        setInteractionStatus([]);
        setTimesheetStatus([]);
        setFTECostStatus([]);
        setSubconCostStatus([]);
        setInterviewStatus([]);
        setTechSummaryStatus([]);
        setFinSummaryStatus([]);
        setReviewStatus([]);
        setLastUpdateBy([]);
        setCFormStatus([]);
        setSearchTerm('');
        setSelectedQrePotential({min: null, max: null});
        setSelectedFteCost({min: null, max: null});
        setSelectedProjectHoursFte({ min:null, max: null });
        setSelectedProjectHoursSubcon({ min:null, max: null });
        setSelectedProjectHoursTotal({ min: null, max: null });
        setSelectedQreAdjustment({ min: null, max: null });
        setSelectedQreCredits({ min: null, max: null });
        setSelectedQreFinal({ min: null, max: null });
        setSelectedQreFte({ min: null, max: null });
        setSelectedQreSubcon({ min: null, max: null });
        setSelectedSubconCost({ min: null, max: null });
        setSelectedTotalProjectCost({ min: null, max: null });
        setSelectedTotalQre({ min: null, max: null });
        // setSurveySentStartDate('');
        // setSurveySentEndDate('');
        // setSurveyReminderStartDate('');
        // setSurveyReminderEndDate('');
        // setSurveyResponseStartDate('');
        // setSurveyResponseEndDate('');
        // setLastUpdatedStartDate('');
        // setLastUpdatedEndDate('');
        setSelectedDates({
            "Survey-Sent Date": { min: "", max: "", error: "" },
            "Survey-Reminder Sent Date": { min: "", max: "", error: "" },
            "Survey-Response Date": { min: "", max: "", error: "" },
            "Last Updated Date": { min: "", max: "", error: "" },
        })
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
        // setActiveFilterCount(0);

        // fetchProjects({});
        setPositiveNumberError('');
        setPositiveNumberError2('');
        setPositiveNumberError3('');
        // setRndPotentialCountError('');
        setQreFteError("");
        setUpdateError("");
        setReminderError("");
        setResponseError("");
        setFteCostError("");
        setQreFinalError("");
        setTotalQreError("");
        setQreSubconError("");
        setQreCreditsError("");
        setSubconCostError("");
        setQrePotentialError("");
        setQreAdjustmentError("");
        setSurveySendDateError("");
        setProjectHoursFteError("");
        setTotalProjectCostError("");
        setProjectHoursTotalError("");
        setProjectHoursSubconError("");
        // setProjectsCountError2('');
        setProjectsCountError3('');
        
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        // setShowAccountingYear(false);
        setShowFiscalYear(false);
        setShowFteCost(false);
        // setShowSubconCost(false);
        setShowSubCost(false);
        // setShowTotalProjectCost(false);
        setShowTotalCost(false);
        setShowQreFte(false);
        // setShowQreSubcon(false);
        setShowQreSub(false);
        setShowQreTotal(false);
        setShowFteHours(false);
        // setShowSubconHours(false);
        setShowSubHours(false);
        setShowTotalHours(false);
        // setShowRndAdjustment(false);
        setShowQreAdjust(false);
        // setShowRndFinal(false);
        setShowQreFinal(false);
        // setShowRndCredits(false);
        setShowQreCredits(false);
        setShowRnDPotential(false);
        setShowSurveySentDate(false);
        setShowSurveyReminderDate(false);
        setShowSurveyResponseDate(false);
        // setShowLastUpdatedDate(false);
        setShowLastUpdateDate(false);
        setShowInteractionStatus(false);
        setShowDataGathering(false);
        setShowProjectStatus(false);
        setShowSurveyStatus(false);
        setShowTimesheetStatus(false);
        setShowFteCost(false);
        setShowSubCost(false);
        setShowInterviewStatus(false);
        setShowInteractionStatus(false);
        setShowFinSummaryStatus(false);
        setShowTechSummaryStatus(false);
        setShowCFormStatus(false);
        setShowReviewStatus(false);
        setShowLastUpdateBy(false);
        setShowLastUpdateDate(false);
        setShowQrePotential(false);
        // setTriggerFilter(true);
        // onApplyFilters({});
        fetchFilterProjectsList({
            ...(detailedCase?.caseId && { caseId: detailedCase?.caseId })
        });
    };

    const applyFilters = () => {
        const filters = {
            ...(detailedCase?.caseId && { caseId: detailedCase?.caseId }),
            ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
            ...(fiscalYear?.length > 0 && { fiscalYear }),
            ...(projectNames?.length > 0 && { projectNames }),
            ...(spocName?.length > 0 && { spocName }),
            ...(spocEmail?.length > 0 && { spocEmail }),
            ...(dataGathering?.length > 0 && { dataGathering }),
            ...(projectStatus?.length > 0 && { projectStatus }),
            ...(surveyStatus?.length > 0 && { surveyStatus }),
            ...(interactionStatus?.length > 0 && { interactionStatus }),
            ...(timesheetStatus?.length > 0 && { timesheetStatus }),
            ...(FTECostStatus?.length > 0 && { fteCostStatus: FTECostStatus }),
            ...(SubconCostStatus?.length > 0 && { subconCostStatus: SubconCostStatus }),
            ...(interviewStatus?.length > 0 && { technicalInterviewStatus: interviewStatus }),
            ...(techSummaryStatus?.length > 0 && { technicalSummaryStatus: techSummaryStatus }),
            ...(finSummaryStatus?.length > 0 && { financialSummaryStatus: finSummaryStatus }),
            ...(cFormStatus?.length > 0 && { claimsFormstatus: cFormStatus }),
            ...(reviewStatus?.length > 0 && { finalReviewStatus: reviewStatus }),
            ...(lastUpdateBy?.length > 0 && { lastUpdateBy: lastUpdateBy }),
            ...(selectedDates["Survey-Sent Date"]?.min && { surveySentStartDate: selectedDates["Survey-Sent Date"]?.min }),
            ...(selectedDates["Survey-Reminder Sent Date"]?.max && { surveyReminderEndDate: selectedDates["Survey-Reminder Sent Date"]?.max }),
            ...(selectedDates["Survey-Reminder Sent Date"]?.min && { surveyReminderStartDate: selectedDates["Survey-Reminder Sent Date"]?.min }),
            ...(selectedDates["Survey-Sent Date"]?.max && { surveySentEndDate: selectedDates["Survey-Sent Date"]?.max }),
            ...(selectedDates["Survey-Response Date"]?.min && { surveyResponseStartDate: selectedDates["Survey-Response Date"]?.min }),
            ...(selectedDates["Survey-Response Date"]?.max && { surveyResponseEndDate: selectedDates["Survey-Response Date"]?.max }),
            ...(selectedDates["Last Updated Date"]?.min && { lastUpdatedStartDate: selectedDates["Last Updated Date"]?.min }),
            ...(selectedDates["Last Updated Date"]?.max && { lastUpdatedEndDate: selectedDates["Last Updated Date"]?.max }),
            ...(projectFilterState.totalefforts && {
                minTotalExpense: projectFilterState.totalefforts[0],
                maxTotalExpense: projectFilterState.totalefforts[1],
            }),
            ...(projectFilterState.rndExpense && {
                minRnDExpense: projectFilterState.rndExpense[0],
                maxRnDExpense: projectFilterState.rndExpense[1],
            }),
            ...((selectedQrePotential?.min || selectedQrePotential?.max) && {
                minRnDPotential: selectedQrePotential?.min,
                maxRnDPotential: selectedQrePotential?.max,
            }),
            ...((selectedFteCost?.min || selectedFteCost?.max) && {
                minFteCost: selectedFteCost?.min,
                maxFteCost: selectedFteCost?.max
            }),
            ...((selectedSubconCost?.min || selectedSubconCost?.max) && {
                minSubconCost: selectedSubconCost?.min,
                maxSubconCost: selectedSubconCost?.max
            }),
            ...((selectedTotalProjectCost?.min || selectedTotalProjectCost?.max) && {
                minTotalProjectCost: selectedTotalProjectCost?.min,
                maxTotalProjectCost: selectedTotalProjectCost?.max
            }),
            ...((selectedQreFte?.min || selectedQreFte?.max) && {
                minQreFte: selectedQreFte?.min,
                maxQreFte: selectedQreFte?.max
            }),
            ...((selectedQreSubcon?.min || selectedQreSubcon?.max) && {
                minQreSubcon: selectedQreSubcon?.min,
                maxQreSubcon: selectedQreSubcon?.max
            }),
            ...((selectedTotalQre?.min || selectedTotalQre?.max) && {
                minQreTotal: selectedTotalQre?.min,
                maxQreTotal: selectedTotalQre?.max
            }),
            ...((selectedProjectHoursFte?.min || selectedProjectHoursFte?.max) && {
                minFteHours: selectedProjectHoursFte?.min,
                maxFteHours: selectedProjectHoursFte?.max
            }),
            ...((selectedProjectHoursSubcon?.min || selectedProjectHoursSubcon?.max) && {
                minSubconHours: selectedProjectHoursSubcon?.min,
                maxSubconHours: selectedProjectHoursSubcon?.max
            }),
            ...((selectedProjectHoursTotal?.min || selectedProjectHoursTotal?.max) && {
                minTotalHours: selectedProjectHoursTotal?.min,
                maxTotalHours: selectedProjectHoursTotal?.max
            }),
            ...((selectedQreAdjustment?.min || selectedQreAdjustment?.max) && {
                minRndAdjustment: selectedQreAdjustment?.min,
                maxRndAdjustment: selectedQreAdjustment?.max
            }),
            ...((selectedQreFinal?.min || selectedQreFinal?.max) && {
                minRndFinal: selectedQreFinal?.min,
                maxRndFinal: selectedQreFinal?.max
            }),
            ...((selectedQreCredits?.min || selectedQreCredits?.max) && {
                minRndCredits: selectedQreCredits?.min,
                maxRndCredits: selectedQreCredits?.max
            })
        };
        fetchFilterProjectsList(filters);
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
                <Box sx={styles.header}>
                    <Typography sx={styles.title}>
                        Project Filter
                    </Typography>
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
                                                                    : field.label === 'Fiscal year'
                                                                        ? showFiscalYear
                                                                        : field.label === "SPOC Name"
                                                                            ? showSpocName
                                                                            : field.label === "SPOC Email"
                                                                                ? showSpocEmail
                                                                                : field.label === 'Data Gathering'
                                                                                    ? showDataGathering
                                                                                    : field.label === 'Project Status'
                                                                                        ? showProjectStatus
                                                                                        : field.label === 'Survey Status'
                                                                                            ? showSurveyStatus
                                                                                            : field.label === 'Interaction Status'
                                                                                                ? showInteractionStatus
                                                                                                : field.label === 'Timesheet Status'
                                                                                                    ? showTimesheetStatus
                                                                                                    : field.label === "Cost Status - Employee"
                                                                                                        ? showFteCostStatus
                                                                                                        : field.label === "Cost Status - Sub-Con"
                                                                                                            ? showSubconCostStatus
                                                                                                            : field.label === "Technical Interview Status"
                                                                                                                ? showInterviewStatus
                                                                                                                : field.label === "Technical Summary Status"
                                                                                                                    ? showTechSummaryStatus
                                                                                                                    : field.label === "Financial Summary Status"
                                                                                                                        ? showFinSummaryStatus
                                                                                                                        : field.label === "Claims Form Status"
                                                                                                                            ? showCFormStatus
                                                                                                                            : field.label === "Final Review Status"
                                                                                                                                ? showReviewStatus
                                                                                                                                : field.label === "Last Updated By"
                                                                                                                                    ? showLastUpdateBy
                                                                                                                                    : field.label === "FTE Cost"
                                                                                                                                        ? showFteCost
                                                                                                                                        : field.label === "Subcon Cost"
                                                                                                                                            ? showSubCost
                                                                                                                                            : field.label === "Total Project Cost"
                                                                                                                                                ? showTotalCost
                                                                                                                                                : field.label === "QRE FTE"
                                                                                                                                                    ? showQreFte
                                                                                                                                                    : field.label === "QRE Subcon"
                                                                                                                                                        ? showQreSub
                                                                                                                                                        : field.label === "Total QRE"
                                                                                                                                                            ? showQreTotal
                                                                                                                                                            : field.label === "Project Hours - FTE"
                                                                                                                                                                ? showFteHours
                                                                                                                                                                : field.label === "Project Hours - Sub-Con"
                                                                                                                                                                    ? showSubHours
                                                                                                                                                                    : field.label === "Project Hours - Total"
                                                                                                                                                                        ? showTotalHours
                                                                                                                                                                        : field.label === "QRE (%) - Potential"
                                                                                                                                                                            ? showQrePotential
                                                                                                                                                                            : field.label === "QRE (%) - Adjustment"
                                                                                                                                                                                ? showQreAdjust
                                                                                                                                                                                : field.label === "QRE (%) - Final"
                                                                                                                                                                                    ? showQreFinal
                                                                                                                                                                                    : field.label === "QRE Credits"
                                                                                                                                                                                        ? showQreCredits
                                                                                                                                                                                        : field.label === "Survey-Sent Date"
                                                                                                                                                                                            ? showSurveySentDate
                                                                                                                                                                                            : field.label === "Survey-Reminder Sent Date"
                                                                                                                                                                                                ? showSurveyReminderDate
                                                                                                                                                                                                : field.label === "Survey-Response Date"
                                                                                                                                                                                                    ? showSurveyResponseDate
                                                                                                                                                                                                    : field.label === "Last Updated Date"
                                                                                                                                                                                                        ? showLastUpdateDate
                                                                                                                                                                                                        : field.label === "Total Expense"
                                                                                                                                                                                                            ? showTotalExpense
                                                                                                                                                                                                            : field.label === "R&D Expense"
                                                                                                                                                                                                                ? showRnDExpense
                                                                                                                                                                                                                : field.label === "R&D Potential"
                                                                                                                                                                                                                    ? showRnDPotential
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
                                                                } else if (field.label === 'Fiscal year') {

                                                                    if (e.target.checked) {
                                                                        setShowFiscalYear(true);
                                                                    } else {
                                                                        setShowFiscalYear(false);
                                                                        setFiscalYear([]);
                                                                    }
                                                                } else if (field.label === "Project Name") {
                                                                    if (e.target.checked) {
                                                                        setShowCaseProjectName(true);
                                                                    } else {
                                                                        setShowCaseProjectName(false);
                                                                        setProjectNames([]);
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
                                                                } else if (field.label === 'Data Gathering') {
                                                                    if (e.target.checked) {
                                                                        setShowDataGathering(true);
                                                                    } else {
                                                                        setShowDataGathering(false);
                                                                        setDataGathering([]);
                                                                    }
                                                                } else if (field.label === 'Project Status') {
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
                                                                } else if (field.label === "Interaction Status") {
                                                                    if (e.target.checked) {
                                                                        setShowInteractionStatus(true);
                                                                    } else {
                                                                        setShowInteractionStatus(false);
                                                                        setInteractionStatus([]);
                                                                    }
                                                                } else if (field.label === "Timesheet Status") {
                                                                    if (e.target.checked) {
                                                                        setShowTimesheetStatus(true);
                                                                    } else {
                                                                        setShowTimesheetStatus(false);
                                                                        setTimesheetStatus([]);
                                                                    }
                                                                } else if (field.label === "Cost Status - Employee") {
                                                                    if (e.target.checked) {
                                                                        setShowFteCostStatus(true);
                                                                    } else {
                                                                        setShowFteCostStatus(false);
                                                                        setFTECostStatus([]);
                                                                    }
                                                                } else if (field.label === "Cost Status - Sub-Con") {
                                                                    if (e.target.checked) {
                                                                        setShowSubconCostStatus(true);
                                                                    } else {
                                                                        setShowSubconCostStatus(false);
                                                                        setSubconCostStatus([]);
                                                                    }
                                                                } else if (field.label === "Technical Interview Status") {
                                                                    if (e.target.checked) {
                                                                        setShowInterviewStatus(true);
                                                                    } else {
                                                                        setShowInterviewStatus(false);
                                                                        setInterviewStatus([]);
                                                                    }
                                                                } else if (field.label === "Technical Summary Status") {
                                                                    if (e.target.checked) {
                                                                        setShowTechSummaryStatus(true);
                                                                    } else {
                                                                        setShowTechSummaryStatus(false);
                                                                        setTechSummaryStatus([]);
                                                                    }
                                                                } else if (field.label === "Financial Summary Status") {
                                                                    if (e.target.checked) {
                                                                        setShowFinSummaryStatus(true);
                                                                    } else {
                                                                        setShowFinSummaryStatus(false);
                                                                        setFinSummaryStatus([]);
                                                                    }
                                                                } else if (field.label === "Claims Form Status") {
                                                                    if (e.target.checked) {
                                                                        setShowCFormStatus(true);
                                                                    } else {
                                                                        setShowCFormStatus(false);
                                                                        setCFormStatus([]);
                                                                    }
                                                                } else if (field.label === "Final Review Status") {
                                                                    if (e.target.checked) {
                                                                        setShowReviewStatus(true);
                                                                    } else {
                                                                        setShowReviewStatus(false);
                                                                        setReviewStatus([]);
                                                                    }
                                                                } else if (field.label === "Last Updated By") {
                                                                    if (e.target.checked) {
                                                                        setShowLastUpdateBy(true);
                                                                    } else {
                                                                        setShowLastUpdateBy(false);
                                                                        setLastUpdateBy([]);
                                                                    }
                                                                } else if (field.label === "FTE Cost") {
                                                                    if (e.target.checked) {
                                                                        setShowFteCost(true);
                                                                    } else {
                                                                        setShowFteCost(false);
                                                                        setSelectedFteCost({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Subcon Cost") {
                                                                    if (e.target.checked) {
                                                                        setShowSubCost(true);
                                                                    } else {
                                                                        setShowSubCost(false);
                                                                        setSelectedSubconCost({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Total Project Cost") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalCost(true);
                                                                    } else {
                                                                        setShowTotalCost(false);
                                                                        setSelectedTotalProjectCost({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE FTE") {
                                                                    if (e.target.checked) {
                                                                        setShowQreFte(true);
                                                                    } else {
                                                                        setShowQreFte(false);
                                                                        setSelectedQreFte({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE Subcon") {
                                                                    if (e.target.checked) {
                                                                        setShowQreSub(true);
                                                                    } else {
                                                                        setShowQreSub(false);
                                                                        setSelectedQreSubcon({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Total QRE") {
                                                                    if (e.target.checked) {
                                                                        setShowQreTotal(true);
                                                                    } else {
                                                                        setShowQreTotal(false);
                                                                        setSelectedTotalQre({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Project Hours - FTE") {
                                                                    if (e.target.checked) {
                                                                        setShowFteHours(true);
                                                                    } else {
                                                                        setShowFteHours(false);
                                                                        setSelectedProjectHoursFte({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Project Hours - Sub-Con") {
                                                                    if (e.target.checked) {
                                                                        setShowSubHours(true);
                                                                    } else {
                                                                        setShowSubHours(false);
                                                                        setSelectedProjectHoursSubcon({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Project Hours - Total") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalHours(true);
                                                                    } else {
                                                                        setShowTotalHours(false);
                                                                        setSelectedProjectHoursTotal({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE (%) - Potential") {
                                                                    if (e.target.checked) {
                                                                        setShowQrePotential(true);
                                                                    } else {
                                                                        setShowQrePotential(false);
                                                                        setSelectedQrePotential({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE (%) - Adjustment") {
                                                                    if (e.target.checked) {
                                                                        setShowQreAdjust(true);
                                                                    } else {
                                                                        setShowQreAdjust(false);
                                                                        setSelectedQreAdjustment({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE (%) - Final") {
                                                                    if (e.target.checked) {
                                                                        setShowQreFinal(true);
                                                                    } else {
                                                                        setShowQreFinal(false);
                                                                        setSelectedQreFinal({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE Credits") {
                                                                    if (e.target.checked) {
                                                                        setShowQreCredits(true);
                                                                    } else {
                                                                        setShowQreCredits(false);
                                                                        setSelectedQreCredits({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Survey-Sent Date") {
                                                                    if (e.target.checked) {
                                                                        setShowSurveySentDate(true);
                                                                    } else {
                                                                        setShowSurveySentDate(false);
                                                                        setSelectedDates({
                                                                            "Survey-Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Reminder Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Response Date": { min: "", max: "", error: "" },
                                                                            "Last Updated Date": { min: "", max: "", error: "" },
                                                                        });
                                                                    }
                                                                } else if (field.label === "Survey-Reminder Sent Date") {
                                                                    if (e.target.checked) {
                                                                        setShowSurveyReminderDate(true);
                                                                    } else {
                                                                        setShowSurveyReminderDate(false);
                                                                        setSelectedDates({
                                                                            "Survey-Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Reminder Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Response Date": { min: "", max: "", error: "" },
                                                                            "Last Updated Date": { min: "", max: "", error: "" },
                                                                        });
                                                                    }
                                                                } else if (field.label === "Survey-Response Date") {
                                                                    if (e.target.checked) {
                                                                        setShowSurveyResponseDate(true);
                                                                    } else {
                                                                        setShowSurveyResponseDate(false);
                                                                        setSelectedDates({
                                                                            "Survey-Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Reminder Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Response Date": { min: "", max: "", error: "" },
                                                                            "Last Updated Date": { min: "", max: "", error: "" },
                                                                        });
                                                                    }
                                                                } else if (field.label === "Last Updated Date") {
                                                                    if (e.target.checked) {
                                                                        setShowLastUpdateDate(true);
                                                                    } else {
                                                                        setShowLastUpdateDate(false);
                                                                        setSelectedDates({
                                                                            "Survey-Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Reminder Sent Date": { min: "", max: "", error: "" },
                                                                            "Survey-Response Date": { min: "", max: "", error: "" },
                                                                            "Last Updated Date": { min: "", max: "", error: "" },
                                                                        });
                                                                    }
                                                                } else if (field.label === "Total Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalExpense(true);
                                                                    } else {
                                                                        setShowTotalExpense(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            totalefforts: [0, null],
                                                                        }));
                                                                    }
                                                                } else if (field.label === "QRE Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowRnDExpense(true);
                                                                    } else {
                                                                        setShowRnDExpense(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            rndExpense: [0, null],
                                                                        }));
                                                                    }
                                                                } else if (field.label === "QRE Potential") {
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
                                            {field.label === 'Project Name' && (
                                                <Collapse in={showCaseProjectName}>
                                                    <ProjectSelector
                                                        projectNames={projectNames}
                                                        projectNamesList={projectNamesList}
                                                        setProjectNames={setProjectNames} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Fiscal year' && (
                                                <>
                                                    <Collapse in={showFiscalYear}>
                                                        <PrimaryContactsFilter primaryContactsList={filterList?.fiscalYears} primaryContacts={fiscalYear} setPrimaryContacts={setFiscalYear} />
                                                    </Collapse>
                                                </>
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
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_data_gathering} primaryContacts={dataGathering} setPrimaryContacts={setDataGathering} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Project Status' && (
                                                <Collapse in={showProjectStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_project_status} primaryContacts={projectStatus} setPrimaryContacts={setProjectStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Survey Status" && (
                                                <Collapse in={showSurveyStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.surveyStatuses} primaryContacts={surveyStatus} setPrimaryContacts={setSurveyStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Interaction Status" && (
                                                <Collapse in={showInteractionStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_interaction_status} primaryContacts={interactionStatus} setPrimaryContacts={setInteractionStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Timesheet Status" && (
                                                <Collapse in={showTimesheetStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_timesheet_status} primaryContacts={timesheetStatus} setPrimaryContacts={setTimesheetStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Cost Status - Employee" && (
                                                <Collapse in={showFteCostStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_fte_cost_status} primaryContacts={FTECostStatus} setPrimaryContacts={setFTECostStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Cost Status - Sub-Con" && (
                                                <Collapse in={showSubconCostStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_subcon_cost_status} primaryContacts={SubconCostStatus} setPrimaryContacts={setSubconCostStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Technical Interview Status" && (
                                                <Collapse in={showInterviewStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_technical_interview_status} primaryContacts={interviewStatus} setPrimaryContacts={setInterviewStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Technical Summary Status" && (
                                                <Collapse in={showTechSummaryStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_technical_summary_status} primaryContacts={techSummaryStatus} setPrimaryContacts={setTechSummaryStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Financial Summary Status" && (
                                                <Collapse in={showFinSummaryStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_financial_summary_status} primaryContacts={finSummaryStatus} setPrimaryContacts={setFinSummaryStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Claims Form Status" && (
                                                <Collapse in={showCFormStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_claims_form_status} primaryContacts={cFormStatus} setPrimaryContacts={setCFormStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Final Review Status" && (
                                                <Collapse in={showReviewStatus}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.s_final_review_status} primaryContacts={reviewStatus} setPrimaryContacts={setReviewStatus} />
                                                </Collapse>
                                            )}
                                            {field.label === "Last Updated By" && (
                                                <Collapse in={showLastUpdateBy}>
                                                    <PrimaryContactsFilter primaryContactsList={filterList?.lastUpdatedBys} primaryContacts={lastUpdateBy} setPrimaryContacts={setLastUpdateBy} />
                                                </Collapse>
                                            )}
                                            {field.label === "FTE Cost" && (
                                                <Collapse in={showFteCost}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedFteCost.min} maxValue={selectedFteCost.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={fteCostError} field={"FTE Cost"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Subcon Cost" && (
                                                <Collapse in={showSubCost}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedSubconCost.min} maxValue={selectedSubconCost.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={subconCostError} field={"Subcon Cost"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Total Project Cost" && (
                                                <Collapse in={showTotalCost}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedTotalProjectCost?.min} maxValue={selectedTotalProjectCost?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={totalProjectCostError} field={"Total Project Cost"} />
                                                </Collapse>
                                            )}
                                            {field.label === "QRE FTE" && (
                                                <Collapse in={showQreFte}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedQreFte?.min} maxValue={selectedQreFte?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={qreFteError} field={"QRE FTE"} />
                                                </Collapse>
                                            )}
                                            {field.label === "QRE Subcon" && (
                                                <Collapse in={showQreSub}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedQreSubcon?.min} maxValue={selectedQreSubcon?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={qreSubconError} field={"QRE Subcon"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Total QRE" && (
                                                <Collapse in={showQreTotal}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedTotalQre?.min} maxValue={selectedTotalQre?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={totalQreError} field={"Total QRE"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Project Hours - FTE" && (
                                                <Collapse in={showFteHours}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedProjectHoursFte?.min} maxValue={selectedProjectHoursFte?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={projectHoursFteError} field={"Project Hours - FTE"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Project Hours - Sub-Con" && (
                                                <Collapse in={showSubHours}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedProjectHoursSubcon?.min} maxValue={selectedProjectHoursSubcon?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={projectHoursSubconError} field={"Project Hours - Sub-Con"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Project Hours - Total" && (
                                                <Collapse in={showTotalHours}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedProjectHoursTotal?.min} maxValue={selectedProjectHoursTotal?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={projectHoursTotalError} field={"Project Hours - Total"} />
                                                </Collapse>
                                            )}
                                            {field.label === "QRE (%) - Potential" && (
                                                <Collapse in={showQrePotential}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedQrePotential?.min} maxValue={selectedQrePotential?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={qrePotentialError} field={"QRE (%) - Potential"} />
                                                </Collapse>
                                            )}
                                            {field.label === "QRE (%) - Adjustment" && (
                                                <Collapse in={showQreAdjust}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedQreAdjustment?.min} maxValue={selectedQreAdjustment?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={qreAdjustmentError} field={"QRE (%) - Adjustment"} />
                                                </Collapse>
                                            )}
                                            {field.label === "QRE (%) - Final" && (
                                                <Collapse in={showQreFinal}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedQreFinal?.min} maxValue={selectedQreFinal?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={qreFinalError} field={"QRE (%) - Final"} />
                                                </Collapse>
                                            )}
                                            {field.label === "QRE Credits" && (
                                                <Collapse in={showQreCredits}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedQreCredits?.min} maxValue={selectedQreCredits?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={qreCreditsError} field={"QRE Credits"} />
                                                </Collapse>
                                            )}
                                            {field.label === "Survey-Sent Date" && (
                                                <Collapse in={showSurveySentDate}>
                                                    <DateFilterComponent sentStartDate={selectedDates["Survey-Sent Date"]?.min} sentEndDate={selectedDates["Survey-Sent Date"]?.max} handleDateChange={handleDateChange} startLabel="Survey-Sent Date" endLabel="Survey-Sent Date" dateError={SurveySendDateError} />
                                                </Collapse>
                                            )}
                                            {field.label === "Survey-Reminder Sent Date" && (
                                                <Collapse in={showSurveyReminderDate}>
                                                    <DateFilterComponent sentStartDate={selectedDates["Survey-Reminder Sent Date"]?.min} sentEndDate={selectedDates["Survey-Reminder Sent Date"]?.max} handleDateChange={handleDateChange} startLabel="Survey-Reminder Sent Date" endLabel={"Survey-Reminder Sent Date"} dateError={selectedDates["Survey-Reminder Sent Date"].error} />
                                                </Collapse>
                                            )}
                                            {field.label === "Survey-Response Date" && (
                                                <Collapse in={showSurveyResponseDate}>
                                                    <DateFilterComponent sentStartDate={selectedDates["Survey-Response Date"]?.min} sentEndDate={selectedDates["Survey-Response Date"]?.max} handleDateChange={handleDateChange} startLabel={"Survey-Response Date"} endLabel={"Survey-Response Date"} dateError={selectedDates["Survey-Response Date"]?.error} />
                                                </Collapse>
                                            )}
                                            {field.label === "Last Updated Date" && (
                                                <Collapse in={showLastUpdateDate}>
                                                    <DateFilterComponent sentStartDate={selectedDates["Last Updated Date"]?.min} sentEndDate={selectedDates["Last Updated Date"]?.max} handleDateChange={handleDateChange} startLabel={"Last Updated Date"} endLabel={"Last Updated Date"} dateError={selectedDates["Last Updated Date"]?.error} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Total Expense' && (
                                                <Collapse in={showTotalExpense}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalefforts) ? projectFilterState.totalefforts[0] : ''}
                                                            onChange={handleFilterChange({ field: "totalefforts", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
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
                                                            value={Array.isArray(projectFilterState?.totalefforts) ? projectFilterState.totalefforts[1] : ''}
                                                            onChange={handleFilterChange({ field: "totalefforts", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>

                                                </Collapse>
                                            )}
                                            {field.label === 'QRE Expense' && (
                                                <Collapse in={showRnDExpense}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.rndExpense) ? projectFilterState.rndExpense[0] : ''}
                                                            onChange={handleFilterChange({ field: "rndExpense", scale: "min" })}
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
                                                            value={Array.isArray(projectFilterState?.rndExpense) ? projectFilterState.rndExpense[1] : ''}
                                                            onChange={handleFilterChange({ field: "rndExpense", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>
                                                    {/* {projectsCountError2 && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError2}
                                                        </Typography>
                                                    )} */}
                                                </Collapse>
                                            )}
                                            {field.label === 'QRE Potential' && (
                                                <Collapse in={showRnDPotential}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.rndPotential) ? projectFilterState.rndPotential[0] : ''}
                                                            onChange={handleFilterChange({ field: "rndPotential", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
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
                                                            value={Array.isArray(projectFilterState?.rndPotential) ? projectFilterState.rndPotential[1] : ''}
                                                            onChange={handleFilterChange({ field: "rndPotential", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>
                                                    {projectsCountError3 && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError3}
                                                        </Typography>
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

export default CaseProjectFilters;

