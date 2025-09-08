import React, { createContext, useEffect, useState } from 'react';
import { BaseURL } from '../constants/Baseurl';
import axios from 'axios';
import { Authorization_header } from '../utils/helper/Constant';
import toast from 'react-hot-toast';

export const EmployeeContext = createContext();

export const EmployeesProvider = ({ children }) => {
    const [employeesSheets, setEmployeesSheets] = useState([]);
    const [loading, setLoading] = useState(false);
    

    // useEffect(() => {
    //     fetchEmployeesSheets();
    // }, [sortParams])

    

    function getAccessToken() {
        const tokens = localStorage.getItem('tokens');
        const token_obj = JSON.parse(tokens);
        return token_obj?.accessToken || '';
      }

    const fetchEmployeesSheets = async (options = {}) => {
        setLoading(true);

        const url = `${BaseURL}/api/v1/contacts/get-employee-sheets`;
        try {
            toast.loading("Fetching projects data");
            const config = {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                }
            };
            const response = await axios.get(url, config);
            setEmployeesSheets(response?.data?.data)
            setLoading(false);
        } catch (err) {
            console.error(err);
            // toast.error("Error in fetching Employee data");
            
        }
    };

    return (
        <EmployeeContext.Provider
            value={{
                fetchEmployeesSheets,
                employeesSheets,
                // getEmployeeSortParams
            }}
        >{children}</EmployeeContext.Provider>
    )
}