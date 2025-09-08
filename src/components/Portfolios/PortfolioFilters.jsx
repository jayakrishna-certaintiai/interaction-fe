import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { PortfolioContext } from "../../context/PortfolioContext";
import CompanySelector from "../FilterComponents/CompanySelector";
import SliderInput from "../FilterComponents/SliderInput";

function PortfolioFilters({ clientData }) {
  const { portfolioFilters, setPortfolioFilters, clearPortfolioFilterTrigger } =
    useContext(PortfolioContext);
  const [company, setCompany] = useState(portfolioFilters.company);

  const handleFilterChange = (field) => (event, newValue) => {
    const value = newValue ?? event.target.value;

    setPortfolioFilters({
      ...portfolioFilters,
      [field]: value,
    });
  };
  useEffect(() => {
    setPortfolioFilters({
      ...portfolioFilters,
      companyId: [
        clientData?.find((client) => client?.companyName === company)
          ?.companyId,
      ],
      company: company,
    });
  }, [company]);
  useEffect(() => {
    if (clearPortfolioFilterTrigger) {
      setCompany("");
      setPortfolioFilters({
        ...portfolioFilters,
        companyId: [],
        NoOfProjects: [1, 500],
        company: "",
      });
    }
  }, [clearPortfolioFilterTrigger]);

  return (
    <Box>
      <CompanySelector
        clients={clientData}
        company={company}
        setCompany={setCompany}
      />
      <SliderInput
        minWidth={220}
        label="No. Of Projects"
        value={portfolioFilters?.NoOfProjects}
        onChange={handleFilterChange("NoOfProjects")}
        min={0}
        max={10000}
      />
    </Box>
  );
}

export default PortfolioFilters;
