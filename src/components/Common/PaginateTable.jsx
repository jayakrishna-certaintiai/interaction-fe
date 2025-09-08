import React, { useState } from "react";
import { TablePagination } from "@mui/material";

function PaginateTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handler for page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handler for rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TablePagination
        component="div"
        count={7}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default PaginateTable;
