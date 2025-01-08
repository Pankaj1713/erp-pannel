import React, { useEffect, useState } from "react";
import { Loading } from "components/shared";
import ProjectDashboardHeader from "./components/salesDashboardHeader";
import TaskOverview from "./components/TaskOverview";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { useSelector } from "react-redux";
import UserDataOverview from "./components/UserDataOverview";
// import MyTasks from "./components/MyTasks";
// import Projects from "./components/Projects";
// import Schedule from "./components/Schedule";
// import Bookings from "./components/Bookings";

const ProjectDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projectOverviewData, setProjectOverviewData] = useState(null);
  const [myTasksData, setMyTasksData] = useState(null);

  const { name } = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      const startDate = "2024-08-01";
      const endDate = "2024-08-30";

      const res = await getApi(APIS.GET_DASHBOARD_DETAILS, {
        startDate,
        endDate,
      });

      setMyTasksData(res);

      const formattedData = {
        monthly: {
          total: res?.data?.totalRevenue || 0,
          series: [
            {
              name: "Total Revenue",
              data:
                res?.data?.progressData.map((item) => item.netRevenue) || [],
            },
          ],
          range:
            res?.data?.progressData.map(
              (item) => `${item.monthName} ${item.year}`
            ) || [],
        },
      };

      setProjectOverviewData(formattedData);
    } catch (error) {
      console.error("Failed to fetch project dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4 h-full">
      <Loading loading={loading}>
        <ProjectDashboardHeader
          data={{ name, taskCount: projectOverviewData?.total || 0 }}
        />
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 flex-auto">
            <TaskOverview data={projectOverviewData} />
            <UserDataOverview data={myTasksData} />
            {/* <MyTasks data={myTasksData} />
            <Projects data={projectsData} /> */}
          </div>
          <div className="flex flex-col gap-4">
            <div className="xl:w-[380px]">
              {/* <Schedule data={scheduleData} /> */}
              {/* <Bookings data={activitiesData} /> */}
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default ProjectDashboard;
