import React, { useEffect, useState } from "react";
import { Card, Button, Timeline, Avatar, useConfig } from "components/ui";

import { useNavigate } from "react-router-dom";

import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { BsReceipt } from "react-icons/bs";
import moment from "moment";
import { OrderStatusTag } from "views/bookings";

const Bookings = () => {
  const [bookings, setBookings] = useState();
  const { themeColor } = useConfig;
  const navigate = useNavigate();

  useEffect(() => {
    getApi(APIS.GET_BOOKINGS, {
      limit: 5,
    }).then((res) => {
      setBookings(res?.data?.data);
    });
  }, []);

  // console.log({ bookings });
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h4>Recent Bookings</h4>
        <Button onClick={() => navigate("/app/bookings")} size="sm">
          View All
        </Button>
      </div>
      <div className="mt-6">
        <Timeline>
          {bookings?.map((event, index) => (
            <Timeline.Item
              key={event?._id}
              media={
                <Avatar
                  size={50}
                  className={`text-green-700 bg-green-100 rounded-full `}
                >
                  <BsReceipt
                    className={`text-${themeColor}-700 bg-${themeColor}-200 text-2xl`}
                  />
                </Avatar>
              }
            >
              <p className="my-1  text-sm flex items-center">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {event?.fullName}
                  <span className="mx-2 text-green-700 font-semibold ">
                    ({event?.bookingNo})
                  </span>
                </span>
              </p>
              <p className="font-semibold mb-2">
                {moment(event?.createdAt).format("hh:mm a, MMMM Do YYYY")}
              </p>
              <p className="font-semibold ">
                Status : <OrderStatusTag status={event?.status} />
              </p>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </Card>
  );
};

export default Bookings;
