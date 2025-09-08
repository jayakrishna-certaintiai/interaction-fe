import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ActivityTypeSelector from "../FilterComponents/ActivityTypeSelector";
import ContactSelector from "../FilterComponents/ContactSelector";
import DateSelector from "../FilterComponents/DateSelector";
import StatusSelector from "../FilterComponents/StatusSelector";
import { ActivityContext } from "../../context/ActivityContext";

const statuses = ["Active", "Inactive"];
const activities = ["Interactions"];

function ActivityFilter() {
  const {
    activityFilterState,
    setActivityFilterState,
    clearActivityFilterCounter,
  } = useContext(ActivityContext);
  const [activity, setActivity] = useState("");
  const [status, setStatus] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");

  const handleDateChangeFrom = (event) => {
    setSelectedDateFrom(event.target.value);
  };
  const handleDateChangeTo = (event) => {
    setSelectedDateTo(event.target.value);
  };
  
  useEffect(() => {
    setActivityFilterState({
      ...activityFilterState,
      interactionActivityType: [activity],
      activityType: activity,
    });
  }, [activity]);
  useEffect(() => {
    setActivityFilterState({
      ...activityFilterState,
      interactionTo: [sentTo],
      sentTo: sentTo,
    });
  }, [sentTo]);
  useEffect(() => {
    setActivityFilterState({
      ...activityFilterState,
      from: selectedDateFrom,
      dateFrom: selectedDateFrom,
    });
  }, [selectedDateFrom]);
  useEffect(() => {
    setActivityFilterState({
      ...activityFilterState,
      to: selectedDateTo,
      dateTo: selectedDateTo,
    });
  }, [selectedDateTo]);
  useEffect(() => {
    setActivityFilterState({
      ...activityFilterState,
      activityStatus: [status],
      status: status,
    });
  }, [status]);

  useEffect(() => {
    setActivity("");
    setStatus("");
    setSentTo("");
    setSelectedDateFrom("");
    setSelectedDateTo("");
  }, [clearActivityFilterCounter]);

  return (
    <Box>
      <ActivityTypeSelector
        activities={activities}
        activity={"Interactions"}
        setActivity={setActivity}
      />
      <DateSelector
        label="From"
        name="activityDateFrom"
        value={selectedDateFrom}
        onChange={handleDateChangeFrom}
      />
      <DateSelector
        label="To"
        name="activityDateTO"
        value={selectedDateTo}
        onChange={handleDateChangeTo}
      />
      <StatusSelector
        statuses={statuses}
        status={status}
        setStatus={setStatus}
      />
      <ContactSelector contact={sentTo} setContact={setSentTo} />
    </Box>
  );
}

export default ActivityFilter;
