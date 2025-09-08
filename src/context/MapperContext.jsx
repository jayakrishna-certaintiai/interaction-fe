import React, { createContext, useState } from 'react'
import { BaseURL } from '../constants/Baseurl';
import axios from 'axios';
import { Authorization_header } from '../utils/helper/Constant';

export const MapperContext = createContext();

export const MapperProvider = ( {children} ) => {
    const [projectsMapperData, setProjectsMapperData] = useState([])

    const fetchProjectsMapperAttributes = async (companyId) => {
        try {
        const api = `${BaseURL}/api/v1/projects/${companyId}/get-project-mapper`
        const response = await axios.get(api, Authorization_header());
        setProjectsMapperData(response?.data?.data)
        } catch (error) {
            console.error(error);
        }
    } 

    const postProjectsMapperAttributes = async (companyId, values) => {
        const api = `${BaseURL}/api/v1/projects/${companyId}/update-project-mapper`
        try {
            const response = await axios.post(api,values, Authorization_header());
            fetchProjectsMapperAttributes(companyId);
        } catch (error) {
            console.error(error);
        }
    }

    const setNewProjectsMapperAttribues = (values) => {
        const newProjectMapper = {};
        for (let key in projectsMapperData) {
            newProjectMapper[key] = values[key];
        }

        setProjectsMapperData(newProjectMapper);
    }

    const contextValues = {fetchProjectsMapperAttributes, postProjectsMapperAttributes, setNewProjectsMapperAttribues, projectsMapperData: projectsMapperData};

    return (
        <MapperContext.Provider value={contextValues}> { children } </MapperContext.Provider>
    )
}

export default MapperContext