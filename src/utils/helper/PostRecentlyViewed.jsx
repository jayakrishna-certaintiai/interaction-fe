import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header, token_obj } from "./Constant";

export const postRecentlyViewed = async (viewedId, viewedEntity) => {
  const data = JSON.stringify({
    viewedId,
    viewedEntity,
    viewedUITime: new Date().toISOString(),
  });

  const config = {
    method: "post",
    url: `${BaseURL}/api/v1/recently-viewed/${localStorage.getItem("userid")}/create-recently-viewed`,
    data: data,
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.accessToken}`
    }
  };
  try {
    const response = await axios.request(config);
  } catch (error) {
    console.error("Error posting recently viewed:", error);
  }
};
