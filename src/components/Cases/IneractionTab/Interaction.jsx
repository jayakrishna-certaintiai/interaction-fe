import React, { useContext, useEffect, useState } from "react";
import CaseInteractionListing from "./CaseInteractionListing";
import CaseInteractionDetails from "./CaseInteractionDetails";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import toast, { Toaster } from "react-hot-toast";
import { CaseContext } from "../../../context/CaseContext";

const Interaction = ({ usedfor, caseId, projectId }) => {
  const [showIntercationListing, setShowInteractionListingPage] =
    useState(true);
  const [interactionId, setInteractionId] = useState();
  const [intrIndentifier, setIntrIndentifier] = useState();
  const { caseFilterState } = useContext(CaseContext);

  const handleShowInteractionListing = () => {
    setShowInteractionListingPage(!showIntercationListing);
  };

  const handleInteractionId = (id = null, indentifier = null) => {
    setInteractionId(id);
    setIntrIndentifier(indentifier);
  };

  useEffect(() => {
    setShowInteractionListingPage(true);
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
      {showIntercationListing ? (
        <CaseInteractionListing
          handleShowInteractionListing={handleShowInteractionListing}
          handleInteractionId={handleInteractionId}
          usedfor={usedfor}
          caseId={caseId}
          projectId={projectId}
          onApplyFilters={applyFiltersAndFetch}
          appliedFilters={appliedFilters}
        />
      ) : (
        <CaseInteractionDetails
          handleShowInteractionListing={handleShowInteractionListing}
          interactionId={interactionId}
          intrIndentifier={intrIndentifier}
        />
      )}
      <Toaster />
    </>
  );
};

export default Interaction;
