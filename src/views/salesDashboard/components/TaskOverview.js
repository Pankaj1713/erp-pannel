import React, { useState, useEffect } from "react";
import { Card, Segment, Badge } from "components/ui";
import { Loading } from "components/shared";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

const ChartLegend = ({ label, value, badgeClass, showBadge = true }) => {
  return (
    <div className="flex gap-2">
      {showBadge && <Badge className="mt-2.5" innerClass={badgeClass} />}
      <div>
        <h5 className="font-bold">{value}</h5>
        <p>{label}</p>
      </div>
    </div>
  );
};

const TaskOverview = ({ data = {}, className }) => {
  const [timeRange, setTimeRange] = useState(["monthly"]);
  const currencyData = useSelector((state) => state.auth.user.appConfig[0]);

  const [repaint, setRepaint] = useState(false);

  const sideNavCollapse = useSelector(
    (state) => state.theme.layout.sideNavCollapse
  );

  useEffect(() => {
    setRepaint(true);
    const timer1 = setTimeout(() => setRepaint(false), 300);

    return () => {
      clearTimeout(timer1);
    };
  }, [data, sideNavCollapse]);

  return (
    <Card className={className}>
      <div className="flex sm:flex-row flex-col md:items-center justify-between mb-6 gap-4">
        <h4>Revenue Overview</h4>
        <Segment
          value={timeRange}
          onChange={(val) => setTimeRange(val)}
          size="sm"
        >
          <Segment.Item value="monthly">Monthly</Segment.Item>
          {/* <Segment.Item value="weekly">Weekly</Segment.Item>
          <Segment.Item value="daily">Daily</Segment.Item> */}
        </Segment>
      </div>
      {!isEmpty(data) && !repaint && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <ChartLegend
                showBadge={false}
                label="Total Revenue"
                value={`${
                  currencyData?.globalCurrency
                } ${data.monthly.total.toFixed(2)}`}
              />
            </div>
            <div className="flex gap-x-6"></div>
          </div>
          <div>
            <Chart
              series={data.monthly.series}
              xAxis={data.monthly.range}
              type="bar"
              customOptions={{
                colors: [COLORS[0], COLORS[2]],
                legend: { show: false },
                yaxis: {
                  labels: {
                    formatter: (value) => value.toFixed(2),
                  },
                },
                tooltip: {
                  y: {
                    title: {
                      formatter: () => "Net Revenue",
                    },
                  },
                },
              }}
            />
          </div>
        </>
      )}
      <Loading loading={repaint} type="cover">
        {repaint && <div className="h-[300px]" />}
      </Loading>
    </Card>
  );
};

export default TaskOverview;
