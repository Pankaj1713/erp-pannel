import { DatePicker, FormItem, Select } from "components/ui";
import { Field } from "formik";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { APIS } from "constants/api.constant";
import { getApi } from "services/CommonService";
import { convertMinutesToTime } from "utils/utils";

const BookingDate = ({
  orderNumber,
  index,
  touched,
  errors,
  values,
  setFieldValue,
  activity,
  checkAdventureAvailablity,
}) => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (values?.date) {
      fetchSlots();
    }
  }, [values?.date]);

  useEffect(() => {
    if (slots.length > 0 && !values.slot) {
      setFieldValue("slot", slots[0].value);
    }
  }, [slots, setFieldValue, values.slot]);

  const fetchSlots = async () => {
    setLoading(true);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const params = {
      date: dayjs(values?.date).format("YYYY-MM-DD"),
      tzIdentifier: timeZone,
    };
    try {
      const res = await getApi(APIS.GET_SLOTS, params);
      const fetchedSlots = res?.data?.data || [];
      const convertedSlots = fetchedSlots.map((minutes) => ({
        label: convertMinutesToTime(minutes),
        value: minutes,
      }));
      setSlots(convertedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormItem
        label="Select Date"
        invalid={errors?.date && touched?.date}
        errorMessage={errors?.date}
      >
        <Field
          component={DatePicker}
          name="date"
          minDate={dayjs().toDate()}
          value={values?.date}
          placeholder="Select Date"
          onChange={(event) => setFieldValue("date", event)}
        />
      </FormItem>
      {values?.date && (
        <FormItem
          label="Select Slot"
          invalid={errors?.slot && touched?.slot}
          errorMessage={errors?.slot}
        >
          <Select
            name="slot"
            placeholder="Select Slot"
            options={slots}
            value={
              slots.find((option) => option.value === values.slot) || slots[0]
            }
            onChange={(option) => setFieldValue("slot", option.value)}
            isLoading={loading}
          />
        </FormItem>
      )}
    </div>
  );
};

export default BookingDate;
