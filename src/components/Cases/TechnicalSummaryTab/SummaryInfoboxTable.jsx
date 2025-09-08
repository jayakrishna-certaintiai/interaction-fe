import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import TechnicalSummaryListing from './TechnicalSummaryListing';
import TechnicalSummaryDetail from './TechnicalSummaryDetail';
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import toast from "react-hot-toast";
import { CaseContext } from '../../../context/CaseContext';

const TechnicalSummary = ({ usedfor, caseId, projectId }) => {
  const [showSummaryListingTab, setShowSummaryListingPage] = useState(true);
  const [TechnicalSummaryId, setTechnicalSummaryId] = useState("");
  const { caseFilterState } = useContext(CaseContext);


  const handleShowSummaryListing = () => {

    setShowSummaryListingPage(!showSummaryListingTab);
  }

  const getTechnicalSummaryId = (id = null) => {
    setTechnicalSummaryId(id);
  }

  useEffect(() => {
    setShowSummaryListingPage(true);
  }, [caseId, projectId]);


  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      // fetchProjects(filters);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const appliedFilters = {
    company: caseFilterState.company,
  };

  return (
    <>
      <Box>
        {showSummaryListingTab ? <TechnicalSummaryListing handleShowSummaryListing={handleShowSummaryListing} getTechnicalSummaryId={getTechnicalSummaryId}
          usedfor={usedfor}
          caseId={caseId}
          projectId={projectId}
          onApplyFilters={applyFiltersAndFetch}
          appliedFilters={appliedFilters}

        /> : <TechnicalSummaryDetail handleShowSummaryListing={handleShowSummaryListing} TechnicalSummaryId={TechnicalSummaryId} usedfor={usedfor} caseId={caseId} projectId={projectId} />}
      </Box>
    </>
  )
}

export default TechnicalSummary