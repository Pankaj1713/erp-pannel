import React from "react";
import { AdaptableCard } from "components/shared";
import { Button, Drawer } from "components/ui";
import { OrderStatusTag } from "views/bookings";

const OpenBooking = ({ data, show, onClose }) => {
  //// SUBMIT TAGS HANDLER///////

  const billingDetails = [
    {
      label: "Booking Status",
      value: <OrderStatusTag status={data?.status} />,
    },

    { label: "Name:", value: data?.userId?.name },
    {
      label: "Gender:",
      value:
        (data?.userId?.gender === 0 && "Male") ||
        (data?.userId?.gender === 1 && "Female") ||
        (data?.userId?.gender === 2 && "Both"),
    },
    { label: "Age:", value: data?.userId?.age },
    {
      label: "Email:",
      value: (
        <a href={"mailto:" + data?.userId?.email}>{data?.userId?.email}</a>
      ),
    },
    {
      label: "Phone Number",
      value: (
        <a href={"tel:" + data?.phoneNumber}>
          {data?.userId?.countryCode + data?.userId?.phoneNumber}
        </a>
      ),
    },

    {
      label: "Order Notes:",
      value: data?.bookingNotes || "-",
    },
  ];
  return (
    <Drawer
      isOpen={show}
      onClose={onClose}
      onRequestClose={onClose}
      closable={false}
      bodyClass={`p-0   `}
      title={`Booking Details - ${data?.orderNumber}`}
    >
      <AdaptableCard divider className={`text-base  text-black `}>
        <table className="flex flex-col mb-5">
          {billingDetails?.map((detail, index) => {
            return (
              <tr key={index} className="flex w-full justify-between   mb-2">
                <td className="w-2/5 text-green-600">{detail?.label}</td>
                <td className="w-3/5  items-start">{detail?.value}</td>
              </tr>
            );
          })}
        </table>

        <Button
          variant="solid"
          size="sm"
          onClick={(row) => {
            window.open(`/app/bookings/edit/${data?.orderNumber}`);
          }}
        >
          For More Details
        </Button>
      </AdaptableCard>
    </Drawer>
  );
};

export default OpenBooking;
