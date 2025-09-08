
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";
import toast from "react-hot-toast";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { options } from "marked";

let sessionExpiredToastShown = false;

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [docFilterState, setDocFilterState] = useState({
    companyId: [],
    status: [],
    projectId: [],
    document: [],
    company: [],
    project: [],
    rndPotential: [0, null],
  });
  const [clearFilterTrigger, setClearFilterTrigger] = useState(false);
  const [isDocFilterApplied, setIsDocFilterApplied] = useState(false);
  const [sortParams, setSortPrams] = useState({ sortOrder: null, sortField: null });
  const [documentFilterOption, setDocumentFilterOption] = useState({});
  const [documentFilterFields, setDocumentFilterFields] = useState("");
  const [documentSortFields, setDocumentSortFields] = useState("");
  const { pinnedObject } = usePinnedData();
  const [currentState, setCurrentState] = useState(
    pinnedObject?.DOCUMENTS === "RV" ? "Recently Viewed" : "All Documents"
  );

  

  const showSessionExpiredToast = () => {
    if (!sessionExpiredToastShown) {
      toast.error("Session expired, you need to login again");
      sessionExpiredToastShown = true;
  
      // Reset the flag after a few seconds to allow future toasts if needed
      setTimeout(() => {
        sessionExpiredToastShown = false;
      }, 10000); // Adjust delay as needed
    }
  };

  const triggerClearFilters = () => {
    setClearFilterTrigger(!clearFilterTrigger);
    setIsDocFilterApplied(false);
  };
  const { logout } = useAuthContext();

  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }

  const getDocumentsSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Document Name":
        sortField = "documentName";
        break;
      case "Account":
        sortField = "companyName";
        break;
      case "Category":
        sortField = "documentType";
        break;
      case "QRE Potential (%)":
        sortField = "rd_score";
        break;
      case "Status":
        sortField = "aistatus";
        break;
      case "Project Name":
        sortField = "projectName";
        break;
      case "Uploaded On":
        sortField = "createdTime";
        break;
      case "Uploaded By":
        sortField = "createdBy";
        break;
      default:
        sortField = null;
    }
    setSortPrams({ sortField: sortField, sortOrder: sortOrder });
  }

  useEffect(() => {
    // getDocuments();
    if (sortParams?.sortField && sortParams?.sortOrder) {
      fetchDocuments(documentFilterOption);
    }
  }, [sortParams])

  const documentSort = async ({ sortField, sortOrder }) => {
    const url = `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/get-docs`;
    try {
      toast.loading("Fetching projects data");
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        params: {
          sortField: sortField,
          sortOrder: sortOrder,
        },
      };
      const response = await axios.get(url, config)
      toast.dismiss();
      setDocuments(response?.data?.data?.list);
      setDocumentFilterFields(response?.data?.data?.appliedFilter);
      setDocumentSortFields(response?.data?.data?.appliedSort);
      toast.success(response?.data?.message || "Succesfully fetched data");
    } catch (error) {
      toast.dismiss();
      toast.error("Error in fetching Timesheet data");
      console.error("Error in fetching client data : ", error);
    }
  }

  const getDocuments = async () => {
    const queryParams = new URLSearchParams();
    const company = documentFilterOption.relatedTo === "clients" ? documentFilterOption.relationId : null;
    if (documentFilterOption?.relatedTo === "clients" && documentFilterOption.companyIds && documentFilterOption.companyIds[0]) {
      queryParams.append("companyIds", JSON.stringify(documentFilterOption?.companyIds));
    } else {
      if (documentFilterOption.companyIds && documentFilterOption.companyIds[0]) {
        queryParams.append("companyIds", JSON.stringify(documentFilterOption.companyIds));
      }
      if (documentFilterOption.projectId) {
        queryParams.append("projectId", documentFilterOption.projectId);
      }
      if (documentFilterOption.documentType) {
        queryParams.append("documentType", documentFilterOption.documentType);
      }
    }
    if (documentFilterOption.documentId) queryParams.append("documentId", documentFilterOption.documentId);
    if (documentFilterOption.relatedTo && documentFilterOption.relatedTo !== "clients") queryParams.append("relatedTo", documentFilterOption.relatedTo);
    if (documentFilterOption.relationId && documentFilterOption.relatedTo !== "clients") {
      queryParams.append("relationId", documentFilterOption.relationId);
      queryParams.append("project", documentFilterOption.relationId);
    }
    if (currentState === "Recently Viewed")
      queryParams.append("recentlyViewed", true);

    // Convert query params into query string
    sortParams?.sortField && queryParams.append("sortField", sortParams.sortField);
    sortParams?.sortOrder && queryParams.append("sortOrder", sortParams.sortOrder);

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/get-docs${queryString ? `?${queryString}` : ""}`;

    try {
      if (window.location.pathname !== "/documents") return;
      const response = await axios.get(url, Authorization_header());
      toast.dismiss();
      setDocuments(response?.data?.data?.list);
      setDocumentFilterFields(response?.data?.data?.appliedFilter);
      setDocumentSortFields(response?.data?.data?.appliedSort);

    } catch (error) {
      toast.dismiss()
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
        return;
      }
      // toast.error("Error in fetching Documents!");
      console.error("Failed to fetch documents:", error);
    }
  };

  const fetchDocuments = async (options = {}) => {
    setDocumentFilterOption(options);
    const queryParams = new URLSearchParams();
    setIsDocFilterApplied(!!JSON.stringify(options));

    // Check if relatedTo is clients, if so, only include companyIds
    if (options.relatedTo === "clients" || options.relatedTo === "company" || options.relatedTo === "accounts") {
      queryParams.append("companyIds", JSON.stringify(options.companyIds));
    }
    if (options.relatedTo === "projects") {
      queryParams.append("projectIds", JSON.stringify([options.relationId]));
    }
    // Add other filters for non-client related queries
    if (options.companyId && options.companyId.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));

    if (options.projectId && options.projectId.length > 0)
      queryParams.append("projectIds", JSON.stringify(options.projectId));
    if (options.documentType && options.documentType?.length > 0)
      queryParams.append(
        "documentType",
        JSON.stringify(options.documentType)
      );
    if (options.status || options.status?.length > 0)
      queryParams.append(
        "status",
        JSON.stringify(options.status)
      );
    if (options.uploadedBy || options.uploadedBy?.length > 0)
      queryParams.append(
        "uploadedBy",
        JSON.stringify(options.uploadedBy)
      );
    if (options.minRnDPotential != null) {
      queryParams.append("minRnDPotential", options.minRnDPotential);
    }

    if (options.maxRnDPotential != null) {
      queryParams.append("maxRnDPotential", options.maxRnDPotential);

    }
    if (options?.sortField != null && options?.sortField) {
      queryParams.append("sortField", options.sortField)
    }
    if (options?.sortOrder != null && options?.sortOrder) {
      queryParams.append("sortOrder", options.sortOrder)
    }
    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }
    // Additional filtering conditions can be added here as needed
    if (options.documentId) queryParams.append("documentId", options.documentId);
    if (options.relatedTo && options.relatedTo !== "clients") queryParams.append("relatedTo", options.relatedTo);
    if (options.relationId && options.relatedTo !== "clients") {
      queryParams.append("relationId", options.relationId);
      queryParams.append("project", options.relationId);
    }
    if (currentState === "Recently Viewed")
      queryParams.append("recentlyViewed", true);

    // Convert query params into query string
    const queryString = queryParams.toString();

    // Construct the URL with query parameters

    const url = `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/get-docs${queryString ? `?${queryString}` : ""}`;

    try {
      if (window.location.pathname !== "/documents" && window.location.pathname !== "/projects/info" && window.location.pathname !== "/accounts/info") return;

      const response = await axios.get(url, Authorization_header());
      toast.dismiss();
      setDocuments(response?.data?.data?.list);
      setDocumentFilterFields(response?.data?.data?.appliedFilter);
      setDocumentSortFields(response?.data?.data?.appliedSort);

    } catch (error) {
      toast.dismiss()
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
        return;
      }
      // toast.error("Error in fetching Documents!");
      console.error("Failed to fetch documents:", error);
    }
  };

  // useEffect(() => {
  //   fetchDocuments();
  // }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        fetchDocuments,
        docFilterState,
        setDocFilterState,
        triggerClearFilters,
        clearFilterTrigger,
        isDocFilterApplied,
        setIsDocFilterApplied,
        setCurrentState,
        documentSort,
        getDocumentsSortParams,
        documentFilterFields,
        documentSortFields,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
