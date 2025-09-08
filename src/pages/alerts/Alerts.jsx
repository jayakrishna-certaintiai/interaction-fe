import { Paper, Table, TableContainer } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import TableIntro from "../../components/Common/TableIntro";
import { NotificationContext } from "../../context/NotificationContext";
import TableHeader from "../../components/Common/TableHeader";
import AlertsTableBody from "../../components/Alerts/AlertsTableBody";
import CustomPagination from "../../components/Common/CustomPagination";
import { updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import PanelTableHeader from "../../components/Timesheets/MainPanel/PanelTableHeader";
import TableHeader2 from "../../components/Common/TableHeader2";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

const tableData = {
  columns: ["Timestamp", "Alert"],
};

function Alerts() {
  const { alerts } = useContext(NotificationContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const totalPages = Math.ceil(alerts?.length / itemsPerPage);

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

  // Ensuring currentData always has 20 items
  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }

  useEffect(() => {
    const timeDifference = updateTimeDifference(alerts, "modifiedTime");
    setLatestUpdateTime(timeDifference);
  }, [alerts]);

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    if (alerts) {
      const filteredData = alerts?.filter((task) =>
        task?.alertDesc?.toLowerCase()?.includes(search?.toLowerCase())
      );
      setFilteredRows(filteredData);
      setCurrentPage(1);
    }
  }, [alerts, search]);

  const isSearch = useHasAccessToFeature("F041", "P000000009");

  return (
    <>
      {useHasAccessToFeature("F041", "P000000008") && (
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
            heading={"Alerts"}
            page={"alerts"}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={alerts?.length || 0}
            latestUpdateTime={latestUpdateTime}
            onSearch={handleSearch}
            searchPermission={isSearch}
          />
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHeader2 tableData={tableData} page={"alerts"} />
              <AlertsTableBody data={currentData} />
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={handleChangePage}
            changeItemsPerPage={handleChangeItemsPerPage}
            minRows={20}
          />
        </Paper>
      )}
    </>
  );
}

export default Alerts;
