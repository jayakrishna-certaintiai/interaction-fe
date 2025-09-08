import { Box, Paper } from "@mui/material";
import qs from 'qs';
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import InfoboxHeader from "../../components/Common/InfoboxHeader";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
import SearchboxHeader from "../../components/Common/SearchboxHeader";
import CompanyInfoboxTable from "../../components/Companies/CompanyInfoboxTable";
import CompanySearchboxBody from "../../components/Companies/CompanySearchboxBody";
import CompanyContacts from "../../components/CompanyDetails/CompanyContacts";
import CompanyDetails from "../../components/CompanyDetails/CompanyDetails";
import CompanyProjects from "../../components/CompanyDetails/CompanyProjects";
import Highlights from "../../components/CompanyDetails/Highlights";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import Documents from "../../components/Projects/Documents";
import { BaseURL } from "../../constants/Baseurl";
import { ClientContext } from "../../context/ClientContext";
import { DocumentContext } from "../../context/DocumentContext";
import { NotificationContext } from "../../context/NotificationContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { getTimeDifference, updateTimeDiff, updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { FilterListContext } from "../../context/FiltersListContext";
import CompanyUsers from "../../components/CompanyDetails/CompanyUsers";
import { UserManagementContext } from "../../context/UserManagementContext";
import { Authorization_header } from "../../utils/helper/Constant";
import Financial from "../../components/Projects/Financial";
import Graph from "../../components/CompanyDetails/Graph";
import Mapper from "../../components/CompanyDetails/Mapper";
import CompanyCC from "../../components/CompanyDetails/CompanyCC";
import ChatAssistant from "../../components/CompanyDetails/ChatAssistant";
import { useLocation } from "react-router-dom";


const fieldMapping = {
  Field0: "companyName",
  Field1: "billingAddress",
  Field2: "primaryContact",
};

