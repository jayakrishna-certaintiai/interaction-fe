import { useState, useEffect } from 'react';
import axios from 'axios';
import { Authorization_header } from '../../utils/helper/Constant';

export const useCitiesByState = (country, state) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!country || !state) {
      setCities([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
          country,
          state
        });
        setCities(response?.data?.data || []);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [country, state]);

  return { cities, isLoading, error };
};
