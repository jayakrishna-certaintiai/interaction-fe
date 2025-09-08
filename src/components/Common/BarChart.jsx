import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import BarChartTitle from "./BarChartTitle";
import { createObjectFromArray } from "../../utils/helper/DiffBwDays";

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

function BarChart({
  title,
  categories,
  data,
  dataType,
  labels,
  redirect = true,
  customLabel,
  xaxis,
  yaxis
}) {
  const [labelObj, setLabelObj] = useState(null);
  const [sortBy, setSortBy] = useState("value");
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    setLabelObj(createObjectFromArray(data, labels));
  }, [data, labels]);

  const categoryToDataMap = {};
  categories?.forEach((category, index) => {
    categoryToDataMap[category] = data?.[index];
  });

  const categoryDataPairs = Object.entries(categoryToDataMap).map(
    ([category, value]) => ({
      category,
      value,
    })
  );

  if (sortBy === "value") {
    categoryDataPairs.sort((a, b) =>
      ascending ? a.value - b.value : b.value - a.value
    );
  } else {
    categoryDataPairs.sort((a, b) =>
      ascending ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
    );
  }

  const sortedCategories = categoryDataPairs.map((pair) => pair.category);
  const sortedData = categoryDataPairs.map((pair) => pair.value);

  const options = {
    chart: {
      type: "bar",
      height: "70%",
      plotBackgroundColor: null,
      plotBorderWidth: 1,
      plotBorderColor: "#E4E4E4",
    },
    exporting: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: sortedCategories,
      title: {
        text: xaxis,
      },
      labels: {
        rotation: 0,
        formatter: function () {
          return this.value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        },
        style: {
          color: "#404040",
          fontSize: "0.6rem",
          fontWeight: "600",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: yaxis,
        align: "high",
      },
      labels: {
        formatter: function () {
          const value = this.value;
          if (value >= 1e9) {
            return (value / 1e9).toFixed(1) + 'B';
          } else if (value >= 1e6) {
            return (value / 1e6).toFixed(1) + 'M';
          } else if (value >= 1e3) {
            return (value / 1e3).toFixed(1) + 'K';
          } else {
            return value.toFixed(1).toLocaleString('en-US');
          }
        },
        style: {
          color: "#404040",
          fontSize: "0.6rem",
          fontWeight: "600",
        },
      },
      opposite: true,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: title,
        data: sortedData,
        color: "#00A398",
        maxPointWidth: 20,
      },
    ],
    tooltip: {
      shared: true,
      style: {
        fontSize: "12px",
        fontWeight: "500",
      },
      formatter: function () {
        const value = this.y;
        let formattedValue;

        if (value >= 1e9) {
          formattedValue = (value / 1e9).toFixed(1) + 'B';
        } else if (value >= 1e6) {
          formattedValue = (value / 1e6).toFixed(1) + 'M';
        } else if (value >= 1e3) {
          formattedValue = (value / 1e3).toFixed(1) + 'K';
        } else {
          formattedValue = value.toFixed(1).toLocaleString('en-US');
        }

        return this.x + ": " + formattedValue;
      },
    },
  };

  const chartContainerStyle = {
    width: "100%",
    maxWidth: "600px",
  };

  return (
    <div style={chartContainerStyle}>
      <div style={headerStyle}>
        <BarChartTitle
          title={title}
          onSortClick={() => setAscending(!ascending)}
          onSortByNameClick={() => setSortBy(sortBy === "value" ? "name" : "value")}
          ascending={ascending}
          redirect={redirect}
          sortBy={sortBy}
        />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default BarChart;