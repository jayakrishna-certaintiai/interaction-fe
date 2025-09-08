import { Box, Paper } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import InfoboxHeader from "../../components/Common/InfoboxHeader";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
import SearchboxBody from "../../components/Common/SearchboxBody";
import SearchboxHeader from "../../components/Common/SearchboxHeader";
import SidePanelHeader from "../../components/Common/SidePanelHeader";
import ContactInfoboxTable from "../../components/ContactDetails/ContactInfoboxTable";
import DetailsTab from "../../components/ContactDetails/DetailsTab";
import ProjectsTab from "../../components/ContactDetails/ProjectsTab";
import RndExpenseTab from "../../components/ContactDetails/RndExpenseTab";
import Salary from "../../components/ContactDetails/Salary";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { BaseURL } from "../../constants/Baseurl";
import { ContactContext } from "../../context/ContactContext";
import { FilterListContext } from "../../context/FiltersListContext";
import { NotificationContext } from "../../context/NotificationContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import {
  getTimeDifference,
  updateTimeDiff,
  updateTimeDifference,
} from "../../utils/helper/UpdateTimeDifference";
import { Authorization_header } from "../../utils/helper/Constant";
import SalaryTab from "../../components/ContactDetails/SalaryTab";
import ContactInfoboxHeader from "../../components/Common/ContactInfoboxHeader";
import { useLocation, useParams } from "react-router-dom";

const fieldMapping = {
  Field0: "companyName",
  Field1: "firstName",
  Field2: "phone",
  Field3: "employeeTitle",
};

