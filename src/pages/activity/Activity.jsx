import { Paper, Table, TableContainer } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ActivityTabTableBody from "../../components/Activity/ActivityTabTableBody";
import CustomPagination from "../../components/Common/CustomPagination";
import TableHeader2 from "../../components/Common/TableHeader2";
import TableIntro from "../../components/Common/TableIntro";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { ActivityContext } from "../../context/ActivityContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { getTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { FilterListContext } from "../../context/FiltersListContext";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import ActivityModal from "../../components/Activity/ActivityModal";
import {
  getPinString,
  parsePinnedString,
} from "../../utils/helper/ParsePinnedString";

const tableData1 = {
  columns: [
    "Timestamp",
    "Type",
    "To",
    "From",
    "Related To",
    "Subject",
    "Body",
    "",
  ],
  rows: [
    {
      id: 1,
      interactionTime: "2024-01-23T01:40:06.000Z",
      interactionActivityType: "Email",
      status: "Pending",
      interactionTo: "Prabhu Balakrishnan",
      interactionFrom: "Adam Smith",
      assignee: "Prabhu Balakrishnan",
      assigner: "Adam Smith",
      relatedTo: "Contact - Adam Smith",
      project: "PR-000000049",
      interactionSubject: "Information Pending",
      interactionDesc:
        "Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lor…",
    },
  ],
};
const tableData2 = {
  columns: [
    "Favorites",
    "Timestamp",
    "Subject",
    // "Activity ID",
    "Activity Type",
    "Status",
    "Related To",
    // "Relation ID",
    "To",
    "From",
    "",
  ],
};

function Activity() {
  const {
    activityData,
    fetchActivityData,
    activityFilterState,
    setIsActivityFilterApplied,
    currentState,
    setCurrentState,
  } = useContext(ActivityContext);
  const [selectedTab, setSelectedTab] = useState("Interactions");
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentPinState, setCurrentPinState] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const { fetchUserDetails, setPinString, pinString } =
    useContext(FilterListContext);
  const [pinStates, setPinStates] = useState({
    "All Activity": false,
    Starred: false,
  });
  const pinnedObject = parsePinnedString(pinString);
  const totalPages = Math.ceil(activityData?.length / itemsPerPage);

  const appliedFilters = {
    ActivityType: activityFilterState.activityType,
    SentTo: activityFilterState.sentTo,
    Date: activityFilterState.date,
    From: activityFilterState.dateFrom,
    To: activityFilterState.dateTo,
    ActivityStatus: activityFilterState.status,
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    // setCurrentPage(1);
  };

  const currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  while (currentData?.length < itemsPerPage) {
    currentData?.push({}); // Push an empty object or a placeholder object
  }

  useEffect(() => {
    setCurrentState(
      pinnedObject?.AI === "Starred" ? "Starred" : "All Activity"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const updatedPinStates = {
      "All Activity": pinnedObject.AI === "ALL",
      Starred: pinnedObject.AI === "Starred",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.AI]);

  useEffect(() => {
    const shouldFetchWithFiltersActivity =
      activityFilterState.interactionActivityType.length > 0 ||
      activityFilterState.interactionTo.length > 0 ||
      activityFilterState.status !== "" ||
      activityFilterState.from !== "" ||
      activityFilterState.to !== "" ||
      activityFilterState.modifiedTime.length > 0;
    if (shouldFetchWithFiltersActivity) {
      let options = {
        ...(activityFilterState.interactionActivityType.length > 0 && {
          interactionActivityType: activityFilterState.interactionActivityType,
        }),
        ...(activityFilterState.interactionTo.length > 0 && {
          interactionTo: activityFilterState.interactionTo,
        }),
        ...(activityFilterState.modifiedTime.length > 0 && {
          modifiedTime: activityFilterState.modifiedTime,
        }),
        ...(activityFilterState.status !== "" && {
          status: [activityFilterState.status],
        }),
        ...(activityFilterState.from !== "" && {
          from: activityFilterState.from,
        }),
        ...(activityFilterState.to !== "" && {
          to: activityFilterState.to,
        }),
      };
      fetchActivityData(options);
    } else {
      fetchActivityData();
    }
  }, [currentState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchActivityData(filters);
      setIsActivityFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const placeholderRow = {};
  while (currentData?.length < 15) {
    currentData.push(placeholderRow);
  }

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  const handleSearch = (input) => {
    setSearch(input);

  };

  useEffect(() => {
    if (activityData) {
      const filteredData = activityData?.filter(
        (task) =>
          task?.interactionID?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.interactionActivityType
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          task?.interactionSubject
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          task?.interactionTo?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.interactionFrom
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          task?.interactionDesc?.toLowerCase()?.includes(search?.toLowerCase())
        // task?.reconcileRevision?.toString()?.includes(search)
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
    }
  }, [activityData, search]);

  useEffect(() => {
    const timeDifference = getTimeDifference(activityData, "modifiedTime");
    setLatestUpdateTime(timeDifference);
  }, [activityData]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const handlePinChange = (isPinned) => {
    setCurrentPinState(isPinned);
  };

  const isCreate = useHasAccessToFeature("F023", "P000000007");
  const isSearch = useHasAccessToFeature("F023", "P000000009");

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

      const allFalse = !newState["All Activity"] && !newState["Starred"];
      if (allFalse) {
        newState["All Activity"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      AI: newState,
    };

    const pinnedString = getPinString(newPinnedObject);
    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ pin: pinnedString }),
    };

    try {
      const response = await axios.request(config);
      setPinString(pinnedString);

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
      const newStateValue = newState === "All Activity" ? "ALL" : "Starred";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  useEffect(() => {
    setPinString(pinString)
  }, [localStorage?.getItem("keys")]);

  return (
    <>
      {useHasAccessToFeature("F023", "P000000008") && (
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
              parsePinnedString(pinString).AI === "ALL"
                ? "All Activity"
                : "Starred"
            }
            btnName={"New Activity"}
            page={"activity"}
            items={["All Activity", "Starred"]}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredRows?.length || 0}
            onUploadClick={handleUploadClick}
            onSearch={handleSearch}
            latestUpdateTime={latestUpdateTime?.difference}
            onSelectedItem={handleSelectedHeaderItem}
            onPinChange={handlePinChange}
            onApplyFilters={applyFiltersAndFetch}
            appliedFilters={appliedFilters}
            createPermission={isCreate}
            searchPermission={isSearch}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <ActivityModal open={modalOpen} handleClose={handleModalClose} />
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHeader2 tableData={tableData2} page={"activity"} />
              <ActivityTabTableBody data={currentData} tab={"Interactions"} />
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

export default Activity;
