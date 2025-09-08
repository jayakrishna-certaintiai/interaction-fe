import { createContext, useEffect, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { useAuthContext } from "./AuthProvider";
import axios from "axios";
import { Authorization_header } from "../utils/helper/Constant";
import { BaseURL } from "../constants/Baseurl";

export const UploadedSheetsContext = createContext();

export const UploadedSheetsProvider = ({ children }) => {
    const { pinnedObject } = usePinnedData();
    const [sheets, setSheets] = useState([]);
    const [sortParams, setSortParams] = useState({ sortField: null, sortOrder: null });
    const [currentState, setCurrentState] = useState(
        pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Uploaded Sheets"
    );
    const [loading, setLoading] = useState(false);
    const [appliedTeamSortParams, setAppliedSortParams] = useState("");
    const [appliedTeamFilterParams, setAppliedFilterParams] = useState("");
    const { logout } = useAuthContext();

    const getUploadedSheetsSortParams = () => {};
};