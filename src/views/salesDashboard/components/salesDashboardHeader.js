import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "views/bookingDashboard/header";
import { APIS } from "constants/api.constant";
import { getApi } from "services/CommonService";
import { useDispatch, useSelector } from "react-redux";

const RevenueCard = ({ title, value, children }) => (
  <Card
    variant="outlined"
    sx={{ height: "160px", display: "flex", alignItems: "center" }}
  >
    <CardContent sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Typography variant="h5" sx={{ mt: 2 }}>
        {value}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const ProjectDashboardHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [revenue, setRevenue] = useState();
  const data = useSelector((state) => state.auth.user.appConfig[0]);
  const dispatch = useDispatch();

  useEffect(() => {
    getRevenueData();
  }, [startDate, endDate]);

  const getRevenueData = () => {
    getApi(APIS.GET_DASHBOARD_DETAILS, {
      startDate,
      endDate,
    }).then((res) => {
      setRevenue(res?.data);
    });
  };

  return (
    <>
      {/* First row with 3 cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        mt={4}
        gap={isMobile ? "20px" : "30px"}
        justifyContent={isMobile ? "center" : "space-between"}
      >
        <Box sx={{ flexBasis: isMobile ? "100%" : "30%" }}>
          <RevenueCard
            title=" Net Revenue of Last 6 Months"
            value={`${data?.globalCurrency} ${(
              revenue?.totalRevenue || 0
            ).toFixed(2)} `}
          />
        </Box>
        <Box sx={{ flexBasis: isMobile ? "100%" : "30%" }}>
          <RevenueCard
            title="Net Revenue"
            value={`${data?.globalCurrency} ${(
              revenue?.netRevenue || 0
            ).toFixed(2)}`}
          />
        </Box>
        <Box sx={{ flexBasis: isMobile ? "100%" : "30%" }}>
          <RevenueCard
            title="Taxes"
            value={`${data?.globalCurrency} ${(revenue?.taxPaid || 0).toFixed(
              2
            )}`}
          />
        </Box>
      </Box>

      {/* Full-width Header */}
      <Box sx={{ mt: 4 }}>
        <Header
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          showUserSelect={false}
        />
      </Box>

      {/* Second row with remaining cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        mt={4}
        gap={isMobile ? "20px" : "30px"}
        justifyContent={isMobile ? "center" : "space-between"}
      >
        <Box sx={{ flexBasis: isMobile ? "100%" : "30%" }}>
          <RevenueCard
            title="Top Service Revenue Details"
            value={`${data?.globalCurrency} ${
              revenue?.topService?.totalRevenue || 0
            } `}
          >
            <Typography variant="body2">
              Service Name: {revenue?.topService?.name}
            </Typography>
            <Typography variant="body2">
              Count: {revenue?.topService?.count}
            </Typography>
            <Typography variant="body2">
              Price:{" "}
              {`${data?.globalCurrency} ${revenue?.topService?.price || 0} `}
            </Typography>
          </RevenueCard>
        </Box>
        <Box sx={{ flexBasis: isMobile ? "100%" : "30%" }}>
          <RevenueCard
            title="Top Package Revenue Details"
            value={`${data?.globalCurrency} ${
              revenue?.topPackage?.totalRevenue || 0
            } `}
          >
            <Typography variant="body2">
              Package Name: {revenue?.topPackage?.name}
            </Typography>
            <Typography variant="body2">
              Count: {revenue?.topPackage?.count}
            </Typography>
            <Typography variant="body2">
              Price:{" "}
              {`${data?.globalCurrency} ${revenue?.topPackage?.price || 0}`}
            </Typography>
          </RevenueCard>
        </Box>
        <Box sx={{ flexBasis: isMobile ? "100%" : "30%" }}>
          <RevenueCard
            title="User Acquired"
            value={`Total user added: ${revenue?.userAdded || 0}`}
          />
        </Box>
      </Box>
    </>
  );
};

export default ProjectDashboardHeader;
