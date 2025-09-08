import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";

export const fetchRecentlyViewed = async (entityType) => {
  try {
    const response = await axios.get(
      `${BaseURL}/api/v1/recently-viewed/${localStorage.getItem(
        "userid"
      )}/get-recently-viewed?recentlyViewedFilters=${entityType}`
    );
    return response?.data?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
