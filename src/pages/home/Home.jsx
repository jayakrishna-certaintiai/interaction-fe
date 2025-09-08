import { Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import BarChart from "../../components/Common/BarChart";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { useAuthContext } from "../../context/AuthProvider";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { Authorization_header } from "../../utils/helper/Constant";
import toast from "react-hot-toast";

const chartPaperStyle = {
  p: 1,
  flex: 1,
  borderRadius: "20px",
  height: "500px",
  boxShadow: "0px 3px 6px #0000001F",
};
const layoutBoxStyle = {
  width: "98%",
  mx: "auto",
  display: "flex",
  mt: 1,
  gap: "20px",
};

function Home() {
  const [companies, setCompanies] = useState(null);
  const [rndExpenses, setRndExpenses] = useState([]);
  const [companiWiseMatrix, setCompaniwiseMatrix] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const { logout } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (window.location.pathname !== "/") return;
        const userId = localStorage.getItem("userid");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }
        const response1 = await axios.get(
          `${BaseURL}/api/v1/home/${userId}/get-kpis`, Authorization_header()
        );
        setCompaniwiseMatrix(response1.data.data.companyWiseMetrics);
      } catch (error) {
        console.error("error message :", error?.response?.data?.message);
        if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
          toast.error("Session expired, you need to login again");
          logout();
        }
        if (error) {

        }
        console.error(error);
      }
    };
    fetchData();
  }, [localStorage?.getItem("keys")])

  useEffect(() => {
    const newCompanies = companiWiseMatrix.map(c => c.companyName);
    setCompanies(newCompanies);
    const rndExpenseCumulativeSum = companiWiseMatrix.map(c => c.rndExpenseCumulativeSum);
    setRndExpenses(rndExpenseCumulativeSum);
    const totalExpenseSum = companiWiseMatrix.map(c => c.totalExpenseSum);
    setTotalExpense(totalExpenseSum);

  }, [localStorage?.getItem("keys"), companiWiseMatrix]);
  const customLabel = {
    rotation: 0,
    format: "{text}",
    overflow: "justify",
  };
  const customLabel1 = {
    rotation: 0,
    format: "{text}%",
    overflow: "justify",
  };
  const customLabel3 = {
    rotation: 0,
    format: "{text}",
    overflow: "justify",
  };
  return (
    <div>
      {useHasAccessToFeature("F039", "P000000008") && (
        <Box sx={layoutBoxStyle}>
          <Paper sx={chartPaperStyle}>
            <BarChart
              title={"QRE Expense By Account (% of Total Expense)"}
              data={rndExpenses}
              categories={companies}
              redirect={false}
              customLabel={customLabel1}
              dataType={"percentage"}
              labels={companies}
              xaxis={"Accounts"}
              yaxis={"Total QRE Expenses"}
            />
          </Paper>
          <Paper sx={chartPaperStyle}>
            <BarChart
              title={"Total Expenses By Account"}
              data={totalExpense}
              categories={companies}
              redirect={false}
              customLabel={customLabel}
              xaxis={"Accounts"}
              yaxis={"Total Expenses"}
            />
          </Paper>
        </Box>
      )}
    </div>
  );
}

export default Home;
