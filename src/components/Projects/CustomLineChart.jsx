import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomLineChart = ({ totalBudget, totalExpense, rndExpense, date }) => {
  // Assuming that totalBudget, totalExpense, rndExpense, and date are arrays of the same length
  const data = date?.map((d, index) => ({
    date: d,
    totalBudget: (totalBudget[index] && totalBudget !== NaN) || 0,
    totalExpense: (totalExpense[index] && totalExpense != NaN) || 0,
    rndExpense: (rndExpense[index] && rndExpense[index] !== NaN) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalBudget" stroke="#8884d8" />
        <Line type="monotone" dataKey="totalExpense" stroke="#82ca9d" />
        <Line type="monotone" dataKey="rndExpense" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;