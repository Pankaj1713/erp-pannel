import React, { useState } from "react";
import { CalendarView, Container } from "components/shared";
import OpenBooking from "./openBooking";

const Calendar = ({ bookings, startDate }) => {
  const [drawer, setDrawer] = useState(false);

  const [dayData, setDayData] = useState();

  const onCellSelect = (event) => {};

  const onEventClick = (arg) => {
    const { extendedProps } = arg.event;

    setDayData(extendedProps);
    setDrawer(true);
  };

  const onEventChange = (arg) => {
    // const newEvents = cloneDeep(arg?.events).map((event) => {
    //   console.log("event",event)
    //   if (arg.event.id === event.id) {
    //     const { id, extendedProps, start, end, title } = arg.event;
    //     event = {
    //       id,
    //       start,
    //       end,
    //       title,
    //       eventColor: extendedProps.eventColor,
    //     };
    //   }
    //   return event;
    // });
    // console.log("newEvent",newEvents)
  };

  return (
    <Container className="h-full">
      <CalendarView
        events={bookings}
        eventClick={onEventClick}
        select={onCellSelect}
        setDayData={setDayData}
        editable
        selectable
        startDate={startDate}
        eventDrop={onEventChange}
      />
      <OpenBooking
        show={drawer}
        onClose={() => {
          setDrawer(false);
        }}
        data={dayData}
      />
    </Container>
  );
};

export default Calendar;
