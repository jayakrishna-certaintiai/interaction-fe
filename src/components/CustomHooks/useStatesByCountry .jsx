import { useState, useEffect } from 'react';
import axios from 'axios';
import { Authorization_header } from '../../utils/helper/Constant';

export const useStatesByCountry = (country) => {
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!country) {
      setStates([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
          country
        });
        setStates(response?.data?.data?.states || []);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [country]);

  return { states, isLoading, error };
};