function CompanyInfo() {
  // Move all hook calls to the top level
  const hasHighlightsAccess = useHasAccessToFeature("F014", "P000000003");
  const hasDetailsAccess = useHasAccessToFeature("F007", "P000000003");
  const hasEmployeesAccess = useHasAccessToFeature("F011", "P000000003");
  const hasProjectsAccess = useHasAccessToFeature("F008", "P000000003");
  const hasDocumentsAccess = useHasAccessToFeature("F010", "P000000003");
  const hasMappersAccess = useHasAccessToFeature("F010", "P000000003");
  const hasManageCCAccess = useHasAccessToFeature("F010", "P000000003");
  const hasChatAssistantAccess = useHasAccessToFeature("F010", "P000000003");
  const isReUpload = useHasAccessToFeature("F018", "P000000002");
  const isDownload = useHasAccessToFeature("F005", "P000000006");
  const hasSearchPermission = useHasAccessToFeature("F005", "P000000009");

  const arr = [
    { name: "Highlights", isAuth: hasHighlightsAccess },
    { name: "Details", isAuth: hasDetailsAccess },
    { name: "Employees", isAuth: hasEmployeesAccess },
    { name: "Projects", isAuth: hasProjectsAccess },
    { name: "Documents", isAuth: hasDocumentsAccess },
    { name: "Mappers", isAuth: hasMappersAccess },
    { name: "Manage CC Recipents", isAuth: hasManageCCAccess },
    { name: "Chat Assistant", isAuth: hasChatAssistantAccess },
    // { name: "Users", isAuth: true },
  ];
  const [selectedTab, setSelectedTab] = useState("Highlights");
  const [data, setData] = useState(null);
  const { pinnedObject } = usePinnedData();
  const { userList, fetchUsers, userFilterState } = useContext(
    UserManagementContext
  );
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companyContacts, setCompanyContacts] = useState(null);
  const [companyProjects, setCompanyProjects] = useState(null);
  const [companyHighlights, setCompanyHighlights] = useState(null);
  const [totalBudget, setTotalBudget] = useState(null);
  const [totalExpense, setTotalExpense] = useState(null);
  const [rndExpenseCumulative, setRndExpenseCumulative] = useState(null);
  const [cumulativeRndDisplay, setCumulativeRndDisplay] = useState(null);
  const [cumulativeTotalExpenseDisplay, setCumulativeTotalExpenseDisplay] = useState(null);
  const [date, setDate] = useState(null);
  const [details, setDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [callFetchContacts, setCallFetchContacts] = useState(true);
  const [callFetchProjects, setCallFetchProjects] = useState(false);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [latestDetailUpdateTime, setLatestDetailUpdateTime] = useState("Just now");
  const [latestContactUpdateTime, setLatestContactUpdateTime] = useState("Just now");
  const [latestProjectUpdateTime, setLatestProjectUpdateTime] = useState("Just now");
  const [latestDocumentUpdateTime, setLatestDocumentUpdateTime] = useState("Just now");
  const [latestUserUpdateTime, setLatestUserUpdateTime] = useState("Just now");
  const { documents, fetchDocuments } = useContext(DocumentContext);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [employeeFilterState, setEmployeeFilterState] = useState({});
  const [employeeSortState, setEmployeeSortState] = useState({});
  const [projectFilterState, setProjectFilterState] = useState({});
  const [projectSortState, setProjectSortState] = useState({});
  const [companyId, setCompanyId] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setCompanyId(queryParams.get("companyId"));
  }, [location]);



  const {
    clientFilters,
    setIsClientFilterApplied,
    fetchClientData,
    clientData,
    setCurrentState,
    currentState,
  } = useContext(ClientContext);
  const [pinStates, setPinStates] = useState({
    "All Accounts": false,
    "Recently Viewed": false,
  });
  const { fetchUserDetails } = useContext(FilterListContext);

  useEffect(() => {
    if (callFetchProjects) {
      fetchCompanyProjects();
    }
  }, [callFetchProjects])

  useEffect(() => {
    if (callFetchContacts) {
      fetchCompanyContacts();
    }
  }, [callFetchContacts])

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  const handleBackFromChat = () => {
    setSelectedTab("Highlights"); // Return to the default tab
  };

  const getEmployeeFilterState = (options) => {

    setEmployeeFilterState(options);
  }

  const callFetchFunction = () => {
    setCallFetchContacts(true);
  }

  const callFetchProjectsFunction = () => {
    setCallFetchProjects(true);
  }

  const getEmployeeSortState = (options) => {
    setEmployeeSortState(options);
  }

  const getProjectsFilterState = (options) => {
    setProjectFilterState(options);
  }

  const getProjectsSortState = (options) => {
    setProjectSortState(options);
  }

  const handleSelectedItem = (selectedItemData) => {

    setData(selectedItemData);
  };

  useEffect(() => {
    if (companyId) {
      let options = {
        clients: [companyId],
      };
      fetchUsers(options);

    } else {
      fetchUsers();
    }
  }, [companyId]);

  const handleDocumentUploadSuccess = () => {
    setShouldRefetch(true);
  };

  const appliedFilters = {
    Type: clientFilters.type,
    MinimumProjects: clientFilters.NoOfProjects ? clientFilters.NoOfProjects[0] : undefined,
    MaximumProjects: clientFilters.NoOfProjects ? clientFilters.NoOfProjects[1] : undefined,
    BillingAddress: clientFilters.location,
  };

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchClientData(filters);
      setIsClientFilterApplied(true);
    } else {
      alert("Please select at least one filter before applying.");
    }
  };

  useEffect(() => {
    setCurrentState(
      pinnedObject?.CLNT === "RV" ? "Recently Viewed" : "All Accounts"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const shouldFetchWithFiltersClient =
      clientFilters.location || clientFilters.type;
    if (shouldFetchWithFiltersClient) {
      let clientOptions = {
        ...(clientFilters.location && {
          location: clientFilters.location,
        }),
        ...(clientFilters.NoOfProjects && {
          minProjectsCount: clientFilters.NoOfProjects[0],
        }),
        ...(clientFilters.NoOfProjects && {
          maxProjectsCount: clientFilters.NoOfProjects[1],
        }),
        ...(clientFilters.type && {
          companyType: clientFilters.type,
        }),
      };
      fetchClientData(clientOptions);
    } else {
      fetchClientData();
    }
  }, [currentState]);

  const fetchCompanyDetails = async () => {
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem(
          "userid"
        )}/${companyId}/get-company-details`, Authorization_header()
      );
      setCompanyDetails(response1.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompanyContacts = async () => {
    const params = new URLSearchParams();
    if (employeeFilterState?.params?.companyIds) params.append("employeeIds", JSON.stringify(employeeFilterState?.params?.companyIds));
    if (employeeFilterState?.params?.emails) params.append("emails", JSON.stringify(employeeFilterState?.params?.emails));
    if (employeeFilterState?.params?.employementTypes) params.append("employementTypes", JSON.stringify(employeeFilterState?.params?.employementTypes));
    if (employeeFilterState?.params?.employeeTitles) params.append("employeeTitles", JSON.stringify(employeeFilterState?.params?.employeeTitles));
    if (employeeFilterState?.params?.employeeNames) params.append("employeeNames", JSON.stringify(employeeFilterState?.params?.employeeNames));

    try {

      if (companyId) {
        const idArr = [companyId];
        params.companyIds = JSON.stringify(idArr);
      }

      if (employeeSortState && employeeSortState?.sortField && employeeSortState?.sortOrder) {
        params.append('sortField', employeeSortState?.sortField);
        params.append('sortOrder', employeeSortState?.sortOrder);
      }

      const urlWithParams = `${BaseURL}/api/v1/contacts/temp/temp/get-contacts?companyIds=[${JSON.stringify(companyId)}]&${params.toString()}`;

      const payLoad = {
        headers: Authorization_header()?.headers,
      }

      const response2 = await axios.get(urlWithParams, payLoad);

      setCompanyContacts(response2?.data?.data?.list);
      setCallFetchContacts(false);
    } catch (error) {
      console.error(error);
      setCallFetchContacts(false);
    }
  };

  const fetchCompanyProjects = async () => {
    const params = {};
    if (projectSortState && projectSortState?.sortField && projectSortState?.sortOrder) {
      params.sortField = projectSortState?.sortField;
      params.sortOrder = projectSortState?.sortOrder;
    };
    if (projectFilterState && projectFilterState?.params?.projectIds) params.projectCodes = JSON.stringify(projectFilterState?.params?.projectIds);
    if (projectFilterState && projectFilterState?.params?.projectNames) params.projectNames = JSON.stringify(projectFilterState?.params?.projectNames);
    if (projectFilterState && projectFilterState?.params?.spocNames) params.spocName = JSON.stringify(projectFilterState?.params?.spocNames);
    if (projectFilterState && projectFilterState?.params?.minTotalExpense) params.minTotalExpense = projectFilterState?.params?.minTotalExpense;
    if (projectFilterState && projectFilterState?.params?.maxTotalExpense) params.maxTotalExpense = projectFilterState?.params?.maxTotalExpense;
    if (projectFilterState && projectFilterState?.params?.minRnDExpense) params.minRnDExpense = projectFilterState?.params?.minRnDExpense;
    if (projectFilterState && projectFilterState?.params?.maxRnDExpense) params.maxRnDExpense = projectFilterState?.params?.maxRnDExpense;
    if (projectFilterState && projectFilterState?.params?.minRnDPotential) params.minRnDPotential = projectFilterState?.params?.minRnDPotential;
    if (projectFilterState && projectFilterState?.params?.maxRnDPotential) params.maxRnDPotential = projectFilterState?.params?.maxRnDPotential;

    const payLoad = {
      params: params,
      headers: Authorization_header()?.headers,
    }

    try {
      const response3 = await axios.get(
        `${BaseURL}/api/v1/projects/${localStorage.getItem(
          "userid"
        )}/a0ds/get-projects?companyIds=[${JSON.stringify(companyId)}]`, payLoad
      );
      setCompanyProjects(response3?.data?.data?.list);
      setCallFetchProjects(false);
    } catch (error) {
      console.error(error);
      setCallFetchProjects(false);
    }
    setCallFetchProjects(false);
  };
  
  const fetchCompanyHighlights = async () => {
    try {
      const response4 = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/${companyId}/get-highlights`, Authorization_header()
      );

      setCompanyHighlights(response4.data.data);
      (response4?.data?.data?.highlights && setCumulativeRndDisplay(response4?.data?.data?.highlights[0]?.rndExpenseCumulative));
      (response4?.data?.data?.highlights && setCumulativeTotalExpenseDisplay(response4?.data?.data?.highlights[0]?.totalExpense));
      if (response4.data.data && response4.data.data.kpi) {
        setTotalBudget(
          response4.data.data?.kpi?.map((item) => parseFloat(item?.totalBudget))
        );
        setTotalExpense(
          response4.data.data?.kpi?.map((item) => parseFloat(item?.totalExpense))
        );
        setRndExpenseCumulative(
          response4.data.data?.kpi?.map((item) => parseFloat(item?.rndExpenseCumulative))
        );
        setDate(
          response4.data.data.kpi.map((item) => { return ({ year: item.year, month: item.month }) })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyContacts();
  }, [localStorage?.getItem("keys")])

  useEffect(() => {
    if (companyId) {
      fetchCompanyContacts();
      fetchCompanyDetails();
      fetchCompanyProjects();
      fetchCompanyHighlights();
      fetchDocuments({
        companyIds: [companyId],
        relationId: companyId,
        relatedTo: "clients"
      });
    } else {
      console.error("companyId not available in data object");
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      // Check if companyId is not null or undefined
      fetchDocuments({
        companyIds: [companyId],
        relationId: companyId,
        relatedTo: "clients"
      });
    }
    setShouldRefetch(false);
  }, [companyId, shouldRefetch]);


  const processData = (dates, totalBudgets, totalExpenses, rndExpenseCumulative) => {
    // Step 1: Combine the arrays into a single arr ay of objects
    const combinedArray = dates?.map((date, index) => ({
      date: date,
      totalBudget: totalBudgets[index],
      totalExpense: totalExpenses[index],
      rndExpenseCumulative: rndExpenseCumulative[index],
    }));

    // Step 2: Convert the date strings into Date objects for sorting
    combinedArray?.forEach((item) => {
      const [month, year] = [item?.date?.month, item?.date?.month];
      item.sortableDate = new Date(year, month - 1);
    });

    // Step 3: Sort the combined array based on the sortableDate
    combinedArray?.sort((a, b) => a?.sortableDate - b?.sortableDate);

    // Step 4: Separate the combined array back into individual arrays
    const sortedDates = combinedArray?.map(
      (item) =>
        `${item?.sortableDate?.getMonth() + 1
        }/${item?.sortableDate?.getFullYear()}`
    );
    const sortedTotalBudgets = combinedArray?.map((item) => item?.totalBudget);
    const sortedTotalExpenses = combinedArray?.map(
      (item) => item?.totalExpense
    );
    const sortedRndExpenseCumulative = combinedArray?.map((item) => item?.rndExpenseCumulative);

    return {
      sortedDates,
      sortedTotalBudgets,
      sortedTotalExpenses,
      sortedRndExpenseCumulative,
    };
  };

  // Call the function with the arrays
  const sortedData = processData(date, totalBudget, totalExpense, rndExpenseCumulative);

  const handleSearch = (input) => {
    setSearch(input);

  };

  useEffect(() => {
    if (clientData) {
      const filteredData = clientData?.filter(
        (task) =>
          // task.projectManager.toLowerCase().includes(search.toLowerCase()) ||
          task?.billingCity?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.primaryContact?.toLowerCase()?.includes(search?.toLowerCase())
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
    }
  }, [clientData, search]);

  useEffect(() => {
    const timeDifference = updateTimeDifference(clientData, "createdTime");
    setLatestUpdateTime(timeDifference);
  }, [clientData]);

  useEffect(() => {
    const timeDifference = companyDetails?.modifiedTime
      ? updateTimeDiff(companyDetails?.modifiedTime)
      : updateTimeDiff(companyDetails?.createdTime);
    setLatestDetailUpdateTime(timeDifference);

    const timeDifference1 = getTimeDifference(companyProjects, "modifiedTime");
    setLatestProjectUpdateTime(timeDifference1);
    const timeDifference2 = getTimeDifference(companyContacts, "modifiedTime");
    const timeDifference3 = getTimeDifference(documents, "modifiedTime");
    const timeDifference4 = getTimeDifference(userList, "modifiedTime");
    setLatestDocumentUpdateTime(timeDifference3);
    setLatestContactUpdateTime(timeDifference2);
    setLatestUserUpdateTime(timeDifference4);
  }, [companyDetails, companyProjects, companyContacts, documents]);

  const { updateAlertCriteria } = useContext(NotificationContext);

  useEffect(() => {
    const pageName = "company";
    const relationId = companyId;

    updateAlertCriteria(pageName, relationId);

    return () => updateAlertCriteria(null, null);
  }, [companyId]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  useEffect(() => {
    const updatedPinStates = {
      "All Accounts": pinnedObject.CLNT === "ALL",
      "Recently Viewed": pinnedObject.CLNT === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.CLNT]);

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

      const allFalse = !newState["All Accounts"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Accounts"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      CLNT: newState,
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
      const newStateValue = newState === "All Accounts" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const codePoint = parseInt(details?.overview[0]?.currencySymbol, 16);


  const currencySymbol = String.fromCharCode(codePoint);

  return (
    <>
      {/* Chat Assistant Full Page Mode */}
      {selectedTab === "Chat Assistant" && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1300, backgroundColor: '#f8f9fa' }}>
          <ChatAssistant companyId={companyId} companyName={data?.companyName} onBack={handleBackFromChat} />
        </Box>
      )}

      {/* Regular Page Layout */}
      {selectedTab !== "Chat Assistant" && (
        <Box
          sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 1 }}
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
          > */}
          {/* <SearchboxHeader
              type={
                pinnedObject?.CLNT === "ALL" ? "All Accounts" : "Recently Viewed"
              }
              onSearch={handleSearch}
              data={filteredRows}
              latestUpdateTime={latestUpdateTime}
              items={["All Accounts", "Recently Viewed"]}
              page="company"
              onApplyFilters={applyFiltersAndFetch}
              searchPermission={useHasAccessToFeature("F005", "P000000009")}
              onSelectedItem={handleSelectedHeaderItem}
              isPinnedState={pinStates[currentState]}
              onPinClicked={() => togglePinState(currentState)}
            /> */}
          {/* <Box sx={{ overflowY: "auto" }}>
            <CompanySearchboxBody
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
            />
          </Box> */}
          {/* </Paper> */}
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", marginBottom: 3, borderRadius: "20px 20px" }}>
            <Paper
              sx={{
                borderRadius: "20px",
                boxShadow: "0px 3px 6px #0000001F",
                mb: 3,
              }}
            >
              <InfoboxHeader
                head={companyDetails?.companyCode}
                head1={data?.companyName}
                data={filteredRows}
                fieldMapping={fieldMapping}
                onItemSelected={handleSelectedItem}
                downloadPermission={isDownload}
                uploadPermission={isReUpload}
                page={"companies"}
                comId={companyId}
                fetchCompanyContacts={fetchCompanyContacts}
              />
              <CompanyInfoboxTable info={companyDetails} />
            </Paper>
            <Box sx={{ display: "flex", gap: "10px", mt: -1.5 }}>
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
                />

                {hasHighlightsAccess &&
                  selectedTab === "Highlights" && (
                    <>
                      <Graph
                        symbol={companyDetails?.primaryCurrency}
                        data={details?.overview}
                        info={details?.overview[0]}
                        totalExpense={totalExpense}
                        rndExpenseCumulative={rndExpenseCumulative}
                        cumulativeRndDisplay={cumulativeRndDisplay}
                        cumulativeTotalExpenseDisplay={cumulativeTotalExpenseDisplay}
                        date={date}
                        latestUpdateTime={latestDetailUpdateTime}
                        modifiedBy={details?.modifiedBy}
                      />
                    </>
                  )}
                {hasDetailsAccess &&
                  selectedTab === "Details" && (
                    <CompanyDetails
                      data={companyDetails}
                      latestUpdateTime={latestDetailUpdateTime}
                      modifiedBy={companyDetails?.modifiedBy}
                    />
                  )}
                {hasEmployeesAccess &&
                  selectedTab === "Employees" && (
                    <CompanyContacts
                      data={companyContacts}
                      latestUpdateTime={latestContactUpdateTime?.difference}
                      modifiedBy={latestContactUpdateTime?.modifiedBy}
                      comId={companyId}
                      // fetchCompanyContacts={fetchCompanyContacts}
                      getEmployeeFilterState={getEmployeeFilterState}
                      getEmployeeSortState={getEmployeeSortState}
                      callFetchFunction={callFetchFunction}
                    />
                  )}
                {hasProjectsAccess &&
                  selectedTab === "Projects" && (
                    <CompanyProjects
                      data={companyProjects}
                      latestUpdateTime={latestProjectUpdateTime?.difference}
                      modifiedBy={latestContactUpdateTime?.modifiedBy}
                      comId={companyId}
                      callFetchFunction={callFetchProjectsFunction}
                      getProjectsFilterState={getProjectsFilterState}
                      getProjectsSortState={getProjectsSortState}
                    />
                  )}
                {hasDocumentsAccess &&
                  selectedTab === "Documents" && (
                    <Documents
                      data={documents}
                      onClientDocumentUploadSuccess={handleDocumentUploadSuccess}
                      page="clients"
                      comId={companyId}
                      comName={data?.companyName}
                      latestUpdateTime={latestDocumentUpdateTime?.difference}
                      modifiedBy={latestDocumentUpdateTime?.modifiedBy}
                      fetchDocuments={fetchDocuments}
                    />
                  )}
                {hasMappersAccess &&
                  selectedTab === "Mappers" && (
                    <Mapper
                      data={documents}
                      onClientDocumentUploadSuccess={handleDocumentUploadSuccess}
                      page="company"
                      companyId={companyId}
                      comName={data?.companyName}
                      latestUpdateTime={latestDocumentUpdateTime?.difference}
                      modifiedBy={latestDocumentUpdateTime?.modifiedBy}
                    />
                  )}
                {selectedTab === "Manage CC Recipents" && (
                  <CompanyCC tab="Account" companyId={companyId} />
                )}
                {/* {selectedTab === "Users" && (
                  <CompanyUsers
                    userList={userList}
                    latestUpdateTime={latestUserUpdateTime?.difference}
                    modifiedBy={latestUserUpdateTime?.modifiedBy}
                    fetchUsers={fetchUsers}
                    companyId={companyId}
                  />
                )} */}
              </Paper>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export default CompanyInfo;