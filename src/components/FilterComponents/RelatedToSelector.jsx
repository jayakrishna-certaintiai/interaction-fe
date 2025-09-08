import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

const RelatedToSelector = ({ relatedTo, relation, setRelation }) => (
  <>
    <FilterCustomAutocomplete
      label=""
      placeholder="Select Related To"
      options={relatedTo?.map((relation) => relation) ?? []}
      value={relation}
      onChange={(event, newValue) => {
        setRelation(newValue ?? "");
      }}
      inputValue={relation}
      onInputChange={(event, newInputValue) => {
        setRelation(newInputValue ?? "");
      }}
      heading={"Related To"}
    />
  </>
);

export default RelatedToSelector;
