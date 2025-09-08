import { createContext, useEffect, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { useAuthContext } from "./AuthProvider";
import axios from "axios";
import { Authorization_header } from "../utils/helper/Constant";
import { BaseURL } from "../constants/Baseurl";

export const ProjectTeammemberContext = createContext();

export const ProjectTeamProvider = ({ children }) => {
    const { pinnedObject } = usePinnedData();
    const [teamMembers, setTeamMembers] = useState([]);
    const [filter, setFilter] = useState(null);
    const [triggerClear, setTriggerClear] = useState(false);
    const [projectTeamFilterState, setProjectTeamFilterState] = useState({
        contactId: [],
        companyId: [],
        contactName: [], // Only one instance of contactName
        company: [],
        projectCode: [],
        projectName: [],
        totalExpense: [null, null],
        rndExpense: [null, null],
        rndPotential: [null, null],
        totalHours: [null, null],
        employementType: [],
        hourlyRate: [null, null]
    });

    const [sortParams, setSortParams] = useState({ sortField: null, sortOrder: null });
    const [currentState, setCurrentState] = useState(
        pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Project Team Members"
    );
    const [loading, setLoading] = useState(false);
    const [appliedTeamSortParams, setAppliedSortParams] = useState("");
    const [appliedTeamFilterParams, setAppliedFilterParams] = useState("");
    const { logout } = useAuthContext();

    function getAccessToken() {
        const tokens = localStorage.getItem("tokens");
        const token_obj = JSON.parse(tokens);
        return token_obj?.accessToken || "";
    }

    function getProjectTeamSortParams({ sortField, sortOrder }) {
        switch (sortField) {
            case "Employee ID":
                sortField = "employeeId";
                break;
            case "Employee Name":
                sortField = "firstName";
                break;
            case "Employement Type":
                sortField = "employementType";
                break;
            case "Role":
                sortField = "employeeTitle";
                break;
            case "Company Name":
                sortField = "companyName";
                break;
            case "Project Ids":
                sortField = "projectCode";
                break;
            case "Project Name":
                sortField = "projectName"
                break;
            case "Total Hours":
                sortField = "totalHours";
                break;
            case "Hourly Rate":
                sortField = "hourlyRate";
                break;
            case "Total Expense":
                sortField = "totalCost";
                break;
            case "QRE Potential (%)":
                sortField = "rndPotential";
                break;
            case "R&D Credits":
                sortField = "rndCredits";
                break;
            case "QRE Cost":
                sortField = "qreCost";
                break;
            default:
                sortField = null;
                break;
        };
        setSortParams({ sortField: sortField, sortOrder: sortOrder });
    }

    useEffect(() => {
        setFilter(null);
    }, [triggerClear]);



    useEffect(() => {
        getProjectsTeamMembers();
    }, [sortParams, filter])

    const getProjectsTeamMembers = async () => {
        setTriggerClear(false);
        setLoading(true);
        try {
        if (window.location.pathname !== "/projects-team") return;
            const queryParams = new URLSearchParams();
            if (filter?.teamMembers && filter?.teamMembers?.length) queryParams.append("teamMembers", JSON.stringify(filter?.teamMembers));
            if (filter?.employeeIds && filter?.employeeIds?.length) queryParams.append("employeeIds", JSON.stringify(filter?.employeeIds));
            if (filter?.employeeTitles && filter?.employeeTitles?.length) queryParams.append("employeeTitles", JSON.stringify(filter?.employeeTitles));
            if (filter?.names && filter?.names?.length) queryParams.append("names", JSON.stringify(filter?.names));
            if (filter?.employementTypes && filter?.employementTypes?.length) queryParams.append("employementTypes", JSON.stringify(filter?.employementTypes));
            if (filter?.companyIds && filter?.companyIds?.length) queryParams.append("companyIds", JSON.stringify(filter?.companyIds));
            if (filter?.projectIds && filter?.projectIds?.length) queryParams.append("projectIds", JSON.stringify(filter?.projectIds));
            if (filter?.projectCodes && filter?.projectCodes?.length) queryParams.append("projectCodes", JSON.stringify(filter?.projectCodes));
            if (filter?.projectNames && filter?.projectNames?.length) queryParams.append("projectNames", JSON.stringify(filter?.projectNames));
            if (filter?.hourlyRate && filter?.hourlyRate?.length) queryParams.append("hourlyRates", JSON.stringify(filter?.hourlyRate));
            if (filter?.totalHours && filter?.totalHours?.length) queryParams.append("totalHourses", JSON.stringify(filter?.totalHours));
            if (filter?.totalCosts && filter?.totalCosts?.length) queryParams.append("totalCosts", JSON.stringify(filter?.totalCosts));
            if (filter?.qreCosts && filter?.qreCosts?.length) queryParams.append("qreCosts", JSON.stringify(filter?.qreCosts));
            if (filter?.rndPotentials && filter?.rndPotentials?.length) queryParams.append("rndPotentials", JSON.stringify(filter?.rndPotentials));
            setTriggerClear(false);
            if (sortParams?.sortField && sortParams?.sortOrder) {
                queryParams.append("sortField", sortParams.sortField);
                queryParams.append("sortOrder", sortParams.sortOrder);
            }
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/contacts/get-team-members?${queryString && queryString}`;
            const response = await axios.get(url, Authorization_header());
            setTeamMembers(response?.data?.list);
            setAppliedSortParams(response?.data?.appliedSort);
            setAppliedFilterParams(response?.data?.appliedFilter);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                logout(); // Optionally handle unauthorized access by logging out
            }
        } finally {
            setLoading(false);
        }
    };

    const getFilterstate = (filter) => {
        setFilter(filter);
    }

    return (
        <ProjectTeammemberContext.Provider
            value={{
                teamMembers,
                getProjectsTeamMembers,
                currentState,
                setCurrentState,
                loading,
                getProjectTeamSortParams,
                getFilterstate,
                triggerClear,
                setTriggerClear,
                appliedTeamFilterParams,
                appliedTeamSortParams
            }}
        >
            {children}
        </ProjectTeammemberContext.Provider>
    );
};
