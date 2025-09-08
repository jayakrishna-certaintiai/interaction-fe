import { Paper, Table, TableContainer } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomPagination from "../../components/Common/CustomPagination";
import TableHeader2 from "../../components/Common/TableHeader2";
import TableIntro from "../../components/Common/TableIntro";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import ReconciliationTableBody from "../../components/Reconciliations/ReconciliationTableBody";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { WorkbenchContext } from "../../context/WorkbenchContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

const tableData = {
  columns: [
    // "",
    "Workbench ID",
    "Revisions",
    "Timesheet",
    "Month",
    "Project",
    "Accounts",
    "Non QRE Hours",
    "QRE Hours",
    "Uncertain Hours",
    "Reconciled Hours",
  ],
  rows: [
    {
      id: 1,
      reconciliationId: "WR-0007564",
      revisions: "0",
      timesheet: "TS_Oct23",
      month: "Oct 2023",
      project: "Project 1",
      company: "Apple Inc.",
      projectManager: "Ezra Romero",
      nonRnD: "1321",
      RnD: "285",
      uncertainHrs: "26",
      reconciledHrs: "0",
    },
  ],
};

function Reconciliations() {
  const { pinnedObject } = usePinnedData();
  const {
    workbenchData,
    fetchWorkbenchData,
    workbenchFilterState,
    setIsWorkbenchFilterApplied,
    currentState,
    setCurrentState,
  } = useContext(WorkbenchContext);
  const { fetchUserDetails } = useContext(FilterListContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [pinStates, setPinStates] = useState({
    "All Workbench": false,
    "Open Workbench": false,
    "Close Workbench": false,
  });

  const totalPages = Math.ceil(workbenchData?.length / itemsPerPage);

  const appliedFilters = {
    Clients: workbenchFilterState.company,
    Projects: workbenchFilterState.project,
    Timesheet: workbenchFilterState.timesheet,
    Month: workbenchFilterState.monthName,
  };

  useEffect(() => {
    const updatedPinStates = {
      "All Workbench": pinnedObject.WB === "ALL",
      "Open Workbench": pinnedObject.WB === "OPEN",
      "Close Workbench": pinnedObject.WB === "CLOSE",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.WB]);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }

  useEffect(() => {
    setCurrentState(
      pinnedObject?.WB === "ALL"
        ? "All Workbench"
        : pinnedObject?.WB === "OPEN"
          ? "Open Workbench"
          : "Close Workbench"
    );
  }, []);

  useEffect(() => {
    const shouldFetchWithFilters =
      workbenchFilterState.companyId.length > 0 ||
      workbenchFilterState.projectId.length > 0 ||
      workbenchFilterState.monthName !== "" ||
      workbenchFilterState.timesheetId.length > 0;
    if (shouldFetchWithFilters) {
      let options = {
        ...(workbenchFilterState.companyId.length > 0 && {
          companyId: workbenchFilterState.companyId,
        }),
        ...(workbenchFilterState.projectId.length > 0 && {
          projectId: workbenchFilterState.projectId,
        }),
        ...(workbenchFilterState.timesheetId.length > 0 && {
          timesheetId: workbenchFilterState.timesheetId,
        }),
        ...(workbenchFilterState.monthName !== "" && {
          timesheetMonth: [workbenchFilterState.monthName],
        }),
      };
      fetchWorkbenchData(options);
    } else {
      fetchWorkbenchData();
    }
  }, [currentState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchWorkbenchData(filters);
      setIsWorkbenchFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const handleSearch = (input) => {
    setSearch(input);

  };

  useEffect(() => {
    if (workbenchData) {
      const filteredData = workbenchData?.filter(
        (task) =>
          task?.reconcileId?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.timesheetId?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          `${task?.timesheetMonth} ${task?.timesheetYear}`
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          task?.reconcileRevision?.toString()?.includes(search)
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
      setCurrentPage(1);
    }
  }, [workbenchData, search]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

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
        !newState["All Workbench"] &&
        !newState["Open Workbench"] &&
        !newState["Close Workbench"];
      if (allFalse) {
        newState["All Workbench"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      WB: newState,
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
      const newStateValue =
        newState === "All Workbench"
          ? "ALL"
          : newState === "Open Workbench"
            ? "OPEN"
            : "CLOSE";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const isSearch = useHasAccessToFeature("F030", "P000000009");
  return (
    <>
      {useHasAccessToFeature("F030", "P000000008") && (
        <Paper
          sx={{
            display: "flex",
            width: "98%",
            mx: "auto",
            mt: 2,
            flexDirection: "column",
            borderRadius: "20px",
            mb: 3,
            boxShadow: "0px 3px 6px #0000001F",
          }}
        >
          <TableIntro
            heading={
              pinnedObject?.WB === "ALL"
                ? "All Workbench"
                : pinnedObject?.WB === "OPEN"
                  ? "Open Workbench"
                  : "Close Workbench"
            }
            page={"workbench"}
            totalItems={filteredRows?.length || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            // onUploadClick={handleUploadClick}
            onSearch={handleSearch}
            items={["All Workbench", "Open Workbench", "Close Workbench"]}
            onSelectedItem={handleSelectedHeaderItem}
            onApplyFilters={applyFiltersAndFetch}
            appliedFilters={appliedFilters}
            searchPermission={isSearch}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHeader2 tableData={tableData} />
              <ReconciliationTableBody
                data={currentData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={handleChangePage}
            changeItemsPerPage={handleChangeItemsPerPage}
            minRows={20}
          />
        </Paper>
      )}
      <Toaster />
    </>
  );
}

export default Reconciliations;
