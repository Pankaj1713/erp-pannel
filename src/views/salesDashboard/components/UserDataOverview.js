import React from "react";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";

const UserDataOverview = ({ data }) => {
  // Extract progressData from the data prop
  const progressData = data?.data?.progressData || [];

  // Prepare data for the chart
  const userChartSeries = [
    {
      name: "Users Added",
      data: progressData.map((item) => item.userAdded),
    },
  ];

  const userChartXAxis = progressData.map(
    (item) => `${item.monthName} ${item.year}`
  );

  return (
    <div className="mt-8">
      <h4>User Data Overview</h4>
      <Chart
        series={userChartSeries}
        xAxis={userChartXAxis}
        type="line"
        customOptions={{
          colors: [COLORS[1]],
          legend: { show: true },
          yaxis: {
            labels: {
              formatter: (value) => value.toFixed(2),
            },
          },
        }}
      />
    </div>
  );
};

export default UserDataOverview;
