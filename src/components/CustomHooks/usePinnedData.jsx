import { useContext } from "react";
import { FilterListContext } from "../../context/FiltersListContext";
import { parsePinnedString } from "../../utils/helper/ParsePinnedString";

const usePinnedData = () => {
  const { pinString } = useContext(FilterListContext);
  const pinnedObject = parsePinnedString(pinString);
  return { pinnedObject };
};

export default usePinnedData;
