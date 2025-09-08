import React, { createContext, useState } from 'react'
import { BaseURL } from '../constants/Baseurl';
import axios from 'axios';
import { Authorization_header } from '../utils/helper/Constant';

export const WagesContext = createContext();

export const WagesProvider = ({ children }) => {
    const [employeesMapperData, setEmployeesMapperData] = useState([]);
    const [wagesMapperData, setWagesMapperData] = useState([]);
    const [teamsMapperData, setTeamsMapperData] = useState([]);

    // Fetch Employees Mapper Attribues API 
    const fetchEmployeesMapperAttributes = async (companyId) => {
        try {
            const api = `${BaseURL}/api/v1/contacts/${companyId}/get-employee-mapper`
            const response = await axios.get(api, Authorization_header());
            setEmployeesMapperData(response?.data?.data?.employeesMapperValues)
        } catch (error) {
            console.error(error);
        }
    }

    // Post Employees MApper Attributes API
    const postEmployeesMapperAttributes = async (companyId, values) => {
        const api = `${BaseURL}/api/v1/contacts/${companyId}/employee-mapper`
        try {
            const response = await axios.post(api, values, Authorization_header());
        } catch (error) {
            console.error(error);
        }
    }

    const setNewEmployeesMapperAttribues = (values) => {
        const newEmployeeMapper = {};
        for (let key in employeesMapperData) {
            newEmployeeMapper[key] = values[key];
        }

        setEmployeesMapperData(newEmployeeMapper);
    }

    //Fetch Wages Mapper Api
    const fetchWagesMapperAttributes = async (companyId) => {
        try {
            const api = `${BaseURL}/api/v1/contacts/${companyId}/get-wages-mapper`;
            const response = await axios.get(api, Authorization_header());
            setWagesMapperData(response?.data?.data?.wagesMapperValues);
        } catch (error) {
            console.error(error);

        }
    };

    //post wages mapper api
    const postWagesMapperAttributes = async (companyId, values) => {
        const api = `${BaseURL}/api/v1/contacts/${companyId}/wages-mapper`;
        try {
            const response = await axios.post(api, values, Authorization_header());
        } catch (error) {
            console.error(error);

        }
    };

    const setNewWagesMapperAttributes = (values) => {
        const newWagesMapper = {};
        for (let key in wagesMapperData) {
            newWagesMapper[key] = values[key];
        }
        setWagesMapperData(newWagesMapper);
    }

    //Fetch teams Mapper Api
    const fetchTeamsMapperAttributes = async (companyId) => {
        try {
            const api = `${BaseURL}/api/v1/contacts/${companyId}/get-wages-mapper`;
            const response = await axios.get(api, Authorization_header());
            setTeamsMapperData(response?.data?.data?.teamsMapperData);
        } catch (error) {
            console.error(error);

        }
    };

    //post teams mapper api
    const postTeamsMapperAttributes = async (companyId, values) => {
        const api = `${BaseURL}/api/v1/contacts/${companyId}/wages-mapper`;
        try {
            const response = await axios.post(api, values, Authorization_header());
        } catch (error) {
            console.error(error);

        }
    };

    const setNewTeamsMapperAttributes = (values) => {
        const newWagesMapper = {};
        for (let key in wagesMapperData) {
            newWagesMapper[key] = values[key];
        }
        setTeamsMapperData(newWagesMapper);
    }

    const contextValues = {
        fetchEmployeesMapperAttributes,
        postEmployeesMapperAttributes,
        setNewEmployeesMapperAttribues,
        employeesMapperData: employeesMapperData,
        fetchWagesMapperAttributes,
        postWagesMapperAttributes,
        setNewWagesMapperAttributes,
        wagesMapperData: wagesMapperData,
        fetchTeamsMapperAttributes,
        postTeamsMapperAttributes,
        setNewTeamsMapperAttributes,
        teamsMapperData: teamsMapperData,


    };


    return (
        <WagesContext.Provider value={contextValues}> {children} </WagesContext.Provider>

    )
}

export default WagesContext