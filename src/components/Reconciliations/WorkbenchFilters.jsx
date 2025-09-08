import { Box } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { WorkbenchContext } from "../../context/WorkbenchContext";
import CompanySelector from "../FilterComponents/CompanySelector";
import MonthSelector from "../FilterComponents/MonthSelector.";
import ProjectSelector from "../FilterComponents/ProjectSelector";
import TimesheetSelector from "../FilterComponents/TimesheetSelector";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function WorkbenchFilters() {
  const { timesheetList, clientList } = useContext(FilterListContext);
  const {
    workbenchFilterState,
    setWorkbenchFilterState,
    clearWorkbenchFilterTrigger,
  } = useContext(WorkbenchContext);

  const [company, setCompany] = useState(workbenchFilterState?.company);
  const [project, setProject] = useState(workbenchFilterState?.project);
  const [timesheet, setTimesheet] = useState(workbenchFilterState?.timesheet);
  const [month, setMonth] = useState(workbenchFilterState?.monthName);
  const [companyProjects, setCompanyProjects] = useState(null);

  useEffect(() => {
    setWorkbenchFilterState({
      ...workbenchFilterState,
      companyId: [
        clientList?.find((client) => client?.companyName === company)
          ?.companyId,
      ],
      company: company,
    });
  }, [company]);
  useEffect(() => {
    setWorkbenchFilterState({
      ...workbenchFilterState,

      projectId: [
        companyProjects?.find((proj) => proj?.projectName === project)
          ?.projectId,
      ],
      project: project,
    });
  }, [project]);
  useEffect(() => {
    setWorkbenchFilterState({
      ...workbenchFilterState,
      timesheetId: [timesheet],
      timesheet: timesheet,
    });
  }, [timesheet]);
  useEffect(() => {
    setWorkbenchFilterState({
      ...workbenchFilterState,
      month: [month],
      monthName: month,
    });
  }, [month]);

  const fetchData = async () => {
    try {
      if (workbenchFilterState?.companyId) {
        const response3 = await axios.get(
          `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/${
            workbenchFilterState?.companyId
          }/get-projects-by-company`
        );
        setCompanyProjects(response3.data.data);
      } else {
        console.error("companyId not available in data object");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workbenchFilterState?.companyId]);

  useEffect(() => {
    if (clearWorkbenchFilterTrigger) {
      setCompany("");
      setProject("");
      setTimesheet("");
      setMonth("");
    }
  }, [clearWorkbenchFilterTrigger]);

  return (
    <Box>
      <CompanySelector
        clients={clientList}
        company={company}
        setCompany={setCompany}
      />
      <ProjectSelector
        companyProjects={companyProjects}
        project={project}
        setProject={setProject}
      />
      <TimesheetSelector
        timesheets={timesheetList}
        timesheet={timesheet}
        setTimesheet={setTimesheet}
      />
      <MonthSelector
        monthNames={monthNames}
        month={month}
        setMonth={setMonth}
      />
    </Box>
  );
}

export default WorkbenchFilters;
