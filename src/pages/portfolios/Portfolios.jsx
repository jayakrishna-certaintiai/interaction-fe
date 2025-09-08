import { Paper, Table, TableContainer } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomPagination from "../../components/Common/CustomPagination";
import TableHeader2 from "../../components/Common/TableHeader2";
import TableIntro from "../../components/Common/TableIntro";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import AddPortfolioModal from "../../components/Portfolios/AddPortfolioModal";
import PortfoliosTableBody from "../../components/Portfolios/PortfoliosTableBody";
import { PortfolioContext } from "../../context/PortfolioContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { getTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { FilterListContext } from "../../context/FiltersListContext";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
const tableData = {
  columns: [
    "Name",
    "Projects",
    "Account",
    "Created On",
    "Created By",
    "QRE Expense",
    // "",
  ],
  rows: [
    {
      id: 1,
      name: "Rogers",
      project: "12",
      company: "Apple Inc.",
      createdOn: "12/12/2023",
      createdBy: "Prabhu Balakrishnan",
      rndExpense: "$ 12,213.59",
    },
    // ...add more rows as needed
  ],
};

function Portfolios() {
  const {
    portfolioFilters,
    portfolios,
    fetchPortfolios,
    setIsPortfolioFilterApplied,
    setCurrentState,
    currentState,
  } = useContext(PortfolioContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const { pinnedObject } = usePinnedData();
  const { fetchUserDetails } = useContext(FilterListContext);
  const [pinStates, setPinStates] = useState({
    "All Portfolios": false,
    "Recently Viewed": false,
  });

  const totalPages = Math.ceil(filteredRows?.length / itemsPerPage);

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  let currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }

  const appliedFilters = {
    Clients: portfolioFilters.company,
    MinimumProjects: portfolioFilters.NoOfProjects[0],
    MaximumProjects: portfolioFilters.NoOfProjects[1],
  };
  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchPortfolios(filters);
      setIsPortfolioFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  let portfolioOptions = {
    ...(portfolioFilters.companyId.length > 0 && {
      companyIds: portfolioFilters.companyId,
    }),
    ...(portfolioFilters.NoOfProjects && {
      minProjects: portfolioFilters.NoOfProjects[0],
    }),
    ...(portfolioFilters.NoOfProjects && {
      maxProjects: portfolioFilters.NoOfProjects[1],
    }),
  };

  useEffect(() => {
    setCurrentState(
      pinnedObject?.PORT === "RV" ? "Recently Viewed" : "All Portfolios"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const updatedPinStates = {
      "All Portfolios": pinnedObject.PORT === "ALL",
      "Recently Viewed": pinnedObject.PORT === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.PORT]);

  useEffect(() => {
    const shouldFetchWithFiltersPortfolio =
      portfolioFilters.companyId.length > 0;
    if (shouldFetchWithFiltersPortfolio) {
      fetchPortfolios(portfolioOptions);
    } else {
      fetchPortfolios();
    }
  }, [currentState]);

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    if (portfolios) {
      const filteredData = portfolios?.filter(
        (task) =>
          task?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.createdBy?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.RnDExpenseCumulative?.toLowerCase()?.includes(
            search?.toLowerCase()
          ) ||
          task?.client?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.projects?.toString()?.includes(search) ||
          formattedDate(task?.createdTime)
            ?.toLowerCase()
            ?.includes(search?.toLowerCase())
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
      setCurrentPage(1);
    }
  }, [portfolios, search]);

  useEffect(() => {
    const timeDifference = getTimeDifference(portfolios, "createdOn");
    setLatestUpdateTime(timeDifference);
  }, [portfolios]);

  const isCreate = useHasAccessToFeature("F032", "P000000007");
  const isSearch = useHasAccessToFeature("F032", "P000000009");

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const togglePinState = (selectedHeading) => {
    setPinStates((prevStates) => {
      const resetStates = Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      const newState = {
        ...resetStates,
        [selectedHeading]: !prevStates[selectedHeading],
      };

      const allFalse =
        !newState["All Portfolios"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Portfolios"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      PORT: newState,
    };

    const pinString = Object.entries(newPinnedObject)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");

    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ pin: pinString }),
    };

    try {
      const response = await axios.request(config);

      fetchUserDetails();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Portfolios" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  return (
    <>
      {useHasAccessToFeature("F032", "P000000008") && (
        <Paper
          sx={{
            display: "flex",
            width: "98%",
            mx: "auto",
            mt: 2,
            flexDirection: "column",
            borderRadius: "20px",
            mb: 3,
            boxShadow: "0px 3px 6px #0000001F",
          }}
        >
          <TableIntro
            heading={
              pinnedObject?.PORT === "RV" ? "Recently Viewed" : "All Portfolios"
            }
            btnName={"New Portfolio"}
            page={"portfolio"}
            totalItems={filteredRows?.length || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onUploadClick={handleUploadClick}
            onSearch={handleSearch}
            latestUpdateTime={latestUpdateTime?.difference}
            items={["All Portfolios", "Recently Viewed"]}
            onApplyFilters={applyFiltersAndFetch}
            appliedFilters={appliedFilters}
            createPermission={isCreate}
            searchPermission={isSearch}
            onSelectedItem={handleSelectedHeaderItem}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <AddPortfolioModal
            open={modalOpen}
            handleClose={handleModalClose}
            fetchParentData={fetchPortfolios}
          />
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHeader2 tableData={tableData} />
              <PortfoliosTableBody data={currentData} />
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={handleChangePage}
            changeItemsPerPage={handleChangeItemsPerPage}
            minRows={20}
          />
          <Toaster />
        </Paper>
      )}
    </>
  );
}

export default Portfolios;
