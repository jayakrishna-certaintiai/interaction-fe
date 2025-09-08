import axios from "axios";

export const fetchStatesForCountry = (country) => {
  return axios.post("https://countriesnow.space/api/v0.1/countries/states", {
    country: country,
  }).then(response => {
    if (response?.data && response?.data?.data) {
      return response?.data?.data?.states;
    } else {
      throw new Error('States data not found');
    }
  }).catch(error => {
    console.error("Error fetching states:", error);
    return [];
  });
};

