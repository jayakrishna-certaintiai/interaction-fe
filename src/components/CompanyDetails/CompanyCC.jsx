import React, { useState } from 'react'
import MainPanelHeader from '../Common/MainPanelHeader';
import { useHasAccessToFeature } from '../../utils/helper/HasAccessToFeature';
import SurveyCC from '../Common/SurveyCC';

const CompanyCC = ({ tab, companyId, projectId }) => {
    const [selectedSubTab, setSelectedSubTab] = useState("Survey");
    const arr = [
        {name: "Survey", isAuth: useHasAccessToFeature("F010", "P000000003")},
        {name: "Interaction", isAuth: useHasAccessToFeature("F010", "P000000003")},
    ];
    const handleSelectedTab = (tab) => {
        setSelectedSubTab(tab);
    };
  return (
    <>
        <MainPanelHeader arr={arr} first={arr[0]?.name} onSelectedChange={handleSelectedTab} />
        <SurveyCC tab={tab} subTab={selectedSubTab} companyId={companyId} projectId={projectId} />
    </>
  )
}

export default CompanyCC;