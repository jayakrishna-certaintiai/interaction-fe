import axios from "axios";

export const fetchCitiesForStateAndCountry = async (country, state) => {
  try {
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: country,
        state: state
      }
    );
    if (response?.data && response?.data?.data) {
      return response?.data?.data;
    } else {

      return [];
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    // throw error;
  }
};
