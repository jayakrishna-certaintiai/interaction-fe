import React, { createContext, useEffect, useState } from 'react';
import { BaseURL } from '../constants/Baseurl';
import axios from 'axios';
import { Authorization_header } from '../utils/helper/Constant';

export const SheetsContext = createContext();

export const SheetsProvider = ({ children }) => {
    const [projectsSheets, setProjectsSheets] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjectsSheets = async (options) => {
        setLoading(true);
        const url = `${BaseURL}/api/v1/projects/get-projects-sheets`;
        try {
            const response = await axios.get(url, Authorization_header());
            setProjectsSheets(response?.data?.data)
            setLoading(false);
        
        } catch (err) {
            console.error(err);
        }
    }



    return (
        <SheetsContext.Provider
            value={{
                fetchProjectsSheets,
                projectsSheets
            }} 
        >{children}</SheetsContext.Provider>
    )
}
// export default SheetsContext