function ContactDetails() {
  const arr = [
    { name: "Details", isAuth: useHasAccessToFeature("F034", "P000000003") },
    { name: "Projects", isAuth: useHasAccessToFeature("F035", "P000000003") },
    {
      name: "QRE Expense",
      isAuth: useHasAccessToFeature("F036", "P000000003"),
    },
    { name: "Wages", isAuth: useHasAccessToFeature("F037", "P000000003") },
  ];
  const { pinnedObject } = usePinnedData();
  const [selectedTab, setSelectedTab] = useState("Details");
  const [data, setData] = useState(null);
  const [contactDetails, setContactDetails] = useState(null);
  const [contactProjects, setContactProjects] = useState(null);
  const [contactSalary, setContactSalary] = useState(null);
  const [contactRnd, setContactRnd] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [projectsSortParams, setProjectsSortParams] = useState({ sortField: null, sortOrder: null });
  const [rndSortParams, setRndSortParams] = useState({ sortField: null, sortOrder: null });
  const [wagesSortParams, setWagesSortParams] = useState({ sortField: null, sortOrder: null });
  const [latestDetailUpdateTime, setLatestDetailUpdateTime] =
    useState("Just now");
  const [latestProjectUpdateTime, setLatestProjectUpdateTime] =
    useState("Just now");
  const [latestSalaryUpdateTime, setLatestSalaryUpdateTime] =
    useState("Just now");
  const {
    contactFilterState,
    setIsContactFilterApplied,
    fetchContactData,
    contactData,
    setCurrentState,
    currentState,
  } = useContext(ContactContext);
  const [latestRnDUpdateTime, setLatestRnDUpdateTime] = useState("Just now");
  const [pinStates, setPinStates] = useState({
    "All Employees": false,
    "Recently Viewed": false,
  });
  const { fetchUserDetails } = useContext(FilterListContext);
  const [currencySymbol, setCurrencySymbol] = useState();
  const [currency, setCurrency] = useState();
  const [callFetchProjects, setCallFetchProjects] = useState(true);
  const [callFetchRnd, setCallFetchRnd] = useState(true);
  const [callFetchWages, setCallFetchWages] = useState(true);
  const [projectsFilterState, setProjectsFilterState] = useState([]);
  const [rndFilterState, setRndFilterState] = useState([]);
  const [wagesFilterState, setWagesFilterState] = useState([]);
  // const [contactId, setContactId] = useState("");
  const location = useLocation();

  function callProjects() {
    setCallFetchProjects(true);
  }

  function callRnd() {
    setCallFetchRnd(true);
  }

  function callWages() {
    setCallFetchWages(true);
  }

  const getProjectsFilterParams = ({ params }) => {
    setProjectsFilterState(params);
  }

  const getRndFilterParams = (params) => {
    setRndFilterState(params);
  }

  const getWagesFilterParams = (params) => {
    setWagesFilterState(params);
  }

  const getProjectsSortParams = ({ sortField, sortOrder }) => {
    setProjectsSortParams({ sortField: sortField, sortOrder: sortOrder });
  }

  const getrndSortParams = ({ sortField, sortOrder }) => {
    setRndSortParams({ sortField: sortField, sortOrder: sortOrder });
  }

  const getWagesSortParams = ({ sortField, sortOrder }) => {
    setWagesSortParams({ sortField: sortField, sortOrder: sortOrder });
  }

  const handleSelectedItem = (selectedItemData) => {
    setData(selectedItemData);
  };

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  // const contactId = data?.contactId;

  const queryParams = new URLSearchParams(location.search);
const contactId = queryParams.get("contactId");



  const appliedFilters = {
    Clients: contactFilterState.company,
    Title: contactFilterState.employementType,
  };

  useEffect(() => {
    setCurrentState(
      pinnedObject?.CONT === "RV" ? "Recently Viewed" : "All Employees"
    );
  }, [localStorage?.getItem("keys")]);
  useEffect(() => {
    const codePoint = parseInt(contactDetails?.currencySymbol, 16);
    const symbol = String.fromCharCode(codePoint);
    setCurrencySymbol(symbol);
    setCurrency(contactDetails?.currency);
  }, [contactDetails]);

  useEffect(() => {
    const shouldFetchWithFiltersContact =
      contactFilterState.companyId.length > 0 ||
      contactFilterState.employementType !== "";
    if (shouldFetchWithFiltersContact) {
      let contactOptions = {
        ...(contactFilterState.companyId.length > 0 && {
          companyIds: contactFilterState.companyId,
        }),
        ...(contactFilterState.employementType !== "" && {
          employementType: [contactFilterState.employementType],
        }),
      };
      fetchContactData(contactOptions);
    } else {
      fetchContactData();
    }
  }, [currentState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchContactData(filters);
      setIsContactFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };
  const fetchData = async () => {
    try {
 
      if (contactId) {
        const response1 = await axios.get(
          `${BaseURL}/api/v1/contacts/001/1/${contactId}/get-contact-details`, Authorization_header()
        );
        setContactDetails(response1.data.data);
      } else {
        console.error("contactId not available in data object");
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function getProjects() {
    try {
      if (contactId) {
        const projectsParams = {};
        let projectsPayLoad = { headers: Authorization_header()?.headers }
        if (projectsSortParams && projectsSortParams?.sortField && projectsSortParams?.sortOrder) {
          projectsParams.sortField = projectsSortParams?.sortField;
          projectsParams.sortOrder = projectsSortParams?.sortOrder;
        }
        projectsParams.projectIds = JSON.stringify(projectsFilterState?.projectIds);
        projectsParams.projectNames = JSON.stringify(projectsFilterState?.projectNames);
        projectsParams.roles = JSON.stringify(projectsFilterState?.roles);
        projectsParams.employeeTitles = JSON.stringify(projectsFilterState?.employeeTitles);
        projectsParams.contactId = contactId;

        projectsPayLoad = { ...projectsPayLoad, params: projectsParams };


        const response2 = await axios.get(
          `${BaseURL}/api/v1/contacts/001/1/${contactId}/get-projects`, projectsPayLoad
        );

        setContactProjects(response2?.data?.data);
        setCallFetchProjects(false);
      }
    } catch (error) {
      console.error(error);
      setCallFetchProjects(false);
    }
  }

  useEffect(() => {
    if (callFetchProjects) {
      getProjects();
    }
  }, [contactId, callFetchProjects])

  async function getRnd() {
    try {
      if (contactId) {
        const rndExpenseParams = {};
        const rndPayload = { headers: Authorization_header()?.headers }

        if (rndSortParams && rndSortParams?.sortField && rndSortParams?.sortOrder) {
          rndExpenseParams.sortField = rndSortParams?.sortField;
          rndExpenseParams.sortOrder = rndSortParams?.sortOrder;
        }
        if (rndFilterState?.projectNames) rndExpenseParams.projectNames = JSON.stringify(rndFilterState?.projectNames);
        if (rndFilterState?.projectIds) rndExpenseParams.projectCodes = JSON.stringify(rndFilterState?.projectIds);
        if (rndFilterState?.minTotalHours) rndExpenseParams.minTotalHours = rndFilterState?.minTotalHours;
        if (rndFilterState?.maxTotalHours) rndExpenseParams.maxTotalHours = rndFilterState?.maxTotalHours;
        if (rndFilterState?.minHourlyRate) rndExpenseParams.minHourlyRate = rndFilterState?.minHourlyRate;
        if (rndFilterState?.maxHourlyRate) rndExpenseParams.maxHourlyRate = rndFilterState?.maxHourlyRate;
        if (rndFilterState?.minRnDExpense) rndExpenseParams.minRnDExpense = rndFilterState?.minRnDExpense;
        if (rndFilterState?.maxRnDExpense) rndExpenseParams.maxRnDExpense = rndFilterState?.maxRnDExpense;
        rndPayload.params = rndExpenseParams;
        const response4 = await axios.get(
          `${BaseURL}/api/v1/contacts/user/company/${contactId}/get-rnd-expense-by-contact`, rndPayload
        );
        setContactRnd(response4.data.data);
        setCallFetchRnd(false);
      }
    } catch (error) {
      setCallFetchRnd(false);
      console.error(error);
    }
  }

  useEffect(() => {
    if (callFetchRnd) {
      getRnd();
    }
  }, [contactId, callFetchRnd]);

  async function getWages() {
    try {
      if (contactId) {
        const wagesParams = {};
        const wagesPayload = { headers: Authorization_header()?.headers }

        if (wagesSortParams && wagesSortParams?.sortField && wagesSortParams?.sortOrder) {
          wagesParams.sortField = wagesSortParams?.sortField;
          wagesParams.sortOrder = wagesSortParams?.sortOrder;
        }

        if (wagesFilterState?.minAnnualSalary) wagesParams.minAnnualSalary = wagesFilterState?.minAnnualSalary;
        if (wagesFilterState?.maxAnnualSalary) wagesParams.maxAnnualSalary = wagesFilterState?.maxAnnualSalary;
        if (wagesFilterState?.minHourlyRate) wagesParams.minHourlyRate = wagesFilterState?.minHourlyRate;
        if (wagesFilterState?.maxHourlyRate) wagesParams.maxHourlyRate = wagesFilterState?.maxHourlyRate;
        if (wagesFilterState?.minStartDate) wagesParams.minStartDate = wagesFilterState?.minStartDate;
        if (wagesFilterState?.maxStartDate) wagesParams.maxStartDate = wagesFilterState?.maxStartDate;
        if (wagesFilterState?.minEndDate) wagesParams.minEndDate = wagesFilterState?.minEndDate;
        if (wagesFilterState?.maxEndDate) wagesParams.maxEndDate = wagesFilterState?.maxEndDate;

        wagesPayload.params = wagesParams;
        const response3 = await axios.get(
          `${BaseURL}/api/v1/contacts/001/1/${contactId}/get-contact-salary`, wagesPayload
        );
        setContactSalary(response3.data.data);
      }
      setCallFetchWages(false);
    } catch (error) {
      setCallFetchWages(false);
      console.error(error);
    }
  }

  useEffect(() => {
    if (callFetchWages) {
      getWages();
    }
  }, [contactId, callFetchWages])

  useEffect(() => {
    fetchData();
  }, [contactId]);

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    if (contactData) {
      const filteredData = contactData?.filter(
        (task) =>
          // task.projectManager.toLowerCase().includes(search.toLowerCase()) ||
          task?.employeeTitle?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.phone?.toString()?.includes(search?.toLowerCase()) ||
          task?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          `${task?.firstName} ${task?.lastName}`
            ?.toLowerCase()
            ?.includes(search?.toLowerCase())
        // task?.companyId?.toString()?.includes(search)
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
    }
  }, [contactData, search]);

  useEffect(() => {
    const timeDifference = updateTimeDifference(contactData, "createdTime");
    setLatestUpdateTime(timeDifference);
  }, [contactData]);

  useEffect(() => {
    const timeDifference = updateTimeDiff(contactDetails?.modifiedTime);
    setLatestDetailUpdateTime(timeDifference);
  }, [contactDetails]);

  useEffect(() => {
    const timeDifference1 = getTimeDifference(contactProjects, "modifiedTime");
    setLatestProjectUpdateTime(timeDifference1);
  }, [contactProjects]);

  useEffect(() => {
    const timeDifference2 = updateTimeDiff(contactSalary, "modifiedTime");
    setLatestSalaryUpdateTime(timeDifference2);
  }, [contactSalary]);

  useEffect(() => {
    const timeDifference3 = getTimeDifference(contactRnd, "modifiedTime");
    setLatestRnDUpdateTime(timeDifference3);
  }, [contactRnd]);

  const { updateAlertCriteria } = useContext(NotificationContext);

  useEffect(() => {
    const pageName = "Employees";
    const relationId = contactId;

    updateAlertCriteria(pageName, relationId);

    return () => updateAlertCriteria(null, null);
  }, [contactId]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const isDownload = useHasAccessToFeature("F033", "P000000006");

  useEffect(() => {
    const updatedPinStates = {
      "All Employees": pinnedObject.CONT === "ALL",
      "Recently Viewed": pinnedObject.CONT === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.CONT]);

  const togglePinState = (selectedHeading) => {
    setPinStates((prevStates) => {
      const resetStates = Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      const newState = {
        ...resetStates,
        [selectedHeading]: !prevStates[selectedHeading],
      };

      const allFalse =
        !newState["All Employees"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Employees"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      CONT: newState,
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

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Employees" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  return (
    <>
      <Box
        sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 1.5 }}
      >
        {/* <Paper
          sx={{
            display: "flex",
            width: "23%",
            borderRadius: "20px",
            flexDirection: "column",
            height: "100vh",
            mb: 3,
            overflowY: "hidden",
            boxShadow: "0px 3px 6px #0000001F",
          }}
        >
          <SearchboxHeader
            type={
              pinnedObject?.CONT === "RV" ? "Recently Viewed" : "All Employees"
            }
            data={filteredRows}
            onSearch={handleSearch}
            latestUpdateTime={latestUpdateTime}
            items={["All Employees", "Recently Viewed"]}
            page="Employees"
            onApplyFilters={applyFiltersAndFetch}
            searchPermission={useHasAccessToFeature("F033", "P000000009")}
            onSelectedItem={handleSelectedHeaderItem}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <Box sx={{ overflowY: "auto" }}>
            <SearchboxBody
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
              page={"Employees"}
            />
          </Box>
        </Paper> */}
        <Box sx={{ width: "110%", display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              borderRadius: "20px",
              mb: 3,
              boxShadow: "0px 3px 6px #0000001F",
            }}
          >
            <ContactInfoboxHeader
              head1={data?.employeeId}
              // head={
              //   data?.firstName && data?.lastName
              //     ? data?.firstName + " " + data?.lastName
              //     : ""
              // }
              head={data?.firstName}
              page={"contact"}
              downloadPermission={isDownload}
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
            />
            <ContactInfoboxTable data={data} />
          </Paper>
          <Box sx={{ display: "flex", gap: "20px", mb: 2, mt: -1.5 }}>
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
                page={"contact-details"}
              />
              {useHasAccessToFeature("F034", "P000000003") &&
                selectedTab === "Details" && (
                  <DetailsTab
                    data={contactDetails}
                    latestUpdateTime={latestDetailUpdateTime}
                    modifiedBy={contactDetails?.modifiedBy}
                    getAllData={fetchContactData}
                  />
                )}
              {useHasAccessToFeature("F035", "P000000003") &&
                selectedTab === "Projects" && (
                  <ProjectsTab
                    data={contactProjects}
                    modifiedBy={latestProjectUpdateTime?.modifiedBy}
                    latestUpdateTime={latestProjectUpdateTime?.difference}
                    getProjectsSortParams={getProjectsSortParams}
                    contactId={contactId}
                    getProjectsFilterParams={getProjectsFilterParams}
                    callProjects={callProjects}
                  />
                )}
              {useHasAccessToFeature("F036", "P000000003") &&
                selectedTab === "QRE Expense" && (
                  <RndExpenseTab
                    data={contactRnd}
                    modifiedBy={contactRnd?.modifiedBy}
                    latestUpdateTime={latestRnDUpdateTime?.difference}
                    getrndSortParams={getrndSortParams}
                    contactId={contactId}
                    getRndFilterParams={getRndFilterParams}
                    callRnd={callRnd}
                  />
                )}
              {useHasAccessToFeature("F037", "P000000003") &&
                selectedTab === "Wages" && (
                  <SalaryTab
                    currencySymbol={currencySymbol}
                    currency={currency}
                    data={contactSalary}
                    modifiedBy={contactSalary?.modifiedBy}
                    latestUpdateTime={latestSalaryUpdateTime}
                    getWagesSortParams={getWagesSortParams}
                    getWagesFilterParams={getWagesFilterParams}
                    callWages={callWages}
                    contactId={contactId}
                  />
                )}
            </Paper>
          </Box>
        </Box>
      </Box>
      <Toaster />
    </>
  );
}

export default ContactDetails;
