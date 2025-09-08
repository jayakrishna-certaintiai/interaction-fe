import {
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import CaseInfoboxHeader from "../../components/Cases/CasesInfoboxHeader";
import CaseInfoboxTable from "../../components/Cases/CasesInfoboxTable";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { CaseContext } from "../../context/CaseContext";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
// import CaseProjectsTab from "../../components/Cases/ProjectsTab/CaseProjectsTab";
import CaseSurveysQuestionDetails from "../../components/Cases/CaseSurveysQuestionDetails";
import CaseSurveysTab from "../../components/Cases/surveysTab/CaseSurveysTab";
import TechnicalSummary from "../../components/Cases/TechnicalSummaryTab/TechnicalSummary";
import Interaction from "../../components/Cases/IneractionTab/Interaction"
import CaseProjectsTab from "../../components/Cases/ProjectsTab/CaseProjectsTab";
import { useLocation } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import toast from "react-hot-toast";
import ProjectTeam from "../../components/Cases/Projects Team/ProjectTeam";

function CaseDetails() {
  const { pinnedObject } = usePinnedData();
  const { detailedCase, getCaseOnLanding, getCaseById, handleSelectedCase } = useContext(CaseContext);
  const [data, setData] = useState(null);
  const { fetchUserDetails } = useContext(FilterListContext);
  const [selectedTab, setSelectedTab] = useState("Details");
  const [showSurveysListing, setShowSurveysListing] = React.useState("true");
  const [selectedSurveyId, setSelectedSurveyId] = React.useState(null);
  const [selectedSummaryId, setSelectedSummaryId] = React.useState(null);
  const { getProjects, projectFilterState } = useContext(ProjectContext);

  const handleSelectedSummaryId = (id) => {
    setSelectedSummaryId(id);
  }
  const [reminderStatusId, setReminderStatusId] = React.useState(null);
  const handleSelectedSurveyId = (id) => {
    setSelectedSurveyId(id);
  };
  const [pinStates, setPinStates] = useState({
    "All Cases": false,
    "Recently Viewed": false,
  });
  const [currencySymbol, setCurrencySymbol] = useState();
  const [currency, setCurrency] = useState();
  const location = useLocation();

  const arr = [
    { name: "Projects", isAuth: useHasAccessToFeature("F035", "P000000003") },
    { name: "Surveys", isAuth: useHasAccessToFeature("F035", "P000000003") },
    { name: "Technical Summary", isAuth: useHasAccessToFeature("F035", "P000000003") },
    { name: "Project Interactions", isAuth: useHasAccessToFeature("F035", "P000000003") },
    { name: "Projects Team", isAuth: useHasAccessToFeature("F035", "P000000003") },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const caseId = params.get("caseId");

    if (caseId) {
      getCaseById(caseId).then((caseData) => {
        if (caseData) {
          handleSelectedCase(caseData);
        }
      });
    }
  }, [location.search]);

  useEffect(() => {
    setSelectedTab("Projects");
  }, [localStorage?.getItem("keys")]);

  const handleShowSurveyDetails = () => {
    setShowSurveysListing(!showSurveysListing);
  };


  useEffect(() => {
    getCaseOnLanding();
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const codePoint = parseInt(detailedCase?.currencySymbol, 16);
    const symbol = String.fromCharCode(codePoint);
    setCurrencySymbol(symbol);
    setCurrency(detailedCase?.currency);
  }, [detailedCase]);

  const isDownload = useHasAccessToFeature("F018", "P000000006");
  const isReUpload = useHasAccessToFeature("F018", "P000000002");

  useEffect(() => {
    const updatedPinStates = {
      "All Cases": pinnedObject.CASES === "ALL",
      "Recently Viewed": pinnedObject.CASES === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.CASES]);

  const getReminderStatusId = (id) => {
    setReminderStatusId(id);
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      CASES: newState,
    };
    const pinString = Object.entries(newPinnedObject)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");
    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ pin: pinString }),
    };
    try {
      const response = await axios.request(config);

      fetchUserDetails();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Cases" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const appliedFilters = {
    Clients: projectFilterState.company,
    Projects: projectFilterState.project,
    AccountingYear: projectFilterState.accYear,
    SpocName: projectFilterState.spocName,
    SpocEmail: projectFilterState.SpocEmail,
    MinTotalExpense: projectFilterState.totalefforts ? projectFilterState.totalefforts[0] : null,
    MaxTotalExpense: projectFilterState.totalefforts ? projectFilterState.totalefforts[1] : null,
    MinRnDExpense: projectFilterState.rndExpense ? projectFilterState.rndExpense[0] : null,
    MaxRnDExpense: projectFilterState.rndExpense ? projectFilterState.rndExpense[1] : null,
    MinRnDPotential: projectFilterState.rndPotential ? projectFilterState.rndPotential[0] : null,
    MaxRnDPotential: projectFilterState.rndPotential ? projectFilterState.rndPotential[1] : null,
  };

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      getProjects(filters);
    } else {
      toast.error("Please select at least one filter.");
    }
  };


  return (
    <>
      <Box
        sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 1 }}
      >
        <Box
          sx={{
            width: "110%",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          }}
        >
          <Paper
            sx={{
              boxShadow: "0px 3px 6px #0000001F",
              borderRadius: "20px",
              mb: 0,
            }}
          >
            <CaseInfoboxHeader
              head={data?.timesheetIdentifier}
              data={data}
              downloadPermission={isDownload}
              uploadPermission={isReUpload}
            />
            <CaseInfoboxTable info={data} currencySymbol={currencySymbol} currency={currency} />
          </Paper>
          <Box sx={{ display: "flex", gap: "20px", mb: 1, mt: 1 }}>
            <Paper
              sx={{
                borderRadius: "20px",
                width: "100%",
                boxShadow: "0px 3px 6px #0000001F",
              }}
            >
              <MainPanelHeader
                arr={arr}
                first={arr[0]?.name}
                onSelectedChange={handleSelectedTab}
                page={"survey-details"}
              />
              {useHasAccessToFeature("F035", "P000000003") &&
                selectedTab === "Projects" && (
                  <CaseProjectsTab company={detailedCase?.companyId} currencySymbol={currencySymbol} currency={currency} />
                )}
              {useHasAccessToFeature("F035", "P000000003") &&
                selectedTab === "Technical Summary" && (
                  <TechnicalSummary usedfor={'case'}
                    caseId={detailedCase?.caseId}
                    onApplyFilters={applyFiltersAndFetch}
                    appliedFilters={appliedFilters} />
                )}
              {useHasAccessToFeature("F035", "P000000003") &&
                selectedTab === "Project Interactions" && (
                  <Interaction usedfor={'case'}
                    caseId={detailedCase?.caseId}
                    onApplyFilters={applyFiltersAndFetch}
                    appliedFilters={appliedFilters}
                  />
                )}
              {selectedTab === "Surveys" && (
                showSurveysListing ?
                  <CaseSurveysTab handleShowSurveyDetails={handleShowSurveyDetails} handleSelectedSurveyId={handleSelectedSurveyId} getReminderStatusId={getReminderStatusId} company={detailedCase?.companyId} /> :
                  <CaseSurveysQuestionDetails handleShowSurveyDetails={handleShowSurveyDetails} selectedSurveyId={selectedSurveyId} reminderStatusId={reminderStatusId} />
              )}
              {useHasAccessToFeature("F035", "P000000003") && 
              selectedTab === "Projects Team" && (
                <ProjectTeam caseId={detailedCase?.caseId} />
              )}
            </Paper>
          </Box>
        </Box>
      </Box>


    </>
  );
}

export default CaseDetails;