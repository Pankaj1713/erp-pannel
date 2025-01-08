import { AdaptableCard } from "components/shared";
import {
  Avatar,
  Button,
  Card,
  FormItem,
  Input,
  Notification,
  Timeline,
  toast,
} from "components/ui";
import { APIS } from "constants/api.constant";
import { Field } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { postApi } from "services/CommonService";
import { statusDisabled } from "utils/helpers";

const OrderNotes = ({ orderNumber, values, setFieldValue }) => {
  return (
    <AdaptableCard divider border>
      <FormItem label="Order Note">
        <Field
          textArea
          name="bookingNotes"
          value={values?.bookingNotes}
          placeholder="Order Note"
          component={Input}
          onChange={(e) => {
            setFieldValue("bookingNotes", e.target.value);
          }}
          disabled={statusDisabled(values?.status)}
        />
      </FormItem>
      {values?.orderNotes?.length > 0 && (
        <div className="my-5">
          <h4 className="mb-3">Notes Timeline</h4>
          {/* {values?.orderNotes?.map((note, index) => {
            return (
              <Timeline.Item
                key={index}
                media={
                  <Avatar
                    size={50}
                    className={`text-green-700 bg-green-100 rounded-full `}
                  >
                    <MdOutlineSpeakerNotes className="text-2xl" />
                  </Avatar>
                }
              >
                <p className="my-1 text-green-600 font-semibold text-base flex items-center">
                  {note?.addedBy?.name}
                </p>
                <p className="font-semibold mb-2">
                  {moment(note?.createdAt).format("hh:mm a, MMMM Do YYYY")}
                </p>
                <Card className="mt-4 text-green-700 bg-green-100">
                  <p>{note?.notes}</p>
                </Card>
              </Timeline.Item>
            );
          })} */}
        </div>
      )}
    </AdaptableCard>
  );
};

export default OrderNotes;
