import { Box, Paper } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineReply } from "react-icons/md";
import { TiArrowForward } from "react-icons/ti";
import ActivityInfoboxTable from "../../components/Activity/ActivityInfoBoxTable";
import ActivityInfoHeader from "../../components/Activity/ActivityInfoHeader";
import ReplyModal from "../../components/Activity/ReplyModal";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
import RichTextEditor from "../../components/Common/RichTextEditor";
import SearchboxBody from "../../components/Common/SearchboxBody";
import SearchboxHeader from "../../components/Common/SearchboxHeader";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import FilledButton from "../../components/button/FilledButton";
import { BaseURL } from "../../constants/Baseurl";
import { ActivityContext } from "../../context/ActivityContext";
import { useAuthContext } from "../../context/AuthProvider";
import { FilterListContext } from "../../context/FiltersListContext";
import { NotificationContext } from "../../context/NotificationContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import {
  getDateWithTime,
  getTimeDifference,
} from "../../utils/helper/UpdateTimeDifference";

const fieldMapping = {
  Field0: "interactionCategory",
  Field1: "interactionSubject",
  Field2: "status",
  Field3: "relatedTo",
};

function ActivityInfo() {
  const arr = [
    {
      name: "Interactions",
      isAuth: useHasAccessToFeature("F023", "P000000003"),
    },
  ];
  const { pinnedObject } = usePinnedData();
  const [noteModal, setNoteModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Interaction");
  const [data, setData] = useState(null);
  const [ActivityData, setActivityData] = useState(null);
  const [InteractionData, setInteractionData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const { authState } = useAuthContext();
  const {
    activityFilterState,
    setIsActivityFilterApplied,
    fetchActivityData,
    activityData,
    currentState,
    setCurrentState,
  } = useContext(ActivityContext);
  const { fetchUserDetails } = useContext(FilterListContext);
  const [pinStates, setPinStates] = useState({
    "All Activity": false,
    Starred: false,
  });

  const handleNoteModalClose = () => {
    setNoteModal(false);
  };

  const handleSelectedItem = (selectedItemData) => {
    setData(selectedItemData);
  };

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  const activityId = data?.interactionID;

  const appliedFilters = {
    ActivityType: activityFilterState.activityType,
    SentTo: activityFilterState.sentTo,
    Date: activityFilterState.date,
    ActivityStatus: activityFilterState.status,
  };

  useEffect(() => {
    setCurrentState(
      pinnedObject?.AI === "Starred" ? "Starred" : "All Activity"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const shouldFetchWithFiltersActivity =
      activityFilterState.interactionActivityType.length > 0 ||
      activityFilterState.interactionTo.length > 0 ||
      activityFilterState.status !== "" ||
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/interactions/${localStorage.getItem("userid")}/${authState?.userInfo?.companyId
          }/get-interactions`

        );


        setActivityData(response?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activityId) {
          const response2 = await axios.get(
            `${BaseURL}/api/v1/interactions/${localStorage.getItem("userid")}/${authState?.userInfo?.companyId
            }/get-interaction-detail/${activityId}`
          );

          setInteractionData(response2.data.data);
        } else {
          console.error("interactionID not available in data object");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    const timeDifference = getTimeDifference(ActivityData, "modifiedTime");
    setLatestUpdateTime(timeDifference);
  }, [ActivityData]);

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    if (activityData) {
      const filteredData = activityData?.filter(
        (task) =>
          task?.interactionSubject
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          task?.interactionID?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.companyId?.toString()?.includes(search) ||
          task?.status?.toString()?.includes(search) ||
          task?.relatedTo?.toString()?.includes(search)
        // Add more conditions as needed relatedTo
      );
      setFilteredRows(filteredData);
    }
  }, [activityData, search]);

  const { updateAlertCriteria } = useContext(NotificationContext);

  useEffect(() => {
    const pageName = "activity";
    const relationId = activityId;

    updateAlertCriteria(pageName, relationId);

    return () => updateAlertCriteria(null, null);
  }, [activityId]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const isDownload = useHasAccessToFeature("F023", "P000000006");

  useEffect(() => {
    const updatedPinStates = {
      "All Activity": pinnedObject.AI === "ALL",
      Starred: pinnedObject.AI === "Starred",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.AI]);

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
      const newStateValue = newState === "All Activity" ? "ALL" : "Starred";

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
        sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 3 }}
      >
        <Paper
          sx={{
            display: "flex",
            width: "23%",
            borderRadius: "20px",
            flexDirection: "column",
            height: "100vh",
            mb: 3,
            overflowY: "hidden",
            boxShadow: "0px 3px 6px #0000001F",
            // scrollbarWidth: "none",
            // msOverflowStyle: "none",
            // "&::-webkit-scrollbar": {
            //   display: "none",
            // },
          }}
        >
          <SearchboxHeader
            type={pinnedObject?.AI === "ALL" ? "All Activity" : "Starred"}
            items={["All Activity", "Starred"]}
            data={filteredRows}
            onSearch={handleSearch}
            latestUpdateTime={latestUpdateTime?.difference}
            page="activity"
            onApplyFilters={applyFiltersAndFetch}
            searchPermission={useHasAccessToFeature("F023", "P000000009")}
            onSelectedItem={handleSelectedHeaderItem}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <Box sx={{ overflowY: "auto" }}>
            <SearchboxBody
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
              page={"activity"}
              downloadPermission={isDownload}
            />
          </Box>
        </Paper>
        <Box sx={{ width: "77%", display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              borderRadius: "20px",
              boxShadow: "0px 3px 6px #0000001F",
              mb: 3,
            }}
          >
            <ActivityInfoHeader
              head={
                data?.interactionSubject || "Uncertain Hours Reconciliation"
              }
            />
            <ActivityInfoboxTable data={data} />
          </Paper>
          <Box sx={{ display: "flex", gap: "20px", mb: 2 }}>
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
              {useHasAccessToFeature("F023", "P000000003") &&
                selectedTab === "Interaction" && (
                  <div
                    style={{
                      maxHeight: "61vh",
                      overflowY: "scroll",
                      margin: "10px 24px",
                    }}
                  >
                    {InteractionData?.length === 0 ? (
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "500",
                          color: "#FD5707",
                          textAlign: "center",
                          marginTop: "2rem",
                        }}
                      >
                        No Interaction available for this activity.
                      </div>
                    ) : (
                      <>
                        {InteractionData?.map((item, index) => {
                          return (
                            <div
                              key={item}
                              style={{
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "10px",
                                backgroundColor:
                                  index % 2 ? "#E5F7F5" : "#e4e4e4",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div className="body-text">
                                  To :
                                  {item?.interactionTo &&
                                    JSON.parse(
                                      item?.interactionTo?.replace(/'/g, '"')
                                    )?.join(" ")}
                                </div>
                                <div className="body-text">
                                  {getDateWithTime(item?.interactionTime)}
                                </div>
                              </div>
                              <div className="body-text">
                                CC:{" "}
                                {item?.ccRecipients &&
                                  JSON.parse(
                                    item?.ccRecipients?.replace(/'/g, '"')
                                  )?.join(" ")}
                              </div>
                              <div
                                className="body-text"
                                style={{ marginBottom: "10px" }}
                              >
                                Subject: {item?.interactionSubject}
                              </div>
                              <div className="body-text">
                                <RichTextEditor
                                  content={item?.interactionDesc}
                                />
                              </div>
                            </div>
                          );
                        })}
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            margin: "20px",
                          }}
                        >
                          <FilledButton
                            btnname="Reply"
                            onClick={() => setNoteModal(!noteModal)}
                            Icon={<MdOutlineReply />}
                          />
                          {/* <FilledButton
                            btnname="Forward"
                            onClick={() => }
                            Icon={<TiArrowForward />}
                          /> */}
                        </div>
                      </>
                    )}
                  </div>
                )}
            </Paper>
            <ReplyModal open={noteModal} handleClose={handleNoteModalClose} />
          </Box>
        </Box>
      </Box>
      <Toaster />
    </>
  );
}

export default ActivityInfo;
