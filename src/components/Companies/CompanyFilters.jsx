import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import LocationFilter from "../FilterComponents/LocationFilter";
import TypeFilter from "../FilterComponents/TypeFilter";
import SliderInput from "../FilterComponents/SliderInput";
import { ClientContext } from "../../context/ClientContext";

const locations = ["Canada", "USA", "United Kingdom"];
const types = ["Product", "Services"];
function CompanyFilters() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const { clientFilters, setClientFilters, clearClientFilterTrigger } =
    useContext(ClientContext);

  const handleFilterChange = (field) => (event, newValue) => {
    const value = newValue ?? event.target.value;

    setClientFilters({
      ...clientFilters,
      [field]: value,
    });
  };

  useEffect(() => {
    setClientFilters({
      ...clientFilters,
      type: type,
      location: location,
    });
  }, [location, type]);

  useEffect(() => {
    if (clearClientFilterTrigger) {
      setType("");
      setLocation("");
      setClientFilters({
        ...clientFilters,
        type: "",
        NoOfProjects: [1, 500],
        location: "",
      });
    }
  }, [clearClientFilterTrigger]);
  return (
    <Box>
      <LocationFilter
        locations={locations}
        location={location}
        setLocation={setLocation}
      />
      <TypeFilter types={types} type={type} setType={setType} />
      <SliderInput
        minWidth={220}
        label="No. Of Projects"
        // value={[0,2000]}
        value={clientFilters?.NoOfProjects}
        onChange={handleFilterChange("NoOfProjects")}
        min={0}
        max={2000}
      />
    </Box>
  );
}

export default CompanyFilters;
