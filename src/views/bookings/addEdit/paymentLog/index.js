import { AdaptableCard } from "components/shared";
import React from "react";
import moment from "moment";
import { Timeline, Avatar, Badge, Card, Tag } from "components/ui";
import { formatAmount } from "utils/helpers";
import { BsReceipt } from "react-icons/bs";
import { useConfig } from "components/ui";

const PaymentLog = ({ id, values }) => {
  const { themeColor } = useConfig;
  return (
    values?.paymentTransactions?.length > 0 && (
      <AdaptableCard divider border>
        <h5 className="mb-5">Payment Log</h5>
        {values?.paymentTransactions?.map((status, index) => {
          return (
            <Timeline.Item
              key={index}
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
              <p className="my-1  text-lg flex items-center">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatAmount(status?.amount)}
                </span>
                <span className="mx-2 text-green-700 font-semibold ">
                  Payment Paid
                </span>
              </p>
              <p className="font-semibold mb-2">
                {moment(status?.createdAt).format("hh:mm a, MMMM Do YYYY")}
              </p>
              <Tag
                className="my-2  rtl:ml-2 cursor-pointer"
                prefix
                prefixClass="bg-rose-500"
              >
                {status?.method}
              </Tag>
              <Tag
                className="my-2 ml-3 rtl:ml-2 cursor-pointer"
                prefix
                prefixClass="bg-green-500"
              >
                {status?.status}
              </Tag>
              {status?.paymentId && (
                <div className="mt-2 text-xs">
                  <span className="my-2  font-semibold bg-green-100 text-green-600 rounded-full p-2 whitespace-nowrap">{`Payment ID : ${status?.paymentId}`}</span>
                </div>
              )}
            </Timeline.Item>
          );
        })}
      </AdaptableCard>
    )
  );
};

export default PaymentLog;
