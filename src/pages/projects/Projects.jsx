import { Box, Paper } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import BarChart from "../../components/Common/BarChart";
import ProjectsTableStack from "../../components/Projects/ProjectsTableStack";
import { BaseURL } from "../../constants/Baseurl";
import { ProjectContext } from "../../context/ProjectContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from 'react-router-dom';
import {
  DiffBwDays,
  createObjectFromArray,
} from "../../utils/helper/DiffBwDays";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import {
  getMonthYear,
  getTimeDifference,
} from "../../utils/helper/UpdateTimeDifference";
import { Authorization_header } from "../../utils/helper/Constant";
import { SheetsContext, projectsSheets } from "../../context/SheetsContext";

const chartPaperStyle = {
  p: 1,
  flex: 1,
  borderRadius: "20px",
  height: "300px",
  boxShadow: "0px 3px 6px #0000001F",
};

const layoutBoxStyle = {
  width: "98%",
  mx: "auto",
  display: "flex",
  mt: 2,
  gap: "20px",
};

function Projects(page) {
  const location = useLocation();
  const { projects, fetchProjects, projectFilterState, setIsProjectFilterApplied, currentState, setCurrentState, loading, projectId, fetchDropdown, } = useContext(ProjectContext);
  const [projectRnD, setProjectRnd] = useState(null);
  const [projectTtc, setProjectTtc] = useState(null);
  const [projectUnc, setProjectUnc] = useState(null);
  const [rndPercentages, setRndPercentages] = useState(null);
  const [ttc, setTtc] = useState(null);
  const [uncertainHours, setUncertainHours] = useState(null);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [labelObj, setLabelObj] = useState(null);
  const { fetchProjectsSheets, projectsSheets } = useContext(SheetsContext);
  const [selectedTab, setSelectedTab] = useState("");

  const fetchProjectKPIData = async () => {
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/projects/${localStorage.getItem(
          "userid"
        )}/1/projects-kpi`, Authorization_header()
      );
      setProjectRnd(response1.data.data?.rndPercent?.projectName);
      setRndPercentages(response1.data.data?.rndPercent?.rndPercentage);
      setProjectTtc(response1.data.data?.ttc?.projectName);
      setTtc(response1.data.data?.ttc?.ttc);
      setProjectUnc(response1.data.data?.uncertainHours?.projectName);
      setUncertainHours(response1.data.data?.uncertainHours?.uncertainHours);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // fetchProjectKPIData();
    setCurrentState(
      // (pinnedObject && pinnedObject?.CLNT === "RV" ? "Recently Viewed" : "All Accounts")
      (pinnedObject) => {
        if (pinnedObject && pinnedObject?.CLNT && pinnedObject?.CLNT === "RV") {
          return "Recently Viewed";
        } else {
          return "All Projects";
        }
      }
    );
  }, [Authorization_header]);

  const appliedFilters = {
    Clients: projectFilterState.company,
    Projects: projectFilterState.project,
    AccountingYear: projectFilterState.accYear,
    SpocName: projectFilterState.spocName,
    SpocEmail: projectFilterState.SpocEmail,
    MinTotalExpense: projectFilterState.totalExpense ? projectFilterState.totalExpense[0] : null,
    MaxTotalExpense: projectFilterState.totalExpense ? projectFilterState.totalExpense[1] : null,
    MinRnDExpense: projectFilterState.rndExpense ? projectFilterState.rndExpense[0] : null,
    MaxRnDExpense: projectFilterState.rndExpense ? projectFilterState.rndExpense[1] : null,
    MinRnDPotential: projectFilterState.rndPotential ? projectFilterState.rndPotential[0] : null,
    MaxRnDPotential: projectFilterState.rndPotential ? projectFilterState.rndPotential[1] : null,
    MinFteCost: projectFilterState.s_fte_cost ? projectFilterState.s_fte_cost[0] : null,
    MaxFteCost: projectFilterState.s_fte_cost ? projectFilterState.s_fte_cost[1] : null,
    MinSubconCost: projectFilterState.s_subcon_cost ? projectFilterState.s_subcon_cost[0] : null,
    MaxSubconCost: projectFilterState.s_subcon_cost ? projectFilterState.s_subcon_cost[1] : null,
    MinTotalProjectCost: projectFilterState.s_total_project_cost ? projectFilterState.s_total_project_cost[0] : null,
    MaxTotalProjectCost: projectFilterState.s_total_project_cost ? projectFilterState.s_total_project_cost[1] : null,
  };
  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchProjects(filters);
      fetchDropdown();
    } else {
      toast.error("Please select at least one filter.");
    }
  };
  const getSelectedTab = (tabName) => {
    setSelectedTab(tabName);
  }

  useEffect(() => {
    if (selectedTab === "All Projects") {
      const queryParams = new URLSearchParams(location.search);
      const companyId = queryParams.get("companyId");
      let options = {};
      const savedFilters = localStorage.getItem("projectFilters");
      if (savedFilters) {
        options = JSON.parse(savedFilters);
      } else if (companyId) {
        options = { companyId: [companyId] };
      }
      fetchProjects(options);
    } else if (selectedTab === "Uploaded Sheets") {
      fetchProjectsSheets();
    }
  }, [Authorization_header, selectedTab]);


  useEffect(() => {
    // fetchProjectKPIData();
  }, [Authorization_header]);

  useEffect(() => {
    const timeDifference = getTimeDifference(projects, "modifiedTime");
    setLatestUpdateTime(timeDifference);
  }, [projects, Authorization_header]);
  useEffect(() => {
    const timeDifference = getTimeDifference(projectId, "modifiedTime");
    setLatestUpdateTime(timeDifference);
  }, [projectId, Authorization_header]);

  useEffect(() => {
    setLabelObj(
      createObjectFromArray(
        DiffBwDays(ttc),
        ttc?.map((item) => getMonthYear(item))
      )
    );
  }, [ttc, Authorization_header]);

  const customLabel1 = {
    rotation: 0,
    format: "{text}%",
    overflow: "justify",
  };
  const customLabel2 = {
    rotation: 0,
    format: "{text}",
    overflow: "justify",
  };

  const customLabel3 = {
    rotation: 0,
    format: "{text}",
    overflow: "justify",
  };

  return (
    <>
      {useHasAccessToFeature("F013", "P000000008") && (
        <Paper
          sx={{
            width: "98.5%",
            mx: "auto",
            mt: 1,
            borderRadius: "10px",
            borderBottomRadius: "20px",
            mb: 3,
            boxShadow: "0px 3px 6px #0000001F",
          }}
        >
          <ProjectsTableStack
            loading={loading}
            latestUpdateTime={latestUpdateTime?.difference}
            getSelectedTab={getSelectedTab}
            projectsSheets={projectsSheets}
            onApplyFilters={applyFiltersAndFetch}
            appliedFilters={appliedFilters}
            projectId={projectId}
            page="projects"
          />
        </Paper>
      )}
    </>
  );
}

export default Projects;
