import { Box, Table, TableContainer } from '@mui/material'
import React from 'react'
import MiniTableHeader from '../Common/MiniTableHeader'
import CompanyWorkflowsTableBody from './CompanyWorkflowsTableBody';

const tableData = {
    columns: [
      "Workflow ID",
      "Type",
      "Primary Contact",
      "Created On",
      "Created By",
    ],
    rows: [
      {
        id: 1,
        workflowId: "00001002",
        type: "Company Onboarding",
        primaryContact: "Ezra Romero",
        createdOn: "29/11/2023 12:35:12",
        createdBy:"Prabhu Balakrishnan",
      },
      {
        id: 2,
        workflowId: "00001002",
        type: "Claims",
        primaryContact: "Ezra Romero",
        createdOn: "29/11/2023 12:35:12",
        createdBy:"Prabhu Balakrishnan",
      },
    ],
  };

function CompanyWorkflows() {
  return (
    <>
        <Box>
        <TableContainer
          sx={{
            width: "100%",
            maxWidth: "46vw",
            overflowX: "auto",
            // scrollbarWidth: "none",
            // msOverflowStyle: "none",
            // "&::-webkit-scrollbar": {
            //   display: "none",
            // },
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <MiniTableHeader tableData={tableData} />
            <CompanyWorkflowsTableBody filledRows={tableData.rows}/>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

export default CompanyWorkflows