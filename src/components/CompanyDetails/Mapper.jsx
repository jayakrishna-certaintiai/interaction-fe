import React, { useState } from 'react'
import MainPanelHeader from '../Common/MainPanelHeader';
import { useHasAccessToFeature } from '../../utils/helper/HasAccessToFeature';
import ProjectsMapper from './ProjectsMapper';
import EmployeesMapper from './EmployeesMapper';
import WagesMapper from './WagesMapper';
import TeamMembersMapper from './TeamMembersMapper';

const Mapper = ({ companyId }) => {
    const [selectedTab, setSelectedTab] = useState("Projects");
    const arr = [
        { name: "Projects", isAuth: useHasAccessToFeature("F010", "P000000003") },
        // { name: "Employees", isAuth: useHasAccessToFeature("F010", "P000000003") },
        // { name: "Wages", isAuth: useHasAccessToFeature("F010", "P000000003") },
        // { name: "Team Members", isAuth: useHasAccessToFeature("F010", "P000000003") },
    ]

    const handleSelectedTab = (tab) => {
        setSelectedTab(tab);
    }

    return (
        <>
            <MainPanelHeader arr={arr} first={arr[0]?.name} onSelectedChange={handleSelectedTab} />
            {selectedTab === "Projects" && (
                <>
                    <ProjectsMapper companyId={companyId} selectedTab={selectedTab} />
                </>
            )}
            {/* {selectedTab === "Employees" && (
                <>
                    <EmployeesMapper companyId={companyId} selectedTab={selectedTab} />
                </>
            )}
            {selectedTab === "Wages" && (
                <>
                    <WagesMapper companyId={companyId} selectedTab={selectedTab} />
                </>
            )}
            {selectedTab === "Team Members" && (
                <>
                    <TeamMembersMapper companyId={companyId} selectedTab={selectedTab} />
                </>
            )} */}
        </>
    )
}

export default Mapper