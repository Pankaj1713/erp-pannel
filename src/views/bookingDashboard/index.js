import React, { useEffect, useState } from "react";
import Header from "./header";
import Calendar from "./calendar";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";

const Dashboard = () => {
  const [bookings, setBookings] = useState();
  const [user, setUser] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    userData();
  }, [user, startDate, endDate]);

  const userData = () => {
    const newUser = user?.[0]?._id;

    getApi(APIS.GET_BOOKINGS, {
      userId: newUser,
      startDate: startDate,
      endDate: endDate,
    }).then((res) => {
      const result = res?.data?.data;
      result?.map((data) => {
        data.start = data?.start;
        data.end = data?.end;
        data.title = data?.userId?.name;
      });
      setBookings(result);
    });
  };

  return (
    <div>
      <Header
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setUser={setUser}
      />
      <Calendar startDate={startDate} bookings={bookings} />
    </div>
  );
};

export default Dashboard;
